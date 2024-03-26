import { Router } from "express";

const [{ access }, { validate }] = await Promise.all([import("./access.js"), import("./validate/index.js")]);

export const security = Router();

security.use("/validate", validate);
security.use("/access", access);
