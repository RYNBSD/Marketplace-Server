import { Router } from "express";
import { api } from "./api/index.js";
import { security } from "./security/index.js";

export const router = Router();

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */

router.use("/api", api);
router.use("/security", security);
