import type { Request, Response } from "express";
import type { TResponse } from "../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../../error/index.js";
import { model } from "../../model/index.js";

export default {
  async profile(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]["User"]>
  ) {
    const { user } = res.locals;
    const { UserSettings, Seller } = model.db;

    const setting = await UserSettings.findOne({
      attributes: ["theme", "locale", "forceTheme", "disableAnimations"],
      where: { userId: user.dataValues.id },
      limit: 1,
      plain: true,
    });
    if (setting === null)
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "User has not initial setting"
      );

    const seller = await Seller.findOne({
      attributes: ["id", "storeName", "image"],
      where: { userId: user.dataValues.id },
      limit: 1,
      plain: true,
    });
    if (seller !== null)
      req.session.user!.seller = { id: seller.dataValues.id };

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user: {
          ...user.dataValues,
          setting: setting.dataValues,
          seller: seller?.dataValues ?? null,
        },
      },
    });
  },
  async orders(req: Request, res: Response<TResponse["Body"]["Success"]>) {
    req;
    res.status(StatusCodes.OK).json({ success: true });
  },
  async becomeSeller(
    req: Request,
    res: Response<TResponse["Body"]["Success"]>
  ) {
    req;
    res.status(StatusCodes.OK).json({ success: true });
  },
  async update(req: Request, res: Response<TResponse["Body"]["Success"]>) {
    req;
    res.status(StatusCodes.OK).json({ success: true });
  },
  async delete(req: Request, res: Response<TResponse["Body"]["Success"]>) {
    req;
    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
