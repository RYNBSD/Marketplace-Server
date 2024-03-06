import { Router } from "express";

const [{ csrf }, { access }] = await Promise.all([
  import("./csrf.js"),
  import("./access.js"),
]);

export const security = Router();

security.use("/csrf", csrf);
security.use("/access", access);
