import type { Request, Response } from "express";
import type { TResponse } from "../../../../types/index.js";
import { QueryTypes } from "sequelize";
import { StatusCodes } from "http-status-codes";
import { model } from "../../../../model/index.js";
import { APIError } from "../../../../error/index.js";
import { lib } from "../../../../lib/index.js";
import { schema } from "../../../../schema/index.js";

const { All, Create, Update, Delete } = schema.req.api.dashboard.store.categories;

export default {
  async all(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Query } = All;
    const { page, limit } = Query.parse(req.query);

    const { store } = res.locals;
    const { Category } = model.db;

    const categories = await Category.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: { storeId: store!.dataValues.id },
      offset: (page - 1) * limit,
      limit,
      order: [["createdAt", "DESC"]],
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        categories: categories.map((category) => category.dataValues),
      },
    });
  },
  async category(_req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { category } = res.locals;

    const c = await sequelize.query(``, {
      type: QueryTypes.SELECT,
      raw: true,
      bind: {
        id: category!.dataValues.id,
      },
    });

    res.status(StatusCodes.OK).json({ success: true, data: { c } });
  },
  async create(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
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
      { fields: ["image", "name", "nameAr", "storeId"], returning: true },
    );

    res.status(StatusCodes.CREATED).json({ success: true, data: { category: category.dataValues } });
  },
  async update(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
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

    await category!.update({ name, nameAr, image: newImage });
    res.status(StatusCodes.OK).json({ success: true, data: { category: category!.dataValues } });
  },
  async delete(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Query } = Delete;
    const { force } = Query.parse(req.query);
    const { category } = res.locals;

    const { Product } = model.db;

    await Promise.all([
      Product.destroy({
        where: { categoryId: category!.dataValues.id },
        force,
      }),
      category!.destroy({ force }),
    ]);

    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
