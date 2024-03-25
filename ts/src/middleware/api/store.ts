import type { Request, Response, NextFunction } from "express";
import type { TResponse } from "../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { model } from "../../model/index.js";
import { APIError } from "../../error/index.js";
import { schema } from "../../schema/index.js";

const { StoreId, CategoryId, ProductId } = schema.id;

export default {
  async checkStore(req: Request, res: Response<never, TResponse["Locals"]>, next: NextFunction) {
    const { storeId } = StoreId.parse(req.params);
    const { Store } = model.db;

    const store = await Store.findOne({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: { id: storeId },
      limit: 1,
      plain: true,
    });
    if (store === null) throw APIError.middleware(StatusCodes.NOT_FOUND, "Store not found");

    res.locals = {
      ...res.locals,
      store,
    };
    return next();
  },
  async checkCategory(req: Request, res: Response<never, TResponse["Locals"]>, next: NextFunction) {
    const { categoryId } = CategoryId.parse(req.params);
    const { store } = res.locals;

    const { Category } = model.db;
    const category = await Category.findOne({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: { id: categoryId, storeId: store!.dataValues.id },
      limit: 1,
      plain: true,
    });
    if (category === null) throw APIError.middleware(StatusCodes.NOT_FOUND, "Category not found");

    res.locals = {
      ...res.locals,
      category,
    };
    return next();
  },
  async checkProduct(req: Request, res: Response<never, TResponse["Locals"]>, next: NextFunction) {
    const { productId } = ProductId.parse(req.params);
    const { category } = res.locals;

    const { Product } = model.db;
    const product = await Product.findOne({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: { id: productId, categoryId: category!.dataValues.id },
      limit: 1,
      plain: true,
    });
    if (product === null) throw APIError.middleware(StatusCodes.NOT_FOUND, "Product not found");

    res.locals = {
      ...res.locals,
      product,
    };
    return next();
  },
  async isSeller(req: Request, res: Response<never, TResponse["Locals"]>, next: NextFunction) {
    const { user } = req;
    if (user === undefined) throw APIError.middleware(StatusCodes.UNAUTHORIZED, "Unauthorized user");

    const { Store } = model.db;
    const store = await Store.findOne({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: { id: user.dataValues.id },
      limit: 1,
      plain: true,
    });
    if (store === null) throw APIError.middleware(StatusCodes.NOT_FOUND, "Store not found, you can become seller");

    res.locals = {
      ...res.locals,
      store,
    };
    return next();
  },
  async isCategoryOwner(req: Request, res: Response<never, TResponse["Locals"]>, next: NextFunction) {
    const { categoryId } = CategoryId.parse(req.params);
    const { store } = res.locals;
    const { Category } = model.db;

    const category = await Category.findOne({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: { storeId: store!.dataValues.id, id: categoryId },
      plain: true,
      limit: 1,
    });
    if (category === null) throw APIError.middleware(StatusCodes.NOT_FOUND, "Category not found");

    res.locals = {
      ...res.locals,
      category,
    };
    return next();
  },
  async isProductOwner(req: Request, res: Response<never, TResponse["Locals"]>, next: NextFunction) {
    const { productId } = ProductId.parse(req.params);
    const { store } = res.locals;
    const { Category } = model.db;

    const categories = await Category.findAll({
      attributes: ["id"],
      where: { storeId: store!.dataValues.id },
    });
    if (categories.length === 0)
      throw APIError.middleware(StatusCodes.FORBIDDEN, "This store don't have any categories");

    const categoryId = categories.map((category) => category.dataValues.id);
    const { Product } = model.db;

    const product = await Product.findOne({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: {
        categoryId,
        id: productId,
      },
      limit: 1,
      plain: true,
    });
    if (product === null) throw APIError.middleware(StatusCodes.NOT_FOUND, "Product not found");

    res.locals = {
      ...res.locals,
      product,
    };
    return next();
  },
} as const;
