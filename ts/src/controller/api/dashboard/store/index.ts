import type { NextFunction, Request, Response } from "express";
import type { TResponse } from "../../../../types/index.js";
import { Op, type Transaction } from "sequelize";
import { StatusCodes } from "http-status-codes";
import { model } from "../../../../model/index.js";
import { APIError } from "../../../../error/index.js";
import { lib } from "../../../../lib/index.js";
import { schema } from "../../../../schema/index.js";
import categories from "./categories.js";
import products from "./products.js";
import stats from "./stats.js";

const { Update } = schema.req.api.dashboard.store;

export default {
  async profile(_req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { store } = res.locals;

    const { Category, Product } = model.db;

    const categories = await Category.findAll({
      attributes: ["id"],
      where: { storeId: store!.dataValues.id },
    });

    const products = await Product.count({
      attributes: ["categoryId"],
      where: {
        [Op.or]: {
          categoryId: categories.map((category) => category.dataValues.id),
        },
      },
      group: "categoryId",
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        store: store!.dataValues,
        count: {
          categories: categories.length,
          products,
        },
      },
    });
  },
  async update(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { Body } = Update;
    const { name } = Body.parse(req.body);

    const { store } = res.locals;
    if (store === undefined)
      throw APIError.server(StatusCodes.INTERNAL_SERVER_ERROR, "Unprovided local store (seller:update)");

    let newImage = store.dataValues.image;
    const image = req.file;

    if (image !== undefined && image.buffer.length > 0) {
      const { FileConverter, FileUploader } = lib.file;

      const converted = await new FileConverter(image.buffer).convert();
      if (converted.length === 0) throw APIError.controller(StatusCodes.UNSUPPORTED_MEDIA_TYPE, "Invalid image format");

      const uploaded = await new FileUploader(...converted).upload();
      if (uploaded.length === 0) throw APIError.server(StatusCodes.INTERNAL_SERVER_ERROR, "Can't upload your image");

      newImage = uploaded[0]!;
    }

    await store.update({ name, image: newImage }, { fields: ["name", "image"], transaction });
    res.status(StatusCodes.OK).json({ success: true, data: { store: store!.dataValues } });
  },
  async remove(
    _req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const store = res.locals.store!;
    await store.destroy({ force: false, transaction });
    res.status(StatusCodes.OK).json({ success: true });
  },
  categories,
  products,
  stats,
} as const;
