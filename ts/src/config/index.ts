const [{ upload }, { default: db }, { default: tmp }, { default: session }, { default: swagger }] = await Promise.all([
  import("./upload.js"),
  import("./db.js"),
  import("./tmp.js"),
  import("./session.js"),
  import("./swagger.js"),
]);

export const config = { upload, db, tmp, session, swagger } as const;
