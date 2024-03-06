import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../error/index.js";
import { schema } from "../schema/index.js";
import { model } from "../model/index.js";

const {
  validators: { isUUID },
} = schema;

export async function isAuthorize(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const parse = isUUID.safeParse(req.session.user?.id ?? "");
  if (!parse.success)
    throw APIError.middleware(StatusCodes.UNAUTHORIZED, parse.error.message);

  const id = parse.data;
  const { User } = model.db;

  const user = await User.findOne({ where: { id }, limit: 1, plain: true });
  if (user === null)
    throw APIError.middleware(StatusCodes.UNAUTHORIZED, "User not found");

  res.locals.user = user;
  return next();
}

export async function isUnauthorize(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const parse = isUUID.safeParse(req.session.user?.id ?? "");
  if (!parse.success) return next();

  const { User } = model.db;
  const user = await User.findOne({
    where: { id: parse.data },
    limit: 1,
    plain: true,
  });
  if (user === null)
    throw APIError.middleware(StatusCodes.UNAUTHORIZED, "User not found");

  res.locals.user = user;
  return next();
}
