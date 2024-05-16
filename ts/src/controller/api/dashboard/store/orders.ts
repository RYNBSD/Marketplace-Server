import type { NextFunction, Request, Response } from "express";
import type { Transaction } from "sequelize";
import type { TResponse } from "../../../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { service } from "../../../../service/index.js";
import { model } from "../../../../model/index.js";
import { APIError } from "../../../../error/index.js";
import { schema } from "../../../../schema/index.js";

const { OrderId } = schema.id;
const { Patch } = schema.req.api.dashboard.store.orders;

export default {
  async all(
    _req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const store = res.locals.store!;

    const { all } = service.store.orders;
    const orders = await all(store.dataValues.id, transaction);

    res.status(StatusCodes.OK).json({ success: true, data: { orders } });
  },
  async order(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { orderId } = OrderId.parse(req.params);
    const store = res.locals.store!;

    const { orders } = service.store;
    const order = await orders.order(store.dataValues.id, orderId, transaction);

    res.status(StatusCodes.OK).json({ success: true, data: { order } });
  },
  async patch(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { Query } = Patch;
    const [{ orderId }, { status }] = await Promise.all([OrderId.parseAsync(req.params), Query.parseAsync(req.query)]);

    const { Order } = model.db;
    const order = await Order.findOne({ where: { id: orderId }, limit: 1, plain: true, transaction });
    if (order === null) throw APIError.controller(StatusCodes.NOT_FOUND, "Order not found");

    if (order.dataValues.canceledAt !== null)
      throw APIError.controller(StatusCodes.FORBIDDEN, "Order already canceled");

    if (order.dataValues.doneAt !== null) throw APIError.controller(StatusCodes.FORBIDDEN, "Order already delivered");

    if (status === "wait") throw APIError.controller(StatusCodes.FORBIDDEN, 'Can\'t set status to "wait"');

    await order.update(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      {
        status,
        processedAt: status === "process" ? new Date() : null,
        doneAt: status === "done" ? new Date() : null,
        canceledAt: status === "canceled" ? new Date() : null,
      },
      { fields: ["status"], transaction },
    );

    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
