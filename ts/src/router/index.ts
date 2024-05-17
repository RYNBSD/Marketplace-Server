import { Router } from "express";
import { api } from "./api/index.js";
import { security } from "./security/index.js";

export const router = Router();

/**
 * @openapi
 * tags:
 *  name: Api
 *  description: api path
 */
router.use("/api", api);

/**
 * @openapi
 * tags:
 *  name: Security
 *  description: security path
 */
router.use("/security", security);
