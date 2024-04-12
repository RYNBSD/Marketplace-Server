import auth from "./auth.js";
import user from "./user.js";
import store from "./store.js";
import dashboard from "./dashboard/index.js";

export default {
  auth,
  user,
  store,
  dashboard,
} as const;
