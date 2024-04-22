import auth from "./auth.js";
import store from "./store.js";
import user from "./user/index.js";
import dashboard from "./dashboard/index.js";

export default {
  auth,
  user,
  store,
  dashboard,
} as const;
