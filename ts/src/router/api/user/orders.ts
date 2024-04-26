import { Router } from "express";
import { KEYS } from "../../../constant/index.js";
import { util } from "../../../util/index.js";
import { controller } from "../../../controller/index.js";
import { middleware } from "../../../middleware/index.js";
import { config } from "../../../config/index.js";

const { upload } = config;
const {
  REQUEST: { PARAMS },
} = KEYS;
const {
  fn: { checkOrder },
} = middleware;
const {
  fn: { handleAsync },
} = util;
const { all, order, create, patch, remove } = controller.api.user.orders;

export const orders = Router();

orders.get("/", handleAsync(all));

orders.get(`/:${PARAMS.ID.ORDER}`, handleAsync(checkOrder), handleAsync(order));

orders.post("/", handleAsync(upload.none()), handleAsync(create));

orders.patch(`/:${PARAMS.ID.ORDER}`, handleAsync(checkOrder), handleAsync(patch));

orders.delete(`/:${PARAMS.ID.ORDER}`, handleAsync(checkOrder), handleAsync(remove));
