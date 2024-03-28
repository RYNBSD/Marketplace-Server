const [{ upload }, { default: db }, { default: tmp }, { default: app }, { default: swagger }, options] =
  await Promise.all([
    import("./upload.js"),
    import("./db.js"),
    import("./tmp.js"),
    import("./app.js"),
    import("./swagger.js"),
    import("./options.js"),
  ]);

export const config = { upload, db, tmp, app, swagger, options } as const;
