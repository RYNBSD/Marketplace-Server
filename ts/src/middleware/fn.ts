import type { Request, Response, NextFunction } from "express";
import type { TResponse } from "../types/index.js";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../error/index.js";
import { model } from "../model/index.js";

/** Check if user has registered */
export async function isAuthenticated(
  req: Request,
  _res: Response<never, TResponse["Locals"]>,
  next: NextFunction
) {
  const authenticate = req.isAuthenticated();
  if (!authenticate)
    throw APIError.middleware(StatusCodes.UNAUTHORIZED, "Unauthenticated user");

  return next();
}

/** Block any authenticated user */
export async function notAuthenticated(
  req: Request,
  _res: Response<never, TResponse["Locals"]>,
  next: NextFunction
) {
  const authenticated = req.isAuthenticated();
  if (authenticated)
    throw APIError.middleware(
      StatusCodes.NOT_ACCEPTABLE,
      "User already authenticated"
    );

  return next();
}

/** Check if user is seller */
export async function isSeller(
  req: Request,
  res: Response<never, TResponse["Locals"]>,
  next: NextFunction
) {
  const { user } = req;
  if (user === undefined)
    throw APIError.server(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Unprovided user in isSeller middleware"
    );

  const { Store } = model.db;
  const store = await Store.findOne({
    where: { userId: user.dataValues.id },
    limit: 1,
    plain: true,
  });
  if (store === null)
    throw APIError.middleware(StatusCodes.NOT_FOUND, "Seller not found");

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
