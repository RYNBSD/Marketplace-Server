import type { ConvertedFile, SupportedFileTypes } from "../../types/index.js";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import ffmpeg, { type FfprobeData } from "fluent-ffmpeg";
import sharp from "sharp";
import fileType, { type FileExtension } from "file-type";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../../error/index.js";
import { schema } from "../../schema/index.js";
import { EXTENSIONS } from "../../constant/enum.js";

const { toBoolean } = schema.validators;

class FileTmp {
  constructor() {}

  protected randomFileName() {
    return Math.round(Date.now() * Math.random());
  }

  protected async bufferToFile(file: Buffer, ext: FileExtension) {
    const randomName = this.randomFileName();
    const filePath = path.join(tmp.path, `${randomName}.${ext}`);
    await writeFile(filePath, file);
    return filePath;
  }

  protected async fileToBuffer(path: string) {
    return readFile(path);
  }
}

export default class FileConverter extends FileTmp {
  private readonly files: Buffer[] = [];
  private isFfmpegInit = false;
  private cleanTmp = false;

  constructor(...files: Buffer[]) {
    super();
    this.files = files;
  }

  private async format(file: Buffer) {
    return (await fileType.fromBuffer(file))?.ext ?? "";
  }

  private async ffprobeMetadata(path: string) {
    return new Promise<FfprobeData>((resolve, reject) => {
      ffmpeg.ffprobe(path, (err, metadata) => {
        if (toBoolean.parse(err)) return reject(err);
        return resolve(metadata);
      });
    });
  }

  private async toWebp(image: Buffer) {
    return (
      sharp(image)
        .webp({ quality: 100 })
        // .resize({ width: 1280, height: 720, fit: "cover" })
        .toBuffer()
    );
  }

  private async initFfmpeg() {
    if (this.isFfmpegInit) return;

    const [{ path: ffmpegPath }, { path: ffprobePath }] = await Promise.all([
      import("@ffmpeg-installer/ffmpeg"),
      import("@ffprobe-installer/ffprobe"),
    ]);
    ffmpeg.setFfmpegPath(ffmpegPath);
    ffmpeg.setFfprobePath(ffprobePath);
  }

  private async toMp4(video: Buffer, ext: FileExtension) {
    this.cleanTmp = true;
    const input = await this.bufferToFile(video, ext);
    const output = path.join(tmp.path, `${this.randomFileName()}.mp4`);

    return new Promise<Buffer>((resolve, reject) => {
      ffmpeg(input)
        .fps(30)
        .videoCodec("libx264")
        .audioCodec("aac")
        .audioQuality(0) // Set audio quality to 0 for default compression
        // .addOption("-preset", "slow") // Use the 'slow' preset for better compression
        // .addOption("-crf", "23") // Constant Rate Factor (0-51, where lower is better quality. 23 is default.)
        .format("mp4")
        .output(output)
        .on("end", () => {
          this.fileToBuffer(output).then(resolve).catch(reject);
        })
        .on("error", reject)
        .run();
    });
  }

  private async toMp3(audio: Buffer, ext: FileExtension) {
    this.cleanTmp = true;
    const input = await this.bufferToFile(audio, ext);
    const output = path.join(tmp.path, `${this.randomFileName()}.mp3`);

    return new Promise<Buffer>((resolve, reject) => {
      ffmpeg(input)
        .audioCodec("libmp3lame") // MP3 audio codec
        .audioBitrate("128k") // Audio bitrate: 128 kbps
        .format("mp3")
        .output(output)
        .on("end", () => {
          this.fileToBuffer(output).then(resolve).catch(reject);
        })
        .on("error", reject)
        .run();
    });
  }

  private async toGlb(model: Buffer) {
    return model;
  }

  private async fileType(buffer: Buffer): Promise<ConvertedFile | null> {
    const ext = await this.format(buffer);
    let type: SupportedFileTypes;

    if (EXTENSIONS.IMAGES.includes(ext)) type = "image";
    else if (ext === "glb") type = "model";
    else if (EXTENSIONS.VIDEO.includes(ext)) {
      type = "video";
      const input = await this.bufferToFile(buffer, ext as FileExtension);
      const metadata = await this.ffprobeMetadata(input);
      const duration = Math.floor(metadata.format.duration ?? Infinity);
      if (duration > 60) return null;
    } else if (EXTENSIONS.AUDIO.includes(ext)) {
      type = "audio";
      const input = await this.bufferToFile(buffer, ext as FileExtension);
      const metadata = await this.ffprobeMetadata(input);
      const duration = Math.floor(metadata.format.duration ?? Infinity);
      if (duration > 60) return null;
    } else return null;

    return {
      buffer,
      type,
      originalExt: ext as FileExtension,
    };
  }

  private async fileConvert(files: ConvertedFile[]) {
    const converted = files.map(async (file) => {
      switch (file.type) {
        case "image":
          file.buffer = await this.toWebp(file.buffer);
          break;
        case "video":
          await this.initFfmpeg();
          file.buffer = await this.toMp4(file.buffer, file.originalExt);
          break;
        case "audio":
          await this.initFfmpeg();
          file.buffer = await this.toMp3(file.buffer, file.originalExt);
          break;
        case "model":
          file.buffer = await this.toGlb(file.buffer);
          break;
        default:
          throw APIError.server(StatusCodes.INTERNAL_SERVER_ERROR, "File converter unhandled convert case");
      }
      return file;
    });
    return Promise.all(converted);
  }

  async convert() {
    const typePromises = this.files.map((file) => this.fileType(file));
    const types = await Promise.all(typePromises);
    const filterTypes = types.filter((file) => file !== null) as ConvertedFile[];

    const converted = await this.fileConvert(filterTypes);
    if (this.cleanTmp) await tmp.cleanup();

    return converted;
  }
}
