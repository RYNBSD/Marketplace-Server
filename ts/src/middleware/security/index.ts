import type { Request, Response, NextFunction } from "express";
import { util } from "../../util/index.js";
import { KEYS } from "../../constant/index.js";
import { model } from "../../model/index.js";
import { schema } from "../../schema/index.js";
import { APIError } from "../../error/index.js";
import { StatusCodes } from "http-status-codes";

export default {
  async csrf(req: Request, _res: Response, next: NextFunction) {
    const {
      fn: { getHeader },
      csrf,
    } = util;

    const token = getHeader(req.headers, KEYS.HTTP.HEADERS.CSRF);
    if (token instanceof Array)
      throw APIError.middleware(StatusCodes.BAD_REQUEST, "Too many CSRF token");
    if (token.length === 0)
      throw APIError.middleware(StatusCodes.BAD_REQUEST, "Empty CSRF token");

    const secret = req.session.csrf?.secret ?? "";
    if (secret.length === 0)
      throw APIError.middleware(StatusCodes.BAD_REQUEST, "Empty CSRF secret");

    req.session.csrf = { secret: "" };
    if (csrf.verify(secret, token)) return next();
    throw APIError.middleware(StatusCodes.BAD_REQUEST, "Invalid CSRF");
  },
  // async access(req: Request, res: Response, next: NextFunction) {
  // const { getHeader } = util;

  // const token = getHeader(req.headers, KEYS.HTTP.HEADERS.ACCESS_TOKEN);
  // if (token instanceof Array) throw new Error("Too many access token");
  // if (token.length === 0) throw new Error("Access token not send");

  // const key = req.session.access?.key ?? "";
  // if (key.length === 0) return next("Unsaved access key");

  // const iv = req.session.access?.iv ?? "";
  // if (iv.length === 0) return next("Unsaved access iv");

  // const { Access } = schema.req.security.access.Middleware
  // const { code } = Access.parse(req.body);
  // const { access } = util

  // const hasAccess = access.verify(token, key, iv, code);
  // if (hasAccess.valid === false) throw new Error("Invalid access token");

  // req.session.access = { key: "", iv: "" };

  // const { User } = model.db;
  // const user = await User.findByPk(hasAccess.id, {
  //     plain: true,
  //     limit: 1,
  // });
  // if (user === null) throw new Error("User not found");

  // delete req.body.code
  // res.locals.user = user;
  //     return next();
  // },
} as const;
