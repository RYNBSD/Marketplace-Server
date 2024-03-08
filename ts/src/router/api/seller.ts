import { Router } from "express";
import { config } from "../../config/index.js";
import { util } from "../../util/index.js";
import { middleware } from "../../middleware/index.js";
import { KEYS } from "../../constant/index.js";
import { controller } from "../../controller/index.js";

const { IMAGE } = KEYS.UPLOAD;
const { upload } = config;
const { handleAsync } = util.fn;
const {
  security: { csrf },
  fn: { isAuthorize, isUnauthorize },
  api: {
    seller: { isSeller },
  },
} = middleware;
const {
  all,
  profile,
  category,
  product,
  update,
  delete: deleteSeller,
} = controller.api.seller;

export const seller = Router();

seller.get("/all", handleAsync(isUnauthorize), handleAsync(all));

seller.get("/:sellerId", handleAsync(isUnauthorize), handleAsync(profile));

seller.get(
  "/:sellerId/:categoryId",
  handleAsync(isUnauthorize),
  handleAsync(category)
);

seller.get(
  "/:sellerId/:categoryId/:productId",
  handleAsync(isUnauthorize),
  handleAsync(product)
);

seller.put(
  "/",
  handleAsync(csrf),
  handleAsync(isAuthorize),
  handleAsync(isSeller),
  upload.single(IMAGE),
  handleAsync(update)
);

seller.delete(
  "/",
  handleAsync(isAuthorize),
  handleAsync(isSeller),
  handleAsync(deleteSeller)
);
