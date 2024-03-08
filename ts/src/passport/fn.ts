import type { Request, Response, NextFunction } from "express";
import type { Strategy } from "passport";
import {passport} from "./index.js";
import { APIError } from "../error/index.js";
import { StatusCodes } from "http-status-codes";

export async function authenticate(
  strategy: Strategy | string | string[],
  req: Request,
  res: Response,
  next: NextFunction
) {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      strategy,
      (err: unknown, user: { id: string }, info: { message: string }) => {
        if (err) return reject(err);
        if (!user)
          return reject(
            APIError.passport(
              StatusCodes.BAD_REQUEST,
              info?.message ?? "Invalid info"
            )
          );

        req.logIn(user, (err) => {
          if (err) return reject(err);
          return resolve(user);
        });
      }
    )(req, res, next);
  });
}
