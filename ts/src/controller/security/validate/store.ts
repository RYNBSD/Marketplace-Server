import type { NextFunction, Request, Response } from "express";
import type { Transaction } from "sequelize";
import type { TResponse } from "../../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { schema } from "../../../schema/index.js";
import { model } from "../../../model/index.js";
import { APIError } from "../../../error/index.js";

const { Name, Category: CategorySchema, Product: ProductSchema } = schema.req.security.validate.store;

export default {
  async name(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { Body } = Name;
    const { name } = Body.parse(req.body);
    const { Store } = model.db;

    const store = await Store.findOne({
      attributes: ["name"],
      where: { name },
      limit: 1,
      plain: true,
      paranoid: false,
      transaction,
    });
    if (store !== null) throw APIError.controller(StatusCodes.CONFLICT, "Store name already exists");

    res.status(StatusCodes.OK).json({ success: true });
  },
  async category(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { Body } = CategorySchema;
    const { name, nameAr } = Body.parse(req.body);

    const store = res.locals.store!;
    const { Category } = model.db;

    const [category, categoryAr] = await Promise.all([
      Category.findOne({
        attributes: ["name"],
        where: { name, storeId: store.dataValues.id },
        limit: 1,
        plain: true,
        paranoid: false,
        transaction,
      }),
      Category.findOne({
        attributes: ["nameAr"],
        where: { nameAr, storeId: store.dataValues.id },
        limit: 1,
        plain: true,
        paranoid: false,
        transaction,
      }),
    ]);

    if (category !== null) throw APIError.controller(StatusCodes.CONFLICT, "Category name already exists");
    else if (categoryAr !== null)
      throw APIError.controller(StatusCodes.CONFLICT, "Category arabic name already exists");

    res.status(StatusCodes.OK).json({ success: true });
  },
  async product(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { Body } = ProductSchema;
    const { title, titleAr } = Body.parse(req.body);

    const { Product } = model.db;

    const [product, productAr] = await Promise.all([
      Product.findOne({
        attributes: ["title"],
        where: { title },
        limit: 1,
        plain: true,
        paranoid: false,
        transaction,
      }),
      Product.findOne({
        attributes: ["titleAr"],
        where: { titleAr },
        limit: 1,
        plain: true,
        paranoid: false,
        transaction,
      }),
    ]);

    if (product !== null) throw APIError.controller(StatusCodes.CONFLICT, "Product name already exists");
    else if (productAr !== null) throw APIError.controller(StatusCodes.CONFLICT, "Product arabic name already exists");

    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
