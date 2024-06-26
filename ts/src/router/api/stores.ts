import { Router } from "express";
import { util } from "../../util/index.js";
import { middleware } from "../../middleware/index.js";
import { KEYS } from "../../constant/index.js";
import { controller } from "../../controller/index.js";

const { PARAMS } = KEYS.REQUEST;
const { handleAsync } = util.fn;
const { checkStore, checkCategory, checkProduct } = middleware.api.store;
const { search, all, store, category, product } = controller.api.stores;

export const stores = Router();

stores.get("/search", handleAsync(search));

stores.get("/", handleAsync(all));

stores.get("/categories");

stores.get("/products");

stores.get(`/:${PARAMS.ID.STORE}`, handleAsync(checkStore), handleAsync(store));

stores.get(
  `/:${PARAMS.ID.STORE}/:${PARAMS.ID.CATEGORY}`,
  handleAsync(checkStore),
  handleAsync(checkCategory),
  handleAsync(category),
);

stores.get(
  `/:${PARAMS.ID.STORE}/:${PARAMS.ID.CATEGORY}/:${PARAMS.ID.PRODUCT}`,
  handleAsync(checkStore),
  handleAsync(checkCategory),
  handleAsync(checkProduct),
  handleAsync(product),
);
