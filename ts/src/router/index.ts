import { Router } from "express";
// import apicache from "apicache";

const [{ api }, { security }] = await Promise.all([import("./api/index.js"), import("./security/index.js")]);

// const cache = apicache.middleware;

export const router = Router();

router.use("/api", api);
router.use("/security", security);
