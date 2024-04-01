import { Router } from "express";
import { KEYS } from "../../../../constant/index.js";
import { util } from "../../../../util/index.js";
import { controller } from "../../../../controller/index.js";
import { middleware } from "../../../../middleware/index.js";
import { config } from "../../../../config/index.js";

const { upload } = config;
const { handleAsync } = util.fn;
const {
  REQUEST: { PARAMS },
  UPLOAD: { IMAGE },
} = KEYS;
const {
  fn: { isSeller },
  api: {
    store: { isCategoryOwner },
  },
} = middleware;
const { all, category, create, update, delete: deleteCategory } = controller.api.dashboard.store.categories;

export const categories = Router();

categories.get("/", handleAsync(isSeller), handleAsync(all));

categories.get(`/:${PARAMS.ID.CATEGORY}`, handleAsync(isSeller), handleAsync(isCategoryOwner), handleAsync(category));

categories.post("/", handleAsync(isSeller), handleAsync(upload.single(IMAGE)), handleAsync(create));

categories.put(
  `/:${PARAMS.ID.CATEGORY}`,
  handleAsync(isSeller),
  handleAsync(isCategoryOwner),
  handleAsync(upload.single(IMAGE)),
  handleAsync(update),
);

categories.delete(
  `/:${PARAMS.ID.CATEGORY}`,
  handleAsync(isSeller),
  handleAsync(isCategoryOwner),
  handleAsync(deleteCategory),
);
