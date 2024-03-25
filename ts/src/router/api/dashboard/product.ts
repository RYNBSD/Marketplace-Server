import { Router } from "express";
import { KEYS } from "../../../constant/index.js";
import { util } from "../../../util/index.js";
import { middleware } from "../../../middleware/index.js";
import { controller } from "../../../controller/index.js";
import { config } from "../../../config/index.js";

const { REQUEST } = KEYS;
const { upload } = config;
const { handleAsync } = util.fn;
const { isProductOwner } = middleware.api.store;
const { all, product: getProduct, create, update, delete: deleteProduct } = controller.api.dashboard.product;

export const product = Router();

product.get("/all", handleAsync(all));

product.get(`/:${REQUEST.PARAMS.ID.PRODUCT}`, handleAsync(isProductOwner), handleAsync(getProduct));

product.post(
  "/",
  upload.fields([
    { name: "model", maxCount: 1 },
    { name: "images", maxCount: 25 },
  ]),
  handleAsync(create),
);

product.put(`/:${REQUEST.PARAMS.ID.PRODUCT}`, handleAsync(isProductOwner), handleAsync(update));

product.delete(`/:${REQUEST.PARAMS.ID.PRODUCT}`, handleAsync(isProductOwner), handleAsync(deleteProduct));
