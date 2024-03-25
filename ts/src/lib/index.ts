const [{ default: FileConverter }, { default: FileUploader }, { default: Mail }] = await Promise.all([
  import("./file/converter.js"),
  import("./file/uploader.js"),
  import("./mail.js"),
]);

export const lib = {
  file: {
    FileConverter,
    FileUploader,
  },
  Mail,
};
