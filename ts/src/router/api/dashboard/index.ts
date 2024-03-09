import { Router } from "express";
import { middleware } from "../../../middleware/index.js";
import { util } from "../../../util/index.js";

const [{ stats }, { category }, { product }] = await Promise.all([
  import("./stats.js"),
  import("./category.js"),
  import("./product.js"),
]);

const { handleAsync } = util.fn;
const { isAuthenticated, isSeller } = middleware.fn;

export const dashboard = Router();

dashboard.use(handleAsync(isAuthenticated), handleAsync(isSeller));
dashboard.use("/stats", stats);
dashboard.use("/category", category);
dashboard.use("/product", product);
