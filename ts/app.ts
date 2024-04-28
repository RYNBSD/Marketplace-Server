import type { NextFunction, Request, Response } from "express";
import type { RateLimitRequestHandler } from "express-rate-limit";
import type { TResponse } from "./src/types/index.js";
import express from "express";
import compression from "compression";
import hpp from "hpp";
import session from "express-session";
import morgan from "morgan";
import helmet from "helmet";
import timeout from "connect-timeout";
import methodOverride from "method-override";
// import { simpleCsrf } from "express-simple-csrf";
import cookieParser from "cookie-parser";
import cors from "cors";
import responseTime from "response-time";
import requestIp from "request-ip";
import { StatusCodes } from "http-status-codes";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cookieEncrypt from "cookie-encrypter";
import path from "path";
import { randomUUID } from "crypto";
import { ENV, KEYS, VALUES } from "./src/constant/index.js";
import { util } from "./src/util/index.js";
import { schema } from "./src/schema/index.js";
import { model } from "./src/model/index.js";
import { config } from "./src/config/index.js";
import { BaseError } from "./src/error/index.js";
import { router } from "./src/router/index.js";
import { passport } from "./src/passport/index.js";

/**
 * Security:
 *  - XSS
 *  - DDOS
 *  - SQL injection
 *  - CSRF
 *  - HPP
 *  - Error Handling
 *  - Linting
 *  - End-To-End Type Safety
 *  - Cookie
 *  - Session
 *
 * Performance:
 *
 *
 */
const app = express();
app.set("env", ENV.NODE.ENV);
app.disable("x-powered-by");
app.disable("trust proxy");
app.disable("view cache");
app.enable("json escape");
app.enable("etag");

const { TIME, PACKAGE } = VALUES;
const { COOKIE, HTTP } = KEYS;

if (!IS_PRODUCTION) {
  const errorhandler = (await import("errorhandler")).default;
  app.use(errorhandler({ log: true }));
}

const {
  tmp,
  app: { initLimiter, initSession },
  swagger,
  options: configOptions,
} = config;

await tmp.initTmpDir();
const docs = swagger.init();

app.use(timeout(TIME.MINUTE));
app.use(
  responseTime(async (req: Request, res: Response, time: number) => {
    const { RESPONSE_TIME } = HTTP.HEADERS;
    res.setHeader(RESPONSE_TIME, time);
    if (IS_PRODUCTION) return;

    const { method, originalUrl: path } = req;
    const { statusCode } = res;
    const { ResponseTime } = model.db;
    const { nowInSecond } = util.fn;

    await ResponseTime.create(
      {
        date: nowInSecond(),
        time,
        method,
        path,
        statusCode,
      },
      { fields: ["date", "time", "method", "path", "statusCode"] },
    );
  }),
);

app.use(
  cors({
    credentials: true,
    exposedHeaders: [HTTP.HEADERS.ACCESS_TOKEN, "Set-Cookie"],
    origin: (origin, callback) => callback(null, origin),
  }),
);
app.use(initLimiter() as RateLimitRequestHandler);
app.use(
  compression({
    level: 9,
    filter(req, res) {
      const { getHeader } = util.fn;
      const { NO_COMPRESSION } = HTTP.HEADERS;
      const noCompressionHeader = getHeader(req.headers, NO_COMPRESSION);

      const { toBoolean } = schema.validators;
      const noCompression = toBoolean.parse(noCompressionHeader);
      return noCompression ? false : compression.filter(req, res);
    },
  }),
);
app.use(methodOverride(HTTP.HEADERS.METHOD_OVERRIDE));
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
    store: initSession(),
    name: COOKIE.SESSION,
    secret: ENV.SESSION.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: configOptions.cookieOptions,
  }),
);
// app.use(
//   simpleCsrf({
//     ignoreMethods: ["GET", "HEAD", "OPTIONS", "DELETE", "PATCH"],
//     cookieOptions: configOptions.cookieOptions,
//     debug: !IS_PRODUCTION,
//   }),
// );
app.use(passport.initialize());
app.use(passport.session());
app.use(requestIp.mw());

app.use(`/v${PACKAGE.VERSION}`, router);
app.use(express.static(path.join(__root, KEYS.GLOBAL.PUBLIC), { etag: true }));
app.use("/docs", docs.serve, docs.ui);
app.all("*", async (_, res: Response<TResponse["Body"]["Fail"]>) =>
  res.status(StatusCodes.NOT_FOUND).json({ success: false }),
);
app.use(async (error: unknown, _req: Request, res: Response<TResponse["Body"]["Fail"]>, _next: NextFunction) => {
  await BaseError.handleError(error);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Server error",
  });
});

process.on("unhandledRejection", (error) => {
  throw error;
});

process.on("uncaughtException", async (error) => {
  await Promise.all([BaseError.handleError(error), sequelize.close()]);
  process.exit(1);
});

export default app;
