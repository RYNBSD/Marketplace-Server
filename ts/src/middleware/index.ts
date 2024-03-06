const [{ default: api }, { default: security }, fn] = await Promise.all([
  import("./api/index.js"),
  import("./security/index.js"),
  import("./fn.js"),
]);

export const middleware = { api, security, fn } as const;
