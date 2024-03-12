const [db, id, session, { default: req }, { default: validators }] =
  await Promise.all([
    import("./db.js"),
    import("./id.js"),
    import("./session.js"),
    import("./req/index.js"),
    import("./validators.js"),
  ]);

export const schema = { db, id, session, req, validators } as const;
