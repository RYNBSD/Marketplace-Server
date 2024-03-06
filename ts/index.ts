import type { Request, Response, NextFunction } from "express";
import express from "express";
import compression from "compression";
import hpp from "hpp";
import session from "express-session";
import morgan from "morgan";
import helmet from "helmet";
import timeout from "connect-timeout";
import apicache from "apicache";
import methodOverride from "method-override";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import responseTime from "response-time";
import { StatusCodes } from "http-status-codes";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cookieEncrypt from "cookie-encrypter";
import { ENV, KEYS, VALUES } from "./src/constant/index.js";
import { config } from "./src/config/index.js";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
app.set("env", ENV.NODE.ENV);
app.disable("x-powered-by");
app.disable("trust proxy");
app.disable("view cache");
app.enable("json escape");

app.use(timeout(VALUES.TIME.MINUTE));
app.use(responseTime());
app.use(cors());
app.use(
  rateLimit({
    windowMs: VALUES.TIME.MINUTE,
    limit: 100,
  })
);
app.use(
  compression({
    level: 9,
    filter(req, res) {
      return compression.filter(req, res);
    },
  })
);

const cache = apicache.middleware;
global.IS_PRODUCTION = ENV.NODE.ENV === "production";
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(__filename);
global.__root = process.cwd();

if (!IS_PRODUCTION) {
  const errorhandler = (await import("errorhandler")).default;
  app.use(errorhandler({ log: true }));
  await import("colors");
}

app.use(methodOverride(KEYS.HTTP.HEADERS.METHOD_OVERRIDE));
app.use(morgan(IS_PRODUCTION ? "combined" : "dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser(ENV.COOKIE.PARSER));
app.use(cookieEncrypt(ENV.COOKIE.SECRET));
app.use(cache("5 minutes"));
app.use(helmet());
app.use(hpp());
app.use(
  session({
    secret: ENV.SESSION.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: VALUES.TIME.MINUTE * 15,
      httpOnly: IS_PRODUCTION,
      sameSite: IS_PRODUCTION,
      secure: IS_PRODUCTION,
      path: "/",
    },
  })
);

const { db, tmp } = config;
await tmp.initTmpDir();
await db.connect();
const { router } = await import("./src/router/index.js");
await db.init();

app.use("/", router);
app.use(express.static(path.join(__root, KEYS.GLOBAL.PUBLIC)));
app.use("*", (_, res) => res.status(StatusCodes.NOT_FOUND).end());
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: error instanceof Error ? error.message : error,
  });
});

process.on("unhandledRejection", (error) => {
  throw error;
});

process.on("uncaughtException", async (error) => {
  console.error(error);
  process.exit(1);
});

app.listen(ENV.NODE.PORT, () => {
  if (!IS_PRODUCTION) console.log("Starting".bgGreen.white);
});
