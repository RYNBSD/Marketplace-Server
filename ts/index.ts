import type { Request, Response, NextFunction } from "express";
import express from "express";
import compression from "compression";
import hpp from "hpp";
import session from "express-session";
import morgan from "morgan";
import helmet from "helmet";
import timeout from "connect-timeout";
import methodOverride from "method-override";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";
import responseTime from "response-time";
import { StatusCodes } from "http-status-codes";
// @ts-ignore
import cookieEncrypt from "cookie-encrypter";
import { ENV, KEYS, VALUES } from "./src/constant/index.js";
import { config } from "./src/config/index.js";
import { fileURLToPath } from "url";
import path from "path";
import { randomUUID } from "crypto";
import { util } from "./src/util/index.js";
import { schema } from "./src/schema/index.js";

const app = express();
app.set("env", ENV.NODE.ENV);
app.disable("x-powered-by");
app.disable("trust proxy");
app.disable("view cache");
app.enable("json escape");

global.IS_PRODUCTION = ENV.NODE.ENV === "production";
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(__filename);
global.__root = process.cwd();

if (!IS_PRODUCTION) {
  const errorhandler = (await import("errorhandler")).default;
  app.use(errorhandler({ log: true }));
  await import("colors");
}

const { db, tmp } = config;
await tmp.initTmpDir();
await db.connect();
const { passport } = await import("./src/passport/index.js");
const { router } = await import("./src/router/index.js");
await db.init();

app.use(timeout(VALUES.TIME.MINUTE));
app.use(responseTime(async (req: Request, res: Response, time: number) => {
  const { RESPONSE_TIME } = KEYS.HTTP.HEADERS
  res.setHeader(RESPONSE_TIME, time)

  const { model } = await import("./src/model/index.js")
  const {  } = model.db
}));
app.use(
  cors({
    credentials: true,
  })
);
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
      const { getHeader } = util.fn;
      const { NO_COMPRESSION } = KEYS.HTTP.HEADERS;
      const noCompressionHeader = getHeader(req.headers, NO_COMPRESSION);

      const { toBoolean } = schema.validators
      const noCompression = toBoolean.parse(noCompressionHeader);
      return noCompression ? false : compression.filter(req, res);
    },
  })
);

app.use(methodOverride(KEYS.HTTP.HEADERS.METHOD_OVERRIDE));
app.use(morgan(IS_PRODUCTION ? "combined" : "dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser(ENV.COOKIE.PARSER));
app.use(cookieEncrypt(ENV.COOKIE.SECRET));
app.use(helmet());
app.use(hpp());
app.use(
  session({
    genid: () => randomUUID(),
    secret: ENV.SESSION.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: VALUES.TIME.MINUTE * 15,
      sameSite: IS_PRODUCTION,
      httpOnly: IS_PRODUCTION,
      secure: IS_PRODUCTION,
      path: "/",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(`/v${ENV.API.VERSION}`, router);
app.use(express.static(path.join(__root, KEYS.GLOBAL.PUBLIC)));
app.use("*", (_, res) => res.sendStatus(StatusCodes.NOT_FOUND));
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (!IS_PRODUCTION) {
    console.error(error);
  }
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

app.listen(ENV.NODE.PORT, async () => {
  if (!IS_PRODUCTION) console.log("Starting".bgGreen.white);
});
