import { Router } from "express";
import { util } from "../../../../util/index.js";
import { middleware } from "../../../../middleware/index.js";
import { config } from "../../../../config/index.js";
import { controller } from "../../../../controller/index.js";
import { KEYS } from "../../../../constant/index.js";

const { upload } = config;
const {
  UPLOAD: { IMAGE },
} = KEYS;
const { handleAsync } = util.fn;
const {
  fn: { isAuthenticated, isSeller },
} = middleware;
const { profile, update, delete: deleteSeller } = controller.api.dashboard.store;

export const store = Router();

store.get("/", handleAsync(isAuthenticated), handleAsync(isSeller), handleAsync(profile));

store.put("/", handleAsync(isAuthenticated), handleAsync(isSeller), upload.single(IMAGE), handleAsync(update));

store.delete("/", handleAsync(isAuthenticated), handleAsync(isSeller), handleAsync(deleteSeller));

const [{ stats }, { categories }, { products }] = await Promise.all([
  import("./stats.js"),
  import("./categories.js"),
  import("./products.js"),
]);

store.use("/stats", stats);

store.use("/categories", categories);

store.use("/products", products);
