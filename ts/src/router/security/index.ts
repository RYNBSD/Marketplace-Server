import { Router } from "express";
import { access } from "./access.js";
import { validate } from "./validate/index.js";

export const security = Router();

security.use("/validate", validate);

security.use("/access", access);
