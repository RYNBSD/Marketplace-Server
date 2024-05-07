import { Router } from "express";
import { controller } from "../../../../controller/index.js";
import { util } from "../../../../util/index.js";

export const stats = Router();

const { users, stores } = controller.api.dashboard.admin.stats;
const { handleAsync } = util.fn;

stats.get("/users", handleAsync(users));

stats.get("/stores", handleAsync(stores));
