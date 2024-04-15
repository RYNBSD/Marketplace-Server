import type { NextFunction, Request, Response } from "express";
import type { Transaction } from "sequelize";
import type { TResponse } from "../../../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { model } from "../../../../model/index.js";
import { APIError } from "../../../../error/index.js";
import { lib } from "../../../../lib/index.js";
import { schema } from "../../../../schema/index.js";
import { service } from "../../../../service/index.js";

const { /* All, */ Create, Update } = schema.req.api.dashboard.store.categories;
const { category } = service;

export default {
  async all(_req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const store = res.locals.store!;
    // const { Query } = All;
    // const { page, limit } = Query.parse(req.query);

    // const { Category } = model.db;

    // const categories = await Category.findAll({
    //   attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    //   where: { storeId: store!.dataValues.id },
    //   offset: (page - 1) * limit,
    //   limit,
    //   order: [["createdAt", "DESC"]],
    // });

    const categories = await category.all(store.dataValues.id);
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        categories,
      },
    });
  },
  async category(_req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const localCategory = res.locals.category!;
    const [products, one] = await Promise.all([
      category.products(localCategory.dataValues.id),
      category.one(localCategory.dataValues.id),
    ]);
    res.status(StatusCodes.OK).json({ success: true, data: { category: one, products } });
  },
  async create(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { Body } = Create;
    const { name, nameAr } = Body.parse(req.body);

    const image = req.file;
    if (image === undefined || image.buffer.length === 0)
      throw APIError.controller(StatusCodes.BAD_REQUEST, "Please, provide a valid image");

    const { FileConverter, FileUploader } = lib.file;
    const converted = await new FileConverter(image.buffer).convert();
    if (converted.length === 0) throw APIError.controller(StatusCodes.UNSUPPORTED_MEDIA_TYPE, "Invalid image");

    const uploaded = await new FileUploader(...converted).upload();
    if (uploaded.length === 0) throw APIError.controller(StatusCodes.INTERNAL_SERVER_ERROR, "Can't save image");

    const { store } = res.locals;
    const { Category } = model.db;

    const category = await Category.create(
      { image: uploaded[0]!, name, nameAr, storeId: store!.dataValues.id },
      { fields: ["image", "name", "nameAr", "storeId"], returning: true, transaction },
    );

    res.status(StatusCodes.CREATED).json({ success: true, data: { category: category.dataValues } });
  },
  async update(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { Body } = Update;
    const { name, nameAr } = Body.parse(req.body);

    const { category } = res.locals;
    const image = req.file;
    let newImage = category!.dataValues.image;

    if (image !== undefined && image.buffer.length > 0) {
      const { FileConverter, FileUploader } = lib.file;

      const converted = await new FileConverter(image.buffer).convert();
      if (converted.length === 0)
        throw APIError.controller(StatusCodes.UNSUPPORTED_MEDIA_TYPE, "Please, provide a valid image");

      const uploaded = await new FileUploader(...converted).upload();
      if (uploaded.length === 0) throw APIError.controller(StatusCodes.INTERNAL_SERVER_ERROR, "Can't save image");

      newImage = uploaded[0]!;
    }

    await category!.update({ name, nameAr, image: newImage }, { fields: ["name", "nameAr", "image"], transaction });
    res.status(StatusCodes.OK).json({ success: true, data: { category: category!.dataValues } });
  },
  async delete(
    _req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const category = res.locals.category!;
    await category.destroy({ force: false, transaction });
    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
