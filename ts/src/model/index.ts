const [db, fn] = await Promise.all([import("./db.js"), import("./fn.js")])

export const model = { db, fn } as const