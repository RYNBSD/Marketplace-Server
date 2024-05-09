import type { Request, Response, NextFunction } from "express";
import type { Transaction } from "sequelize";
import type { TResponse } from "../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { util } from "../../util/index.js";
import { KEYS } from "../../constant/index.js";
import { model } from "../../model/index.js";
import { schema } from "../../schema/index.js";
import { APIError } from "../../error/index.js";

const { COOKIE } = KEYS;

export default {
  async access(req: Request, _res: Response<never, TResponse["Locals"]>, next: NextFunction, transaction: Transaction) {
    const token = `${req.cookies[COOKIE.TOKEN] ?? ""}`;
    if (token.length === 0) throw APIError.middleware(StatusCodes.BAD_REQUEST, "Access token not send");

    const key = req.session.access?.key ?? "";
    if (key.length === 0) throw APIError.server(StatusCodes.FORBIDDEN, "Invalid access key");

    const iv = req.session.access?.iv ?? "";
    if (iv.length === 0) throw APIError.server(StatusCodes.FORBIDDEN, "Invalid access iv");

    const { Body } = schema.req.security.access.Email.Middleware;
    const { code, password, confirmPassword } = Body.parse(req.body);

    if (!Object.is(password, confirmPassword)) throw APIError.controller(StatusCodes.CONFLICT, "Passwords not equal");

    const { access } = util;

    const hasAccess = access.verify(token, key, iv, code);
    if (!hasAccess.valid) throw APIError.middleware(StatusCodes.UNAUTHORIZED, "Invalid access token");

    req.session.access = { key: "", iv: "" };

    const { User } = model.db;
    const user = await User.findOne({
      attributes: ["id", "emailVerified"],
      where: { id: hasAccess.id },
      plain: true,
      limit: 1,
      transaction,
    });
    if (user === null) throw APIError.middleware(StatusCodes.NOT_FOUND, "User not found");

    delete req.body.code;
    delete req.body.confirmPassword;

    req.user = user;
    return next();
  },
} as const;
