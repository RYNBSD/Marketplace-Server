import type { NextFunction, Request, Response } from "express";
import type { Transaction } from "sequelize";
import type { TResponse } from "../../../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { service } from "../../../../service/index.js";

export default {
  async products(
    _req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const store = res.locals.store!;
    const { stats } = service.store;
    const products = await stats.products(store.dataValues.id, transaction);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        products,
      },
    });
  },
  async categories(
    _req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const store = res.locals.store!;
    const { stats } = service.store;
    const categories = await stats.categories(store.dataValues.id, transaction);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        categories,
      },
    });
  },
  async orders(
    _req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const store = res.locals.store!;
    const { stats } = service.store;
    const orders = await stats.orders(store.dataValues.id, transaction);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        orders,
      },
    });
  },
} as const;
