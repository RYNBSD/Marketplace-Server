const [{ default: access }] = await Promise.all([import("./access.js")])

export default { access } as const