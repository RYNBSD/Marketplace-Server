import type { Request, Response } from "express";
import type { TResponse } from "../../../../types/index.js";
import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";
import { model } from "../../../../model/index.js";
import { APIError } from "../../../../error/index.js";
import { lib } from "../../../../lib/index.js";
import { schema } from "../../../../schema/index.js";

const { Update } = schema.req.api.dashboard.store;

const [{ default: categories }, { default: products }] = await Promise.all([
  import("./categories.js"),
  import("./products.js"),
]);

export default {
  async profile(_req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { store } = res.locals;

    const { Category, Product } = model.db;

    const categories = await Category.findAll({
      attributes: ["id"],
      where: { storeId: store!.dataValues.id },
    });

    const products = await Product.findAll({
      attributes: ["categoryId"],
      where: {
        [Op.or]: {
          categoryId: categories.map((category) => category.dataValues.id),
        },
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        store: store!.dataValues,
        count: {
          categories: categories.length,
          products: products.length,
        },
      },
    });
  },
  async update(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Body } = Update;
    const { name } = Body.parse(req.body);

    const { store } = res.locals;
    if (store === undefined)
      throw APIError.server(StatusCodes.INTERNAL_SERVER_ERROR, "Unprovided local store (seller:update)");

    let newImage = store.dataValues.image;
    const image = req.file ?? null;

    if (image !== null) {
      const { FileConverter, FileUploader } = lib.file;

      const converted = await new FileConverter(image.buffer).convert();
      if (converted.length === 0) throw APIError.controller(StatusCodes.UNSUPPORTED_MEDIA_TYPE, "Invalid image format");

      const uploaded = await new FileUploader(...converted).upload();
      if (uploaded.length === 0) throw APIError.server(StatusCodes.INTERNAL_SERVER_ERROR, "Can't upload your image");

      newImage = uploaded[0]!;
    }

    await store.update({ name, image: newImage });
    res.status(StatusCodes.OK).json({ success: true });
  },
  async delete(_: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { store } = res.locals;
    if (store === null)
      throw APIError.server(StatusCodes.INTERNAL_SERVER_ERROR, "Unprovided local store (seller:update)");

    res.status(StatusCodes.OK).json({ success: true });
  },
  categories,
  products,
} as const;
