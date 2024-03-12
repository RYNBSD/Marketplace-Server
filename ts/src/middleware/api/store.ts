import type { Request, Response, NextFunction } from "express";
import type { TResponse } from "../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { model } from "../../model/index.js";
import { APIError } from "../../error/index.js";
import { schema } from "../../schema/index.js";

const { SellerId, CategoryId, ProductId } = schema.id;

export default {
  async checkSeller(
    req: Request,
    res: Response<never, TResponse["Locals"]>,
    next: NextFunction
  ) {
    const { sellerId } = SellerId.parse(req.params);
    const { Seller } = model.db;

    const store = await Seller.findOne({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: { id: sellerId },
      limit: 1,
      plain: true,
    });
    if (store === null)
      throw APIError.middleware(StatusCodes.NOT_FOUND, "Store not found");

    res.locals = {
      ...res.locals,
      store,
    };
    return next();
  },
  async checkCategory(
    req: Request,
    res: Response<never, TResponse["Locals"]>,
    next: NextFunction
  ) {
    const { categoryId } = CategoryId.parse(req.params);

    const { store } = res.locals;
    if (store === undefined)
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unchecked store (checkCategory middleware)"
      );

    const { Category } = model.db;
    const category = await Category.findOne({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: { id: categoryId, sellerId: store.dataValues.id },
      limit: 1,
      plain: true,
    });
    if (category === null)
      throw APIError.middleware(StatusCodes.NOT_FOUND, "Category not found");

    res.locals = {
      ...res.locals,
      category,
    };
    return next();
  },
  async checkProduct(
    req: Request,
    res: Response<never, TResponse["Locals"]>,
    next: NextFunction
  ) {
    const { productId } = ProductId.parse(req.params);

    const { category } = res.locals;
    if (category === undefined)
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unchecked category (checkProduct middleware)"
      );

    const { Product } = model.db;
    const product = await Product.findOne({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: { id: productId, categoryId: category.dataValues.id },
      limit: 1,
      plain: true,
    });
    if (product === null)
      throw APIError.middleware(StatusCodes.NOT_FOUND, "Product not found");

    res.locals = {
      ...res.locals,
      product,
    };
    return next();
  },
  async isSeller(
    req: Request,
    res: Response<never, TResponse["Locals"]>,
    next: NextFunction
  ) {
    const { user } = req;
    if (user === undefined)
      throw APIError.middleware(StatusCodes.UNAUTHORIZED, "Unauthorized user");

    const { Seller } = model.db;
    const store = await Seller.findOne({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: { id: user.dataValues.id },
      limit: 1,
      plain: true,
    });
    if (store === null)
      throw APIError.middleware(
        StatusCodes.NOT_FOUND,
        "Store not found, you can become seller"
      );

    res.locals = {
      ...res.locals,
      store,
    };
    return next();
  },
  async isCategoryOwner(
    _req: Request,
    res: Response<never, TResponse["Locals"]>,
    next: NextFunction
  ) {
    const { store } = res.locals;
    if (store === undefined)
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unchecked store (isCategoryOwner middleware)"
      );

    const { Category } = model.db;
    const category = await Category.findOne({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: { sellerId: store.dataValues.id },
      plain: true,
      limit: 1,
    });
    if (category === null)
      throw APIError.middleware(StatusCodes.NOT_FOUND, "Category not found");

    res.locals = {
      ...res.locals,
      category,
    };
    return next();
  },
  async isProductOwner(
    _req: Request,
    res: Response<never, TResponse["Locals"]>,
    next: NextFunction
  ) {
    const { category } = res.locals;
    if (category === undefined)
      throw APIError.middleware(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unchecked category (isProductOwner middleware)"
      );

    const { Product } = model.db;
    const product = await Product.findOne({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: { categoryId: category.dataValues.id },
      limit: 1,
      plain: true,
    });
    if (product === null)
      throw APIError.middleware(StatusCodes.NOT_FOUND, "Product not found");

    res.locals = {
      ...res.locals,
      product,
    };
    return next();
  },
} as const;
