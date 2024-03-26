const [{ upload }, { default: db }, { default: tmp }, { default: cookie }, { default: session }, { default: swagger }] =
  await Promise.all([
    import("./upload.js"),
    import("./db.js"),
    import("./tmp.js"),
    import("./cookie.js"),
    import("./session.js"),
    import("./swagger.js"),
  ]);

export const config = { upload, db, tmp, cookie, session, swagger } as const;
