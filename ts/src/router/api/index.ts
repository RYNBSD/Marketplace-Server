import { Router } from "express";

const [{ auth }, { user }, { store }] = await Promise.all([
  import("./auth.js"),
  import("./user.js"),
  import("./store.js"),
]);

export const api = Router();

api.use("/auth", auth);
api.use("/user", user);
api.use("/store", store);
