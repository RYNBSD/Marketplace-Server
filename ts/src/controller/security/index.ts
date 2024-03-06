const [{ default: csrf }, { default: access }] = await Promise.all([
  import("./csrf.js"),
  import("./access.js"),
]);

export default { csrf, access } as const;
