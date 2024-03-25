import { Router } from "express";
import { controller } from "../../../controller/index.js";
import { config } from "../../../config/index.js";
import { util } from "../../../util/index.js";
import { middleware } from "../../../middleware/index.js";

const { upload } = config;
const { handleAsync } = util.fn;
const { notAuthenticated } = middleware.fn;
const { email } = controller.security.validate.user;

export const user = Router();

user.post("/email", handleAsync(notAuthenticated), handleAsync(upload.none()), handleAsync(email));
