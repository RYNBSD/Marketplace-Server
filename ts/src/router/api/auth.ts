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
  security: { access },
} = middleware;
const { signUp, signIn, signOut, me, verifyEmail, forgotPassword } = controller.api.auth;

export const auth = Router();

/**
 * @openapi
 *
 * /api/auth/sign-up:
 *  post:
 *    summary: Create a new account
 *    tags:
 *      - Api
 *      - Auth
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *                format: password
 *              image:
 *                type: string
 *                format: binary
 *              locale:
 *                type: string
 *              theme:
 *                type: string
 *    responses:
 *      201:
 *        description: Account created successfully
 *      400:
 *        description: Client error
 *      500:
 *        description: Server error
 */
auth.post("/sign-up", handleAsync(notAuthenticated), handleAsync(upload.single(UPLOAD.IMAGE)), handleAsync(signUp));

/**
 * @openapi
 *
 * /api/auth/sign-in:
 *  post:
 *    summary: Connect to an account
 *    tags:
 *      - Api
 *      - Auth
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *                format: password
 *    responses:
 *      200:
 *        description: Sign in successfully
 *      400:
 *        description: Client error
 *      500:
 *        description: Server error
 */
auth.post("/sign-in", handleAsync(notAuthenticated), handleAsync(upload.none()), handleAsync(signIn));

/**
 * @openapi
 *
 * /api/auth/sign-out:
 *  post:
 *    summary: Disconnect from account
 *    tags:
 *      - Api
 *      - Auth
 *    response:
 *    responses:
 *      200:
 *        description: Sign out successfully
 *      400:
 *        description: Client error
 *      500:
 *        description: Server error
 */
auth.post("/sign-out", handleAsync(isAuthenticated), handleAsync(signOut));

auth.post("/me", handleAsync(notAuthenticated), handleAsync(me));

auth.put("/verify-email", handleAsync(verifyEmail));

auth.put(
  "/forgot-password",
  handleAsync(notAuthenticated),
  handleAsync(upload.none()),
  handleAsync(access),
  handleAsync(forgotPassword),
);
