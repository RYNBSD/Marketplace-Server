import { Router } from "express";
import { util } from "../../util/index.js";
import { controller } from "../../controller/index.js";

const { handleAsync } = util.fn;
const { create, delete: deleteCsrf } = controller.security.csrf;

export const csrf = Router();

csrf.get("/", handleAsync(create));
csrf.delete("/", handleAsync(deleteCsrf));
