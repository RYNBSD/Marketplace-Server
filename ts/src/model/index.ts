const [db] = await Promise.all([import("./db.js")])

export const model = { db } as const