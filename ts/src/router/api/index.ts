import { Router } from "express";

import { auth } from "./auth.js";
import { user } from "./user/index.js";
import { stores } from "./stores.js";
import { dashboard } from "./dashboard/index.js";

import { util } from "../../util/index.js";
import { middleware } from "../../middleware/index.js";

const { isAuthenticated } = middleware.fn;
const { handleAsync } = util.fn;

export const api = Router();

/**
 * @openapi
 *
 * tags:
 *  name: Auth
 *  description: Authentication path (/api/auth)
 */
api.use("/auth", auth);

api.use("/user", handleAsync(isAuthenticated), user);

api.use("/stores", stores);

api.use("/dashboard", handleAsync(isAuthenticated), dashboard);
