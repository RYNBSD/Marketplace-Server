const [user, store, category, product] = await Promise.all([
  import("./user.js"),
  import("./store.js"),
  import("./category.js"),
  import("./product.js"),
]);

export default { user, store, category, product } as const;
