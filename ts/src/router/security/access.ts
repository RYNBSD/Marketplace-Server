import { Router } from "express";
import { util } from "../../util/index.js";
import { middleware } from "../../middleware/index.js";
import { controller } from "../../controller/index.js";

const { handleAsync } = util.fn;
const {
  fn: { isUnauthorize },
  security: { csrf },
} = middleware;
const { email } = controller.security.access;

export const access = Router();

access.post(
  "/email",
  handleAsync(csrf),
  handleAsync(isUnauthorize),
  handleAsync(email)
);
