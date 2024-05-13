import { Router } from "express";
import { util } from "../../../../util/index.js";
import { controller } from "../../../../controller/index.js";

export const stats = Router();

const { products, categories, orders } = controller.api.dashboard.store.stats;
const { handleAsync } = util.fn;

stats.get("/products", handleAsync(products));

stats.get("/categories", handleAsync(categories));

stats.get("/orders", handleAsync(orders));
