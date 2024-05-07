import { NextFunction, Request, Response } from "express";

export default {
  async isAdmin(_req: Request, _res: Response, next: NextFunction) {
    return next();
  },
} as const;
