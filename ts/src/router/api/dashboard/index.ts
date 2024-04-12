import { Router } from "express";

import { store } from "./store/index.js";
import { admin } from "./admin/index.js";

export const dashboard = Router();

dashboard.use("/store", store);

dashboard.use("/admin", admin);
