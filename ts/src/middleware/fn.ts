import type { Request, Response, NextFunction } from "express";
import type { TResponse } from "../types/index.js";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../error/index.js";
import { model } from "../model/index.js";

export async function isAuthorize(
  req: Request,
  res: Response<never, TResponse["Locals"]["User"]>,
  next: NextFunction
) {
  const authenticate = req.isAuthenticated();

  if (!authenticate) throw APIError.middleware(StatusCodes.UNAUTHORIZED);

  const { user: id } = req.session.passport!;
  const { User } = model.db;

  const user = await User.findOne({ where: { id }, limit: 1, plain: true });
  if (user === null)
    throw APIError.middleware(StatusCodes.UNAUTHORIZED, "User not found");

  res.locals = {
    user,
    seller: null,
  };
  return next();
}

export async function isUnauthorize(
  req: Request,
  res: Response<never, TResponse["Locals"]["User"]>,
  next: NextFunction
) {
  const unauthenticated = req.isUnauthenticated();
  if (unauthenticated) return next();

  const { user: id } = req.session.passport!;
  const { User } = model.db;

  const user = await User.findOne({
    where: { id },
    limit: 1,
    plain: true,
  });
  if (user === null)
    throw APIError.middleware(StatusCodes.UNAUTHORIZED, "User not found");

  res.locals = {
    user,
    seller: null,
  };
  return next();
}
