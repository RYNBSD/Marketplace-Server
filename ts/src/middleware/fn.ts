import type { Request, Response, NextFunction } from "express";
import type { Transaction } from "sequelize";
import type { TResponse } from "../types/index.js";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../error/index.js";
import { model } from "../model/index.js";
import { schema } from "../schema/index.js";

const { OrderId } = schema.id;

/** Check if user has registered */
export async function isAuthenticated(req: Request, _res: Response<never, TResponse["Locals"]>, next: NextFunction) {
  const authenticate = req.isAuthenticated();
  if (!authenticate) throw APIError.middleware(StatusCodes.UNAUTHORIZED, "Unauthenticated user");

  return next();
}

/** Block any authenticated user */
export async function notAuthenticated(req: Request, _res: Response<never, TResponse["Locals"]>, next: NextFunction) {
  const authenticated = req.isAuthenticated();
  if (authenticated) throw APIError.middleware(StatusCodes.NOT_ACCEPTABLE, "User already authenticated");

  return next();
}

export async function checkOrder(
  req: Request,
  res: Response<never, TResponse["Locals"]>,
  next: NextFunction,
  transaction: Transaction,
) {
  const user = req.user!;
  const { orderId } = OrderId.parse(req.params);

  const { Order } = model.db;
  const order = await Order.findOne({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    where: { id: orderId, userId: user.dataValues.id },
    limit: 1,
    plain: true,
    transaction,
  });
  if (order === null) throw APIError.middleware(StatusCodes.NOT_FOUND, "Order not found");

  res.locals = {
    ...res.locals,
    order,
  };
  return next();
}

/** Check if user is seller @deprecated */
export async function isSeller(
  req: Request,
  res: Response<never, TResponse["Locals"]>,
  next: NextFunction,
  transaction: Transaction,
) {
  const { user } = req;

  const { Store } = model.db;
  const store = await Store.findOne({
    attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    where: { userId: user!.dataValues.id },
    limit: 1,
    plain: true,
    transaction,
  });
  if (store === null) throw APIError.middleware(StatusCodes.NOT_FOUND, "Seller not found");

  res.locals = {
    ...res.locals,
    store,
  };
  return next();
}

/** Check if user is not seller */
// export async function isNotSeller(
//   _req: Request,
//   res: Response<never, TResponse["Locals"]>,
//   next: NextFunction
// ) {
//   const { user } = res.locals;

//   const { Seller } = model.db;
//   const seller = await Seller.findOne({
//     where: { userId: user!.dataValues.id },
//     limit: 1,
//     plain: true,
//   });
//   if (seller !== null)
//     throw APIError.middleware(
//       StatusCodes.FORBIDDEN,
//       "User already has an account"
//     );

//   res.locals.seller = seller;
//   return next();
// }
