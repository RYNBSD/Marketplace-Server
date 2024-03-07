import { Router } from "express";
import { util } from "../../util/index.js";
import { middleware } from "../../middleware/index.js";
import { controller } from "../../controller/index.js";
import { config } from "../../config/index.js";
import { KEYS } from "../../constant/index.js";

const { UPLOAD } = KEYS;
const { upload } = config;
const { handleAsync } = util.fn;
const {
  fn: { isAuthorize },
  security: { csrf },
  api: {
    user: { isSeller },
  },
} = middleware;
const {
  profile,
  orders,
  becomeSeller,
  update,
  delete: deleteUser,
} = controller.api.user;

export const user = Router();

user.get("/", handleAsync(isAuthorize), handleAsync(profile));

user.get("/orders", handleAsync(isAuthorize), handleAsync(orders));

user.post(
  "/become-seller",
  handleAsync(csrf),
  handleAsync(isAuthorize),
  upload.single(UPLOAD.IMAGE),
  handleAsync(becomeSeller)
);

user.put(
  "/",
  handleAsync(csrf),
  handleAsync(isAuthorize),
  upload.single(UPLOAD.IMAGE),
  handleAsync(update)
);

user.delete(
  "/",
  handleAsync(isAuthorize),
  handleAsync(isSeller),
  handleAsync(deleteUser)
);
