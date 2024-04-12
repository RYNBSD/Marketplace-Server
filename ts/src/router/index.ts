import { Router } from "express";
import { api } from "./api/index.js";
import { security } from "./security/index.js";

export const router = Router();

router.use("/api", api);
router.use("/security", security);
