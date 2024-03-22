import type { IncomingHttpHeaders } from "node:http";
import type { Request, Response, NextFunction } from "express";
import { VALUES } from "../constant/index.js";
import { StatusCodes } from "http-status-codes";
import { BaseError } from "../error/index.js";
import { ZodError } from "zod";
import { TResponse } from "../types/index.js";

export function handleAsync(
  fn: (
    req: Request,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res: Response<any, any>,
    next: NextFunction
  ) => Promise<void>
) {
  return async (
    req: Request,
    res: Response<TResponse["Body"]["Fail"]>,
    next: NextFunction
  ) => {
    try {
      await fn(req, res, next);
    } catch (error) {
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
