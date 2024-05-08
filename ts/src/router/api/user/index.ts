import { Router } from "express";
import { util } from "../../../util/index.js";
import { controller } from "../../../controller/index.js";
import { config } from "../../../config/index.js";
import { KEYS } from "../../../constant/index.js";
import { orders } from "./orders.js";

const { IMAGE } = KEYS.UPLOAD;
const { upload } = config;
const { handleAsync } = util.fn;
const { profile, setting, becomeSeller, update, remove } = controller.api.user;

export const user = Router();

user.get("/", handleAsync(profile));

user.patch("/setting", handleAsync(upload.none()), handleAsync(setting));

user.post("/become-seller", handleAsync(upload.single(IMAGE)), handleAsync(becomeSeller));

user.put("/", handleAsync(upload.single(IMAGE)), handleAsync(update));

user.delete("/", handleAsync(remove));

user.use("/orders", orders);
