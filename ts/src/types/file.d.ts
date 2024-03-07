import type { FileExtension } from "file-type";

export type FileConvertMap = {
  image: "webp";
  video: "mp4";
  audio: "mp3";
  model: "glb";
};

export type SupportedFileTypes = keyof FileConvertMap;
export type SupportFileExtensions = FileConvertMap[SupportedFileTypes];

export type ConvertedFile = {
  buffer: Buffer;
  originalExt: FileExtension;
  type: SupportedFileTypes;
};
