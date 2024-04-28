import { Sequelize } from "sequelize";
import { ENV } from "../constant/index.js";

export default {
  async connect() {
    if (global.sequelize instanceof Sequelize) return;

    const connectionUri =
      ENV.URI.POSTGRESQL ||
      `postgres://${ENV.SEQUELIZE.DB_USERNAME}:${ENV.SEQUELIZE.DB_PASSWORD}@${ENV.SEQUELIZE.DB_HOST}:5432/${ENV.SEQUELIZE.DB_DATABASE}`;

    global.sequelize = new Sequelize(connectionUri, {
      dialect: "postgres",
      benchmark: !IS_PRODUCTION,
      define: {
        freezeTableName: true,
      },
      logging: (sql, timing) => {
        if (IS_PRODUCTION) return false;
        console.log(`${sql}`.black.bgWhite);
        console.log(`${timing} ms`.bgYellow.black);
      },
    });

    await global.sequelize.authenticate();
  },
  async close() {
    await global.sequelize?.close();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete global.sequelize;
  },
  async init() {
    if (global.sequelize instanceof Sequelize) await global.sequelize.sync({ force: !IS_PRODUCTION });
  },
} as const;
