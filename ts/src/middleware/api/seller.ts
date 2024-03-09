import type { Request, Response, NextFunction } from "express";
import type { TResponse } from "../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { model } from "../../model/index.js";
import { APIError } from "../../error/index.js";

export default {
  async isCategoryOwner(
    _req: Request,
    res: Response<never, TResponse["Locals"]>,
    next: NextFunction
  ) {
    const { profile: seller } = res.locals.seller!;
    if (seller === null)
      throw APIError.middleware(StatusCodes.UNAUTHORIZED, "Seller not found");

    const { Category } = model.db;
    const category = await Category.findOne({
      where: { sellerId: seller.dataValues.id },
      limit: 1,
      plain: true,
    });
    if (category === null)
      throw APIError.middleware(StatusCodes.NOT_FOUND, "Category not found");

    res.locals.seller = {
      category,
      product: null,
      profile: seller,
    };
    return next();
  },
  async isProductOwner(
    _req: Request,
    res: Response<never, TResponse["Locals"]>,
    next: NextFunction
  ) {
    const { category, profile } = res.locals.seller!;
    if (category === null)
      throw APIError.middleware(StatusCodes.UNAUTHORIZED, "Category not found");

    const { Product } = model.db;
    const product = await Product.findOne({
      where: { categoryId: category.dataValues.id },
      limit: 1,
      plain: true,
    });
    if (product === null)
      throw APIError.middleware(StatusCodes.NOT_FOUND, "Product not found");

    res.locals.seller = {
      category,
      product,
      profile,
    };
    return next();
  },
} as const;
