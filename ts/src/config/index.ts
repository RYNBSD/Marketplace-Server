const [{ upload }, { default: db }, { default: tmp }] = await Promise.all([
  import("./upload.js"),
  import("./db.js"),
  import("./tmp.js"),
]);

export const config = { upload, db, tmp } as const;
