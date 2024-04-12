import { Router } from "express";
import { user } from "./user.js";
import { store } from "./store.js";

export const validate = Router();

validate.use("/user", user);
validate.use("/store", store);
