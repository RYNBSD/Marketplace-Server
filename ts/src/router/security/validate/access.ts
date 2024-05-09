import { Router } from "express";
import { util } from "../../../util/index.js";
import { controller } from "../../../controller/index.js";
import { config } from "../../../config/index.js";

export const access = Router();

const { token } = controller.security.validate.access;
const { handleAsync } = util.fn;
const { upload } = config;

access.post("/token", handleAsync(upload.none()), handleAsync(token));
