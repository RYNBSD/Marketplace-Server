import { Router } from "express";

const [{ csrf }, { access }, { validate }] = await Promise.all([
  import("./csrf.js"),
  import("./access.js"),
  import("./validate/index.js"),
]);

export const security = Router();

security.use("/csrf", csrf);
security.use("/validate", validate);
security.use("/access", access);
