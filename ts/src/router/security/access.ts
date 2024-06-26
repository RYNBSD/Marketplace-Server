import { Router } from "express";
import { util } from "../../util/index.js";
import { controller } from "../../controller/index.js";
import { config } from "../../config/index.js";

const { upload } = config;
const { handleAsync } = util.fn;
const { email } = controller.security.access;

export const access = Router();

access.post("/email", handleAsync(upload.none()), handleAsync(email));
