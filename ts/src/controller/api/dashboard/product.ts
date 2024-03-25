import type { Request, Response } from "express";
import type { TResponse } from "../../../types/index.js";
import { QueryTypes } from "sequelize";
import { StatusCodes } from "http-status-codes";
import { schema } from "../../../schema/index.js";
import { model } from "../../../model/index.js";
import { APIError } from "../../../error/index.js";
import { lib } from "../../../lib/index.js";

const { Create, Update, Delete } = schema.req.api.dashboard.product;

export default {
  async all(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    res.status(StatusCodes.OK).json({ success: true });
  },
  async product(_req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { product } = res.locals;

    const p = await sequelize.query(``, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: true,
      plain: true,
      bind: {
        id: product!.dataValues.id,
      },
    });

    res.status(StatusCodes.OK).json({ success: true, data: { product: p } });
  },
  async create(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const files = req.files;
    if (files === undefined) throw APIError.controller(StatusCodes.BAD_REQUEST, "Please, provide images");

    const { FileConverter, FileUploader } = lib.file;
    const { model: model3D, images } = files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const converted = await new FileConverter().convert();

    const uploaded = await new FileUploader(...converted).upload();

    const { Body } = Create;
    const {
      title,
      titleAr,
      description,
      descriptionAr,
      quality,
      stock,
      price,
      discount,
      categoryId,
      infos,
      tags,
      sizes,
      colors,
    } = Body.parse(req.body);

    const { Product, ProductColor, ProductImage, ProductSize, ProductInfo, ProductTag, Tag } = model.db;

    const product = await Product.create(
      {
        title,
        titleAr,
        description,
        descriptionAr,
        quality,
        stock,
        price,
        discount,
        categoryId,
        model: null,
      },
      {
        fields: [
          "title",
          "titleAr",
          "description",
          "descriptionAr",
          "quality",
          "stock",
          "price",
          "discount",
          "categoryId",
          "model",
        ],
        returning: true,
      },
    );

    const { store } = res.locals;
    const tagsId = await Promise.all(
      tags.map((tag) =>
        Tag.findOrCreate({
          attributes: ["id"],
          where: { tag },
          fields: ["tag", "storeId"],
          defaults: { tag, storeId: store!.dataValues.id },
        }),
      ),
    );

    const createColors = colors.map((color) =>
      ProductColor.create({ color, productId: product.dataValues.id }, { fields: ["color", "productId"] }),
    );
    const createTags = tagsId.map(([tag, _created]) =>
      ProductTag.create(
        { tagId: tag.dataValues.id, productId: product.dataValues.id },
        { fields: ["productId", "tagId"] },
      ),
    );
    const createInfos = infos.map(({ info, infoAr }) =>
      ProductInfo.create(
        { info, infoAr, productId: product.dataValues.id },
        { fields: ["info", "infoAr", "productId"] },
      ),
    );
    const createSizes = sizes.map((size) =>
      ProductSize.create({ size, productId: product.dataValues.id }, { fields: ["size", "productId"] }),
    );

    res.status(StatusCodes.OK).json({ success: true });
  },
  async update(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    res.status(StatusCodes.OK).json({ success: true });
  },
  async delete(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Query } = Delete;
    const { force } = Query.parse(req.query);
    const { product } = res.locals;

    await product!.destroy({ force });
    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
