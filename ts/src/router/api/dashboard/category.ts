import { Router } from "express";
import { KEYS } from "../../../constant/index.js";
import { util } from "../../../util/index.js";
import { controller } from "../../../controller/index.js";
import { middleware } from "../../../middleware/index.js";

const { REQUEST } = KEYS;
const { handleAsync } = util.fn;
const { isCategoryOwner } = middleware.api.store;
const { all, category: getCategory, create, update, delete: deleteCategory } = controller.api.dashboard.category;

export const category = Router();

category.get("/all", handleAsync(all));

category.get(`/:${REQUEST.PARAMS.ID.CATEGORY}`, handleAsync(isCategoryOwner), handleAsync(getCategory));

category.post("/", handleAsync(create));

category.put(`/:${REQUEST.PARAMS.ID.CATEGORY}`, handleAsync(isCategoryOwner), handleAsync(update));

category.delete(`/:${REQUEST.PARAMS.ID.CATEGORY}`, handleAsync(isCategoryOwner), handleAsync(deleteCategory));
