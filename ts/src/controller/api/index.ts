const [{ default: auth }, { default: user }, { default: stores }, { default: dashboard }] = await Promise.all([
  import("./auth.js"),
  import("./user.js"),
  import("./stores.js"),
  import("./dashboard/index.js"),
]);

export default { auth, user, stores, dashboard } as const;
