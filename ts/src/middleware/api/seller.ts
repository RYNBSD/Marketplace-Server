import type { Request, Response, NextFunction } from "express";
import type { TResponse } from "../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { model } from "../../model/index.js";
import { APIError } from "../../error/index.js";

export default {
  async isSeller(
    _: Request,
    res: Response<never, TResponse["Locals"]["User"]>,
    next: NextFunction
  ) {
    const { user } = res.locals;
    const { Seller } = model.db;

    const seller = await Seller.findOne({
      where: { userId: user.dataValues.id },
      limit: 1,
      plain: true,
    });
    if (seller === null)
      throw APIError.middleware(StatusCodes.BAD_REQUEST, "No seller account");

    res.locals.seller = seller;
    return next();
  },
} as const;
