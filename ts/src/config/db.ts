import { Sequelize } from "sequelize";
import { ENV } from "../constant/index.js";

export default {
  async connect() {
    if (global.sequelize instanceof Sequelize) return;

    global.sequelize = new Sequelize(ENV.SEQUELIZE.DB_DATABASE, ENV.SEQUELIZE.DB_USERNAME, ENV.SEQUELIZE.DB_PASSWORD, {
      host: ENV.SEQUELIZE.DB_HOST,
      dialect: "postgres",
      logging: (sql, timing) => {
        if (IS_PRODUCTION) return false;

        console.log(`${sql}`.black.bgWhite);
        console.log(`${timing} ms`.bgYellow.black);
      },
      benchmark: !IS_PRODUCTION,
    });
    await global.sequelize.authenticate();
  },
  async close() {
    await global.sequelize?.close();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.sequelize = undefined;
  },
  async init() {
    if (global.sequelize instanceof Sequelize) await global.sequelize.sync({ force: !IS_PRODUCTION });
  },
} as const;
