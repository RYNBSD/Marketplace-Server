const [{ default: store }, { default: admin }] = await Promise.all([
  import("./store/index.js"),
  import("./admin/index.js"),
]);

export default { store, admin } as const;
