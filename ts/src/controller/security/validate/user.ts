import type { Request, Response } from "express";
import type { TResponse } from "../../../types/res.js";
import { StatusCodes } from "http-status-codes";
import { model } from "../../../model/index.js";
import { schema } from "../../../schema/index.js";
import { APIError } from "../../../error/index.js";

const { Email } = schema.req.security.validate.user;

export default {
  async email(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Body } = Email;
    const { email } = Body.parse(req.body);
    const { User } = model.db;

    const user = await User.findOne({
      attributes: ["email"],
      where: { email },
      limit: 1,
      plain: true,
      paranoid: false,
    });
    if (user !== null) throw APIError.controller(StatusCodes.CONFLICT, "Email already exists");

    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
