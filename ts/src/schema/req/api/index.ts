const [{ default: auth }, { default: user }, { default: store }, { default: dashboard }] = await Promise.all([
  import("./auth.js"),
  import("./user.js"),
  import("./store.js"),
  import("./dashboard/index.js"),
]);

export default {
  auth,
  user,
  store,
  dashboard,
} as const;
