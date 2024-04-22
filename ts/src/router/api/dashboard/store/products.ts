import { Router } from "express";
import { KEYS } from "../../../../constant/index.js";
import { util } from "../../../../util/index.js";
import { middleware } from "../../../../middleware/index.js";
import { controller } from "../../../../controller/index.js";
import { config } from "../../../../config/index.js";

const { REQUEST } = KEYS;
const { upload } = config;
const { handleAsync } = util.fn;
const { isProductOwner } = middleware.api.store;
const { all, product, create, update, remove: deleteProduct } = controller.api.dashboard.store.products;

export const products = Router();

products.get("/", handleAsync(all));

products.get(`/:${REQUEST.PARAMS.ID.PRODUCT}`, handleAsync(isProductOwner), handleAsync(product));

products.post(
  "/",
  handleAsync(upload.fields([{ name: "models", maxCount: 1 }, { name: "images" }])),
  handleAsync(create),
);

products.put(`/:${REQUEST.PARAMS.ID.PRODUCT}`, handleAsync(isProductOwner), handleAsync(update));

products.delete(`/:${REQUEST.PARAMS.ID.PRODUCT}`, handleAsync(isProductOwner), handleAsync(deleteProduct));
