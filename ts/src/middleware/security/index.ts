import type { Request, Response, NextFunction } from "express";
import type { TResponse } from "../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { util } from "../../util/index.js";
import { KEYS } from "../../constant/index.js";
import { model } from "../../model/index.js";
import { schema } from "../../schema/index.js";
import { APIError } from "../../error/index.js";

export default {
  async csrf(
    req: Request,
    _res: Response<never, TResponse["Locals"]>,
    next: NextFunction
  ) {
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
  async access(
    req: Request,
    _res: Response<never, TResponse["Locals"]>,
    next: NextFunction
  ) {
    const { getHeader } = util.fn;

    const token = getHeader(req.headers, KEYS.HTTP.HEADERS.ACCESS_TOKEN);
    if (token instanceof Array)
      throw APIError.middleware(StatusCodes.CONFLICT, "Too many access token");
    if (token.length === 0)
      throw APIError.middleware(
        StatusCodes.BAD_REQUEST,
        "Access token not send"
      );

    const key = req.session.access?.key ?? "";
    if (key.length === 0)
      throw APIError.server(StatusCodes.FORBIDDEN, "Unsaved access key");

    const iv = req.session.access?.iv ?? "";
    if (iv.length === 0)
      throw APIError.server(StatusCodes.FORBIDDEN, "Unsaved access iv");

    const { Body } = schema.req.security.access.Email.Middleware;
    const { code, password, confirmPassword } = Body.parse(req.body);

    if (password !== confirmPassword)
      throw APIError.controller(StatusCodes.CONFLICT, "Passwords not equal");

    const { access } = util;

    const hasAccess = access.verify(token, key, iv, code);
    if (!hasAccess.valid)
      throw APIError.middleware(
        StatusCodes.UNAUTHORIZED,
        "Invalid access token"
      );

    req.session.access = { key: "", iv: "" };

    const { User } = model.db;
    const user = await User.findOne({
      attributes: ["id"],
      where: { id: hasAccess.id },
      plain: true,
      limit: 1,
    });
    if (user === null)
      throw APIError.middleware(StatusCodes.NOT_FOUND, "User not found");

    delete req.body.code;
    delete req.body.confirmPassword;

    return next();
  },
} as const;
