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
} = controller.api.seller;

export const seller = Router();

seller.get("/search", handleAsync(search));

seller.get("/all", handleAsync(all));

seller.get(
  `/:${PARAMS.ID.SELLER}`,
  handleAsync(checkSeller),
  handleAsync(home)
);

seller.get(
  `/:${PARAMS.ID.SELLER}/:${PARAMS.ID.CATEGORY}`,
  handleAsync(checkSeller),
  handleAsync(checkCategory),
  handleAsync(category)
);

seller.get(
  `/:${PARAMS.ID.SELLER}/:${PARAMS.ID.CATEGORY}/:${PARAMS.ID.PRODUCT}`,
  handleAsync(checkSeller),
  handleAsync(checkCategory),
  handleAsync(checkProduct),
  handleAsync(product)
);

seller.get(
  "/",
  handleAsync(isAuthenticated),
  handleAsync(isSeller),
  handleAsync(profile)
);

seller.put(
  "/",
  handleAsync(csrf),
  handleAsync(isAuthenticated),
  handleAsync(isSeller),
  upload.single(IMAGE),
  handleAsync(update)
);

seller.delete(
  "/",
  handleAsync(isAuthenticated),
  handleAsync(isSeller),
  handleAsync(deleteSeller)
);
