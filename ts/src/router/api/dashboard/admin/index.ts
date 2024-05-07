import { Router } from "express";
import { stats } from "./stats.js";

export const admin = Router();

admin.use("/stats", stats);
