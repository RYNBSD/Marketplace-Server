import type {
  ConvertedFile,
  SupportFileExtensions,
  SupportedFileTypes,
} from "../../types/index.js";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import sharp from "sharp";
import fileType from "file-type";
import { StatusCodes } from "http-status-codes";

import imageExtensions from "image-extensions/image-extensions.json" assert { type: "json" };
import videoExtensions from "video-extensions/video-extensions.json" assert { type: "json" };
import audioExtensions from "audio-extensions/audioExtensions.json" assert { type: "json" };
import { APIError } from "../../error/index.js";

class FileTmp {
  constructor() {}

  private async bufferToFile(file: Buffer, ext: string) {
    const randomName = Math.round(Date.now() * Math.random());
    const filePath = path.join(global.tmp.path, `${randomName}.${ext}`);
    await writeFile(filePath, file);
    return filePath;
  }

  private async fileToBuffer(path: string) {
    return readFile(path);
  }
}

export default class FileConverter extends FileTmp {
  private readonly files: Buffer[] = [];

  constructor(...files: Buffer[]) {
    super();
    this.files = files;
  }

  private async format(file: Buffer) {
    return (await fileType.fromBuffer(file))?.ext ?? "";
  }

  private async toWebp(image: Buffer) {
    return await sharp(image)
      .webp({ quality: 100 })
      // .resize({ width: 1280, height: 720, fit: "cover" })
      .toBuffer();
  }

  private async toMp4(video: Buffer) {
    return video;
  }

  private async toMp3(audio: Buffer) {
    return audio;
  }

  private async toGlb(model: Buffer) {
    return model;
  }

  private async fileType(buffer: Buffer) {
    const ext = await this.format(buffer);
    let type: SupportedFileTypes | null = null;

    if (imageExtensions.includes(ext)) type = "image";
    else if (videoExtensions.includes(ext)) type = "video";
    else if (audioExtensions.includes(ext)) type = "audio";
    else if (ext === "glb") type = "model";

    return { buffer, type };
  }

  private async fileConvert(files: ConvertedFile[]) {
    const converted = files.map(async (file) => {
      switch (file.type) {
        case "image":
          file.buffer = await this.toWebp(file.buffer);
          break;
        case "video":
          file.buffer = await this.toMp4(file.buffer);
          break;
        case "audio":
          file.buffer = await this.toMp3(file.buffer);
          break;
        case "model":
          file.buffer = await this.toGlb(file.buffer);
          break;
        default:
          throw APIError.server(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "File converter unhandled convert case"
          );
      }
      return file;
    });
    return Promise.all(converted);
  }

  async convert() {
    const typePromises = this.files.map((file) => this.fileType(file));
    const types = await Promise.all(typePromises);
    const filterTypes = types.filter(
      (file) => file.type !== null
    ) as ConvertedFile[];

    const converted = await this.fileConvert(filterTypes);
    await tmp.cleanup();

    return converted;
  }
}
