import { Router } from "express";

import { store } from "./store/index.js";
import { admin } from "./admin/index.js";
import { util } from "../../../util/index.js";
import { middleware } from "../../../middleware/index.js";

const { handleAsync } = util.fn;
const {
  api: {
    store: { isSeller },
  },
} = middleware;

export const dashboard = Router();

dashboard.use("/store", handleAsync(isSeller), store);

dashboard.use("/admin", admin);
