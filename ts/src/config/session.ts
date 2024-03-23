import type session from "express-session";
import SequelizeSession from "connect-session-sequelize";

export default {
  initStore(store: typeof session.Store) {
    const SequelizeStore = SequelizeSession(store);
    const sessionStore = new SequelizeStore({ db: sequelize });
    sessionStore.sync({ force: !IS_PRODUCTION });
    return { sessionStore };
  },
};
