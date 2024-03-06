import { Router } from "express";
import { util } from "../../util/index.js";
import { middleware } from "../../middleware/index.js";
import { controller } from "../../controller/index.js";

const { handleAsync } = util.fn;
const {
  fn: { isAuthorize },
  security: { csrf },
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
  handleAsync(becomeSeller)
);

user.put("/", handleAsync(csrf), handleAsync(isAuthorize), handleAsync(update));

user.delete("/", handleAsync(isAuthorize), handleAsync(deleteUser));
