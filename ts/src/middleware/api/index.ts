const [{ default: user }, { default: seller }] = await Promise.all([
  import("./user.js"),
  import("./store.js"),
]);

export default {
  user,
  seller,
} as const;
