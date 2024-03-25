import { Router } from "express";
import { util } from "../../util/index.js";
import { middleware } from "../../middleware/index.js";
import { controller } from "../../controller/index.js";
import { config } from "../../config/index.js";
import { KEYS } from "../../constant/index.js";

const { upload } = config;
const { handleAsync } = util.fn;
const { UPLOAD } = KEYS;
const {
  fn: { isAuthenticated, notAuthenticated },
  security: { csrf, access },
} = middleware;
const { signUp, signIn, signOut, me, verifyEmail, forgotPassword } = controller.api.auth;

export const auth = Router();

auth.post(
  "/sign-up",
  handleAsync(csrf),
  handleAsync(notAuthenticated),
  handleAsync(upload.single(UPLOAD.IMAGE)),
  handleAsync(signUp),
);

auth.post(
  "/sign-in",
  handleAsync(csrf),
  handleAsync(notAuthenticated),
  handleAsync(upload.none()),
  handleAsync(signIn),
);

auth.post("/sign-out", handleAsync(isAuthenticated), handleAsync(signOut));

auth.post("/me", handleAsync(notAuthenticated), handleAsync(me));

auth.put("/verify-email", handleAsync(verifyEmail));

auth.put(
  "/forgot-password",
  handleAsync(csrf),
  handleAsync(notAuthenticated),
  handleAsync(upload.none()),
  handleAsync(access),
  handleAsync(forgotPassword),
);
