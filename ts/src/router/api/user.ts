import { Router } from "express";
import { util } from "../../util/index.js";
import { middleware } from "../../middleware/index.js";
import { controller } from "../../controller/index.js";
import { config } from "../../config/index.js";
import { KEYS } from "../../constant/index.js";

const {
  UPLOAD: { IMAGE },
  REQUEST: { PARAMS },
} = KEYS;
const { upload } = config;
const { handleAsync } = util.fn;
const {
  fn: { isAuthenticated },
  security: { csrf },
} = middleware;
const {
  profile,
  orders,
  order,
  setting,
  becomeSeller,
  update,
  delete: deleteUser,
} = controller.api.user;

export const user = Router();

user.get("/", handleAsync(isAuthenticated), handleAsync(profile));

user.get("/orders", handleAsync(isAuthenticated), handleAsync(orders));

user.get(
  `/orders/:${PARAMS.ID.ORDER}`,
  handleAsync(isAuthenticated),
  handleAsync(order)
);

user.patch(
  "/setting",
  handleAsync(isAuthenticated),
  upload.any(),
  handleAsync(setting)
);

user.post(
  "/become-seller",
  handleAsync(csrf),
  handleAsync(isAuthenticated),
  upload.single(IMAGE),
  handleAsync(becomeSeller)
);

user.put(
  "/",
  handleAsync(csrf),
  handleAsync(isAuthenticated),
  upload.single(IMAGE),
  handleAsync(update)
);

user.delete("/", handleAsync(isAuthenticated), handleAsync(deleteUser));
