const [{ default: auth }, { default: user }, { default: store }] =
  await Promise.all([
    import("./auth.js"),
    import("./user.js"),
    import("./store.js"),
  ]);

export default { auth, user, store } as const;
