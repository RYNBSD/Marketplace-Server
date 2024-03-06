import { Router } from "express";

const [{ api }, { security }] = await Promise.all([
  import("./api/index.js"),
  import("./security/index.js"),
]);

export const router = Router();

router.use("/api", api);
router.use("/security", security);
