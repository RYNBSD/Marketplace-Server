import { Router } from "express";

const [{ auth }, { user }, { stores }, { dashboard }] = await Promise.all([
  import("./auth.js"),
  import("./user.js"),
  import("./stores.js"),
  import("./dashboard/index.js"),
]);

export const api = Router();

api.use("/auth", auth);
api.use("/user", user);
api.use("/stores", stores);
api.use("/dashboard", dashboard);
