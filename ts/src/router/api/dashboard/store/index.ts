import { Router } from "express";
import { stats } from "./stats.js";
import { categories } from "./categories.js";
import { products } from "./products.js";
import { util } from "../../../../util/index.js";
import { config } from "../../../../config/index.js";
import { controller } from "../../../../controller/index.js";
import { KEYS } from "../../../../constant/index.js";

const { upload } = config;
const {
  UPLOAD: { IMAGE },
} = KEYS;
const { handleAsync } = util.fn;
const { profile, update, delete: deleteSeller } = controller.api.dashboard.store;

export const store = Router();

store.get("/", handleAsync(profile));

store.put("/", upload.single(IMAGE), handleAsync(update));

store.delete("/", handleAsync(deleteSeller));

store.use("/stats", stats);

store.use("/categories", categories);

store.use("/products", products);
