import { Router } from "express";
import { KEYS } from "../../../../constant/index.js";
import { util } from "../../../../util/index.js";
import { controller } from "../../../../controller/index.js";
import { middleware } from "../../../../middleware/index.js";

const { REQUEST } = KEYS;

export const orders = Router();

const { all, order, patch } = controller.api.dashboard.store.orders;
const { isOrderOwner } = middleware.api.store;
const { handleAsync } = util.fn;

orders.get("/", handleAsync(all));

orders.get(`/:${REQUEST.PARAMS.ID.ORDER}`, handleAsync(isOrderOwner), handleAsync(order));

orders.patch(`/:${REQUEST.PARAMS.ID.ORDER}`, handleAsync(isOrderOwner), handleAsync(patch));
