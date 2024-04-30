import type { NextFunction, Request, Response } from "express";
import type { Transaction } from "sequelize";
import type { TResponse } from "../../../types/res.js";
import { StatusCodes } from "http-status-codes";
import { model } from "../../../model/index.js";
import { schema } from "../../../schema/index.js";
import { ORDER_STATUS } from "../../../constant/enum.js";
import { APIError } from "../../../error/index.js";
import { service } from "../../../service/index.js";

const { Create, Update } = schema.req.api.user.orders;

export default {
  async all(req: Request, res: Response<TResponse["Body"]["Success"]>, _next: NextFunction, transaction: Transaction) {
    const user = req.user!;
    const { all } = service.order.user;
    const orders = await all(user.dataValues.id, transaction);
    res.status(StatusCodes.OK).json({ success: true, data: { orders } });
  },
  async order(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const user = req.user!;
    const localOrder = res.locals.order!;
    const { one } = service.order.user;
    const order = await one(localOrder.dataValues.id, user.dataValues.id, transaction);
    res.status(StatusCodes.OK).json({ success: true, data: { order } });
  },
  async create(
    req: Request,
    res: Response<TResponse["Body"]["Success"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { Body } = Create;
    const { orders } = Body.parse(req.body);

    const user = req.user!;
    const { Order } = model.db;

    await Order.bulkCreate(
      orders.map((order) => ({
        userId: user.dataValues.id,
        productId: order.productId,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
      })),
      { fields: ["userId", "productId", "quantity", "totalPrice"], transaction },
    );

    res.status(StatusCodes.CREATED).json({ success: true });
  },
  async patch(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const order = res.locals.order!;
    if (order.dataValues.status !== ORDER_STATUS[0])
      throw APIError.controller(StatusCodes.FORBIDDEN, "Your order is on processing");

    const { Query } = Update;
    const { quantity } = Query.parse(req.query);

    await order.update({ quantity }, { fields: ["quantity"], transaction });
    res.status(StatusCodes.OK).json({ success: true, data: { order: order.dataValues } });
  },
  async remove(
    _req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const order = res.locals.order!;
    await order.update(
      { status: ORDER_STATUS[3], canceledAt: new Date() },
      { fields: ["status", "canceledAt"], transaction },
    );
    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
