import type { IncomingHttpHeaders } from "node:http";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { TResponse } from "../types/index.js";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { MulterError } from "multer";
import { VALUES } from "../constant/index.js";
import { BaseError } from "../error/index.js";
import type { Transaction } from "sequelize";

type HandleAsyncFn =
  | ((req: Request, res: Response<any, any>, next: NextFunction, transaction: Transaction) => Promise<void>)
  | RequestHandler;

export function handleAsync(fn: HandleAsyncFn) {
  return async (req: Request, res: Response<TResponse["Body"]["Fail"]>, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
      await fn(req, res, next, transaction);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      await BaseError.handleError(error);
      let status: StatusCodes = StatusCodes.BAD_REQUEST;
      let message = "";

      if (error instanceof BaseError) {
        status = error.statusCode;
        message = error.message;
      } else if (error instanceof ZodError) {
        message = error
          .format()
          ._errors.map((error) => error + ";")
          .join("");
      } else if (error instanceof MulterError) {
        status = StatusCodes.FORBIDDEN;
        message = error.message;
      } else {
        return next(error);
      }

      res.status(status).json({ success: false, message });
    }
  };
}

/**
 * Get current Time in seconds
 * @param [add=0] - In milliseconds
 * */
export function nowInSecond(add: number = 0) {
  return Math.floor((Date.now() + add) / VALUES.TIME.SECOND);
}

export function getHeader(headers: IncomingHttpHeaders, key: string) {
  return headers[key.toLowerCase()] ?? "";
}
