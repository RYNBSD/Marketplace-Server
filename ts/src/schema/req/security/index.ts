const [{ default: access }, { default: validate }] = await Promise.all([
  import("./access.js"),
  import("./validate/index.js"),
]);

export default { access, validate } as const;
