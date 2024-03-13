import { Router } from "express";
import { config } from "../../config/index.js";
import { util } from "../../util/index.js";
import { middleware } from "../../middleware/index.js";
import { KEYS } from "../../constant/index.js";
import { controller } from "../../controller/index.js";

const {
  UPLOAD: { IMAGE },
  REQUEST: { PARAMS },
} = KEYS;
const { upload } = config;
const { handleAsync } = util.fn;
const {
  security: { csrf },
  fn: { isAuthenticated, isSeller },
  api: {
    seller: { checkSeller, checkCategory, checkProduct },
  },
} = middleware;
const {
  search,
  all,
  home,
  category,
  product,
  profile,
  update,
  delete: deleteSeller,
} = controller.api.store;

export const store = Router();

store.get("/search", handleAsync(search));

store.get("/all", handleAsync(all));

store.get(
  `/:${PARAMS.ID.STORE}`,
  handleAsync(checkSeller),
  handleAsync(home)
);

store.get(
  `/:${PARAMS.ID.STORE}/:${PARAMS.ID.CATEGORY}`,
  handleAsync(checkSeller),
  handleAsync(checkCategory),
  handleAsync(category)
);

store.get(
  `/:${PARAMS.ID.STORE}/:${PARAMS.ID.CATEGORY}/:${PARAMS.ID.PRODUCT}`,
  handleAsync(checkSeller),
  handleAsync(checkCategory),
  handleAsync(checkProduct),
  handleAsync(product)
);

store.get(
  "/",
  handleAsync(isAuthenticated),
  handleAsync(isSeller),
  handleAsync(profile)
);

store.put(
  "/",
  handleAsync(csrf),
  handleAsync(isAuthenticated),
  handleAsync(isSeller),
  upload.single(IMAGE),
  handleAsync(update)
);

store.delete(
  "/",
  handleAsync(isAuthenticated),
  handleAsync(isSeller),
  handleAsync(deleteSeller)
);
