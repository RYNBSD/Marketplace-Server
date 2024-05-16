import { Router } from "express";
import { KEYS } from "../../../../constant/index.js";
import { util } from "../../../../util/index.js";
import { controller } from "../../../../controller/index.js";

const { REQUEST } = KEYS;

export const orders = Router();

const { all, order, patch } = controller.api.dashboard.store.orders;
const { handleAsync } = util.fn;

orders.get("/", handleAsync(all));

orders.get(`/:${REQUEST.PARAMS.ID.ORDER}`, handleAsync(order));

orders.patch(`/:${REQUEST.PARAMS.ID.ORDER}`, handleAsync(patch));
