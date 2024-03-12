const [db, fn, { default: query }] = await Promise.all([
  import("./db.js"),
  import("./fn.js"),
  import("./query/index.js"),
]);

export const model = { db, fn, query } as const;
