const [db, session, { default: req }, { default: validators }] =
  await Promise.all([
    import("./db.js"),
    import("./session.js"),
    import("./req/index.js"),
    import("./validators.js"),
  ]);

export const schema = { db, session, req, validators } as const;
