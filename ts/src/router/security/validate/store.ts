import { Router } from "express";
import { config } from "../../../config/index.js";
import { util } from "../../../util/index.js";
import { controller } from "../../../controller/index.js";
import { middleware } from "../../../middleware/index.js";

const { upload } = config;
const { handleAsync } = util.fn;
const { isSeller } = middleware.api.store;
const { name, category, product } = controller.security.validate.store;

export const store = Router();

store.post("/name", handleAsync(upload.none()), handleAsync(name));

store.post("/category", handleAsync(isSeller), handleAsync(upload.none()), handleAsync(category));

store.post("/product", handleAsync(isSeller), handleAsync(upload.none()), handleAsync(product));
