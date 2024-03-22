const [{ default: auth }, { default: user }, { default: seller }] =
  await Promise.all([
    import("./auth.js"),
    import("./user.js"),
    import("./store.js"),
  ]);

export default {
  auth,
  user,
  seller,
} as const;
