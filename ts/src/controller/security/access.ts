import type { NextFunction, Request, Response } from "express";
import type { Transaction } from "sequelize";
import type { TResponse } from "../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { schema } from "../../schema/index.js";
import { model } from "../../model/index.js";
import { APIError } from "../../error/index.js";
import { util } from "../../util/index.js";
import { KEYS } from "../../constant/index.js";
import { lib } from "../../lib/index.js";

const { HTTP } = KEYS;
const { Email } = schema.req.security.access;

export default {
  async email(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { Body } = Email;
    const { User } = model.db;
    const { email } = Body.parse(req.body);

    const user = await User.findOne({
      attributes: ["id"],
      where: { email },
      limit: 1,
      transaction,
    });
    if (user === null) throw APIError.controller(StatusCodes.NOT_FOUND, "user not found");

    const { access } = util;
    const { token, code, key, iv } = access.token(user.dataValues.id);

    req.session.access = { key, iv };
    res.setHeader(HTTP.HEADERS.ACCESS_TOKEN, token);

    //TODO: Send code in email (template)
    const { Mail } = lib;
    await new Mail(email, "access code", `Code: ${code}`).send();

    res.status(StatusCodes.CREATED).json({
      success: true,
    });
  },
} as const;
