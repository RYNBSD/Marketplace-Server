import type { Request, Response } from "express";
import type { TResponse } from "../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { KEYS } from "../../constant/index.js";
import { util } from "../../util/index.js";

export default {
  async create(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>
  ) {
    // // Check CSRF TOKEN already exists
    // const checkSecret = req.session.csrf?.secret ?? "";
    // if (checkSecret.length > 0)
    //   throw APIError.controller(
    //     StatusCodes.FORBIDDEN,
    //     "CSRF Token already exists"
    //   );

    const { csrf } = util;
    const { token, secret } = csrf.generate();
    req.session.csrf = { secret };

    res
      .status(StatusCodes.OK)
      .setHeader(KEYS.HTTP.HEADERS.CSRF, token)
      .json({ success: true });
  },
  async delete(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>
  ) {
    req.session.csrf = { secret: "" };
    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
