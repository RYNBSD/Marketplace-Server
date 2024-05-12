import { config } from "dotenv";
config();

export default {
  NODE: {
    PORT: process.env.PORT ?? 4000,
    ENV: process.env.NODE_ENV,
  },
  URI: {
    POSTGRES:
      process.env.NODE_ENV === "production"
        ? process.env.POSTGRESQL_URI
        : "postgres://postgres:password@localhost:5432/marketplace",
    MONGO: process.env.NODE_ENV === "production" ? process.env.MONGODB_URI : "mongodb://localhost:27017/marketplace",
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
