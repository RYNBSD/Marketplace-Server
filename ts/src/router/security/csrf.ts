import { Router } from "express";
import { util } from "../../util/index.js";
import { controller } from "../../controller/index.js";
import { middleware } from "../../middleware/index.js";

const { handleAsync } = util.fn;
const { isUnauthorize } = middleware.fn;
const { create, delete: deleteCsrf } = controller.security.csrf;

export const csrf = Router();

csrf.get("/", handleAsync(isUnauthorize), handleAsync(create));
csrf.delete("/", handleAsync(isUnauthorize), handleAsync(deleteCsrf));
