import type { NextFunction, Request, Response } from "express";
import type { TResponse } from "../../types/index.js";

export default {
  async isAdmin(_req: Request, _res: Response<never, TResponse["Locals"]>, next: NextFunction) {
    return next();
  },
} as const;
