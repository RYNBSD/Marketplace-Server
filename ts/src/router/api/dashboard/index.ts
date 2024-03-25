import { Router } from "express";

const [{ store }, { admin }] = await Promise.all([import("./store/index.js"), import("./admin/index.js")]);

export const dashboard = Router();

dashboard.use("/store", store);

dashboard.use("/admin", admin);
