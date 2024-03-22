const [{ default: api }, { default: security }] = await Promise.all([
  import("./api/index.js"),
  import("./security/index.js"),
]);

export default {
  api,
  security,
} as const;
