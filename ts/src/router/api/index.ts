import { Router } from "express";

const [{ auth }, { user }] = await Promise.all([
  import("./auth.js"),
  import("./user.js"),
]);

export const api = Router();

api.use("/auth", auth);
api.use("/user", user);
