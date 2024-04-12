import { Router } from "express";

import { auth } from "./auth.js";
import { user } from "./user.js";
import { stores } from "./stores.js";
import { dashboard } from "./dashboard/index.js";

export const api = Router();

api.use("/auth", auth);
api.use("/user", user);
api.use("/stores", stores);
api.use("/dashboard", dashboard);
