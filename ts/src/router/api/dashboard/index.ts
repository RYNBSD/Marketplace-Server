import { Router } from "express";

const [{ stats }, { category }, { product }] = await Promise.all([
  import("./stats.js"),
  import("./category.js"),
  import("./product.js"),
]);

export const dashboard = Router();

dashboard.use("/stats", stats);

dashboard.use("/category", category);

dashboard.use("/product", product);
