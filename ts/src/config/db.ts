import { Sequelize } from "sequelize";
import { ENV } from "../constant/index.js";

export default {
    async connect() {
        global.sequelize = new Sequelize(
            ENV.SEQUELIZE.DB_DATABASE,
            ENV.SEQUELIZE.DB_USERNAME,
            ENV.SEQUELIZE.DB_PASSWORD,
            {
                host: ENV.SEQUELIZE.DB_HOST,
                dialect: "postgres",
                logging: (sql, timing) => {
                    if (IS_PRODUCTION) return false;

                    console.log(`${sql}`.black.bgWhite);
                    console.log(`${timing} ms`.bgYellow.black);
                },
                benchmark: !IS_PRODUCTION,
            }
        );
        await global.sequelize.authenticate();
        await import("../model/index.js")
    },
    async close() {
        await global.sequelize.close();
    },
    async init() {
        await global.sequelize.sync({ alter: !IS_PRODUCTION });
    },
} as const;
