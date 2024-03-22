import { Router } from "express";

const [{ user }, { store }] = await Promise.all([
  import("./user.js"),
  import("./store.js"),
]);

export const validate = Router();

validate.use("/user", user);
validate.use("/store", store);
