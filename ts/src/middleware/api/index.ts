const [{ default: user }, { default: seller }] = await Promise.all([
  import("./user.js"),
  import("./seller.js"),
]);

export default {
  user,
  seller,
} as const;
