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
const { isCategoryOwner } = middleware.api.store;
const { all, category, create, update, remove } = controller.api.dashboard.store.categories;

export const categories = Router();

categories.get("/", handleAsync(all));

categories.get(`/:${PARAMS.ID.CATEGORY}`, handleAsync(isCategoryOwner), handleAsync(category));

categories.post("/", handleAsync(upload.single(IMAGE)), handleAsync(create));

categories.put(
  `/:${PARAMS.ID.CATEGORY}`,
  handleAsync(isCategoryOwner),
  handleAsync(upload.single(IMAGE)),
  handleAsync(update),
);

categories.delete(`/:${PARAMS.ID.CATEGORY}`, handleAsync(isCategoryOwner), handleAsync(remove));
