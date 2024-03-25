import { Router } from "express";
import { middleware } from "../../middleware/index.js";
import { util } from "../../util/index.js";

const [{ auth }, { user }, { store }, { dashboard }] = await Promise.all([
  import("./auth.js"),
  import("./user.js"),
  import("./store.js"),
  import("./dashboard/index.js"),
]);

const { handleAsync } = util.fn;
const { isAuthenticated, isSeller } = middleware.fn;

export const api = Router();

api.use("/auth", auth);
api.use("/user", user);
api.use("/store", store);
api.use("/dashboard", handleAsync(isAuthenticated), handleAsync(isSeller), dashboard);
