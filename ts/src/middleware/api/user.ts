import type { Request, Response, NextFunction } from "express";
import type { TResponse } from "../../types/index.js";
import { schema } from "../../schema/index.js";
import { model } from "../../model/index.js";

const { isUUID } = schema.validators;

export default {
  async isSeller(
    req: Request,
    res: Response<never, TResponse["Locals"]["User"]>,
    next: NextFunction
  ) {
    const id = req.session.user?.seller?.id ?? "";
    const parsedId = isUUID.safeParse(id);
    if (!parsedId.success) {
      res.locals.seller = null;
      return next();
    }

    const { Seller } = model.db;
    const seller = await Seller.findOne({
      where: { id: parsedId },
      limit: 1,
      plain: true,
    });

    res.locals.seller = seller;
    return next();
  },
} as const;
