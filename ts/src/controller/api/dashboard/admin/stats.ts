import type { NextFunction, Request, Response } from "express";
import type { Transaction } from "sequelize";
import type { TResponse } from "../../../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { service } from "../../../../service/index.js";

export default {
  async users(
    _req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { stats } = service.admin;
    const users = await stats.users(transaction);
    res.status(StatusCodes.OK).json({
      success: true,
      data: { users },
    });
  },
  async stores(
    _req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { stats } = service.admin;
    const stores = await stats.stores(transaction);
    res.status(StatusCodes.OK).json({
      success: true,
      data: { stores },
    });
  },
  async orders(
    _req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { stats } = service.admin;
    const orders = await stats.orders(transaction);
    res.status(StatusCodes.OK).json({
      success: true,
      data: { orders },
    });
  },
  async products(
    _req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { stats } = service.admin;
    const products = await stats.products(transaction);
    res.status(StatusCodes.OK).json({
      success: true,
      data: { products },
    });
  },
  async categories(
    _req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { stats } = service.admin;
    const categories = await stats.categories(transaction);
    res.status(StatusCodes.OK).json({
      success: true,
      data: { categories },
    });
  },
} as const;
