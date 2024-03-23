const [{ upload }, { default: db }, { default: tmp }, { default: session }] =
  await Promise.all([
    import("./upload.js"),
    import("./db.js"),
    import("./tmp.js"),
    import("./session.js"),
  ]);

export const config = { upload, db, tmp, session } as const;
