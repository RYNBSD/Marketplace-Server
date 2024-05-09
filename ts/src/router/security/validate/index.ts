import { Router } from "express";
import { user } from "./user.js";
import { store } from "./store.js";
import { access } from "./access.js";
import { util } from "../../../util/index.js";
import { middleware } from "../../../middleware/index.js";

export const validate = Router();

const { handleAsync } = util.fn;
const { isAuthenticated } = middleware.fn;

validate.use("/access", access);
validate.use("/user", user);
validate.use("/store", handleAsync(isAuthenticated), store);
