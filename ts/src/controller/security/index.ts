const [{ default: csrf }, { default: access }, { default: validate }] = await Promise.all([
  import("./csrf.js"),
  import("./access.js"),
  import("./validate/index.js"),
]);

export default { csrf, access, validate } as const;
