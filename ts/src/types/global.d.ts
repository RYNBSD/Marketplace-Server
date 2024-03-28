/* eslint-disable no-var */
import type { Sequelize } from "sequelize";
import { DirectoryResult } from "tmp-promise";
import type { Tables } from "./db.js";

type PassportUser = Tables["User"];

declare global {
  var IS_PRODUCTION: boolean;
  var sequelize: Sequelize;
  var tmp: DirectoryResult;
  var __root: string;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "production" | "development" | "test";
      PORT: number | `${number}`;

      COOKIE_PARSER: string;
      COOKIE_SECRET: string;

      JWT_SECRET: string;

      SESSION_SECRET: string;

      DB_DATABASE: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_HOST: string;

      MONGODB_URI: string;

      MAIL_USER: string;
      MAIL_PASS: string;
    }
  }

  namespace Express {
    interface User extends PassportUser {}
  }
}

export {};
