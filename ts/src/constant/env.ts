import { config } from "dotenv";
config();

export default {
  NODE: {
    PORT: process.env.PORT,
    ENV: process.env.NODE_ENV,
  },
  API: {
    VERSION: process.env.API_VERSION,
  },
  SEQUELIZE: {
    DB_DATABASE: process.env.DB_DATABASE,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
  },
  COOKIE: {
    SECRET: process.env.COOKIE_SECRET,
    PARSER: process.env.COOKIE_PARSER,
  },
  JWT: {
    SECRET: process.env.JWT_SECRET,
  },
  SESSION: {
    SECRET: process.env.SESSION_SECRET,
  },
  MAIL: {
    USER: process.env.MAIL_USER,
    PASS: process.env.MAIL_PASS,
  },
} as const;
