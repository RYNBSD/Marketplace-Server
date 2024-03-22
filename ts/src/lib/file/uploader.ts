import type {
  ConvertedFile,
  SupportFileExtensions,
} from "../../types/index.js";
import { rm, writeFile } from "node:fs/promises";
import { util } from "../../util/index.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { KEYS } from "../../constant/index.js";
import { APIError } from "../../error/index.js";
import { StatusCodes } from "http-status-codes";

const { PUBLIC, UPLOAD } = KEYS.GLOBAL;

export default class FileUploader {
  private readonly files: ConvertedFile[];

  constructor(...files: ConvertedFile[]) {
    this.files = files;
  }

  private generateUniqueFileName(ext: SupportFileExtensions) {
    const { nowInSecond } = util.fn;
    return nowInSecond() + "_" + randomUUID() + "." + ext;
  }

  private async write(file: ConvertedFile) {
    let ext: SupportFileExtensions | null = null;

    switch (file.type) {
      case "image":
        ext = "webp";
        break;
      case "video":
        ext = "mp4";
        break;
      case "audio":
        ext = "mp3";
        break;
      case "model":
        ext = "glb";
        break;
      default:
        throw APIError.server(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "File uploader unhandled write case (ext)"
        );
    }

    const uri = path.join(UPLOAD, file.type, this.generateUniqueFileName(ext));
    const fullPath = path.join(__root, PUBLIC, uri);
    await writeFile(fullPath, file.buffer);
    return "/" + uri;
  }

  async upload() {
    return Promise.all(this.files.map((file) => this.write(file)));
  }

  static async remove(...uris: string[]) {
    await Promise.all(
      uris.map((uri) =>
        rm(path.join(__root, PUBLIC, uri), {
          force: true,
        })
      )
    );
  }
}
