const [{ default: category }, { default: product }] = await Promise.all([
  import("./category.js"),
  import("./product.js"),
]);

export default {
  category,
  product,
} as const;
