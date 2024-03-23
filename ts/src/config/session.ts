import type session from "express-session";
import SequelizeSession from "connect-session-sequelize";
import { KEYS } from "../constant/index.js";

const { TABLES } = KEYS.DB;

export default {
  initStore(store: typeof session.Store) {
    const SequelizeStore = SequelizeSession(store);
    const sessionStore = new SequelizeStore({
      db: sequelize,
      tableName: TABLES.SESSION,
    });
    sessionStore.sync({ force: !IS_PRODUCTION });
    return { sessionStore };
  },
};
