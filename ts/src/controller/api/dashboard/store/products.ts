import type { Request, Response } from "express";
import type { TResponse } from "../../../../types/index.js";
import { QueryTypes } from "sequelize";
import { StatusCodes } from "http-status-codes";
import { schema } from "../../../../schema/index.js";
import { model } from "../../../../model/index.js";
import { APIError } from "../../../../error/index.js";
import { lib } from "../../../../lib/index.js";

const { Create, Delete } = schema.req.api.dashboard.store.products;

export default {
  async all(_req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
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
    const { models = [], images = [] } = files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const converted = await new FileConverter(
      ...models.map((model) => model.buffer),
      ...images.map((image) => image.buffer),
    ).convert();
    if (converted.length === 0) throw APIError.controller(StatusCodes.UNSUPPORTED_MEDIA_TYPE, "Invalid provided files");

    const uploaded = await new FileUploader(...converted).upload();
    if (uploaded.length === 0) throw APIError.server(StatusCodes.INTERNAL_SERVER_ERROR, "Can't save your files");

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
        model: uploaded.find((file) => file.endsWith(".glb")),
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

    const infosArr = infos
      .split(",")
      .map((info) => info.trim())
      .filter((info) => info.length > 0);
    if (infosArr.length % 2 !== 0)
      throw APIError.controller(StatusCodes.BAD_REQUEST, "Please provide both the english and arabic version in infos");

    const sizesArr = sizes
      .split(",")
      .map((size) => size.trim())
      .filter((size) => size.length > 0);

    const tagsArr = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const colorsArr = colors
      .split(",")
      .map((color) => color.trim())
      .filter((color) => color.length > 0);

    const { store } = res.locals;
    const tagsId = await Promise.all(
      tagsArr.map((tag) =>
        Tag.findOrCreate({
          attributes: ["id"],
          where: { tag },
          fields: ["tag", "storeId"],
          defaults: { tag, storeId: store!.dataValues.id },
        }),
      ),
    );

    const createInfos = [];
    for (let i = 0; i < infosArr.length; i += 2) {
      const info = infosArr[i]!;
      const infoAr = infosArr[i + 1]!;

      createInfos.push(
        ProductInfo.create(
          { info, infoAr, productId: product.dataValues.id },
          { fields: ["info", "infoAr", "productId"] },
        ),
      );
    }

    const uploadedImages = uploaded.filter((upload) => upload.endsWith(".webp"));

    await Promise.all([
      ...createInfos,
      ProductColor.bulkCreate(
        colorsArr.map((color) => ({ color, productId: product.dataValues.id })),
        { fields: ["color", "productId"] },
      ),
      ProductImage.bulkCreate(
        uploadedImages.map((image) => ({ image, productId: product.dataValues.id })),
        { fields: ["image", "productId"] },
      ),
      ProductSize.bulkCreate(
        sizesArr.map((size) => ({ size, productId: product.dataValues.id })),
        { fields: ["size", "productId"] },
      ),
      ProductTag.bulkCreate(
        tagsId.map(([tagId]) => ({ tagId: tagId.dataValues.id, productId: product.dataValues.id })),
        { fields: ["tagId", "productId"] },
      ),
    ]);

    res.status(StatusCodes.OK).json({ success: true });
  },
  async update(_req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
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
