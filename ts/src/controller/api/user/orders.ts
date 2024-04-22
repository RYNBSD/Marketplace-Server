import type { Request, Response } from "express";
import type { TResponse } from "../../../types/res.js";
import { StatusCodes } from "http-status-codes";

export default {
  async orders(req: Request, res: Response<TResponse["Body"]["Success"]>) {
    req;
    res.status(StatusCodes.OK).json({ success: true });
  },
  async order(req: Request, res: Response<TResponse["Body"]["Success"]>) {
    req;
    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
