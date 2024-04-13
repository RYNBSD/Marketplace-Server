import type { Request, Response, NextFunction } from "express";
import type { TResponse } from "../../../../types/index.js";
import { QueryTypes, type Transaction } from "sequelize";
import { StatusCodes } from "http-status-codes";
import { schema } from "../../../../schema/index.js";
import { model } from "../../../../model/index.js";
import { APIError } from "../../../../error/index.js";
import { lib } from "../../../../lib/index.js";
import { service } from "../../../../service/index.js";

const { product } = service;
const { Create, Delete } = schema.req.api.dashboard.store.products;

export default {
  async all(_req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const store = res.locals.store!;
    const { Category } = model.db;

    const categories = await Category.findAll({
      attributes: ["id"],
      where: { storeId: store.dataValues.id },
    });

    const categoriesId = categories.map((category) => category.dataValues.id);
    const products = await Promise.all(categoriesId.map((id) => product.all(id)));

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        products: [].concat(...products),
      },
    });
  },
  async product(_req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const product = res.locals.product!;

    const p = await sequelize.query(``, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: true,
      plain: true,
      bind: {
        id: product.dataValues.id,
      },
    });

    res.status(StatusCodes.OK).json({ success: true, data: { product: p } });
  },
  async create(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
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
        transaction,
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
          transaction,
        }),
      ),
    );

    const createInfos = [];
    for (let i = 0; i < infosArr.length; i += 2) {
      const info = infosArr[i]!;
      const infoAr = infosArr[i + 1]!;

      createInfos.push({ info, infoAr, productId: product.dataValues.id });
    }

    const uploadedImages = uploaded.filter((upload) => upload.endsWith(".webp"));
    const createImagesPromises = uploadedImages.map((image) =>
      ProductImage.create(
        { image, productId: product.dataValues.id },
        { fields: ["image", "productId"], transaction },
      ).catch((e) => {
        throw APIError.server(StatusCodes.INTERNAL_SERVER_ERROR, e?.message ?? "Can't save image", { files: uploaded });
      }),
    );

    await Promise.all([
      ProductInfo.bulkCreate(createInfos, { fields: ["info", "infoAr", "productId"], transaction }),
      ProductColor.bulkCreate(
        colorsArr.map((color) => ({ color, productId: product.dataValues.id })),
        { fields: ["color", "productId"], transaction },
      ),
      ProductSize.bulkCreate(
        sizesArr.map((size) => ({ size, productId: product.dataValues.id })),
        { fields: ["size", "productId"], transaction },
      ),
      ProductTag.bulkCreate(
        tagsId.map(([tagId]) => ({ tagId: tagId.dataValues.id, productId: product.dataValues.id })),
        { fields: ["tagId", "productId"], transaction },
      ),
      ...createImagesPromises,
    ]);

    res.status(StatusCodes.CREATED).json({ success: true });
  },
  async update(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const product = res.locals.product!;

    const { FileConverter, FileUploader } = lib.file;
    const { models = [], images = [] } = req.files as Partial<{
      [fieldname: string]: Express.Multer.File[];
    }>;

    const converted = await new FileConverter(
      ...models.map((model) => model.buffer),
      ...images.map((image) => image.buffer),
    ).convert();
    if (converted.length === 0 && models.length > 0 && images.length > 0)
      throw APIError.controller(StatusCodes.UNSUPPORTED_MEDIA_TYPE, "Invalid provided files");

    const uploaded = await new FileUploader(...converted).upload();
    if (uploaded.length === 0 && converted.length > 0)
      throw APIError.server(StatusCodes.INTERNAL_SERVER_ERROR, "Can't save your files");

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

    const { ProductColor, ProductImage, ProductSize, ProductInfo, ProductTag, Tag } = model.db;

    product.update(
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
        model: uploaded.find((file) => file.endsWith(".glb")) ?? product.dataValues.model,
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
        transaction,
      },
    );

    await Promise.all([
      ProductInfo.destroy({ force: false, where: { productId: product.dataValues.id }, transaction }),
      ProductColor.destroy({ force: false, where: { productId: product.dataValues.id }, transaction }),
      ProductImage.destroy({ force: false, where: { productId: product.dataValues.id }, transaction }),
      ProductSize.destroy({ force: false, where: { productId: product.dataValues.id }, transaction }),
      ProductTag.destroy({ force: false, where: { productId: product.dataValues.id }, transaction }),
    ]);

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
          transaction,
        }),
      ),
    );

    const createInfos = [];
    for (let i = 0; i < infosArr.length; i += 2) {
      const info = infosArr[i]!;
      const infoAr = infosArr[i + 1]!;

      createInfos.push({ info, infoAr, productId: product.dataValues.id });
    }

    const uploadedImages = uploaded.filter((upload) => upload.endsWith(".webp"));

    await Promise.all([
      ProductInfo.bulkCreate(createInfos, { fields: ["info", "infoAr", "productId"], transaction }),
      ProductColor.bulkCreate(
        colorsArr.map((color) => ({ color, productId: product.dataValues.id })),
        { fields: ["color", "productId"], transaction },
      ),
      ProductSize.bulkCreate(
        sizesArr.map((size) => ({ size, productId: product.dataValues.id })),
        { fields: ["size", "productId"], transaction },
      ),
      ProductTag.bulkCreate(
        tagsId.map(([tagId]) => ({ tagId: tagId.dataValues.id, productId: product.dataValues.id })),
        { fields: ["tagId", "productId"], transaction },
      ),
      ProductImage.bulkCreate(
        uploadedImages.map((image) => ({ image, productId: product.dataValues.id })),
        { fields: ["image", "productId"], transaction },
      ).catch((e) => {
        throw APIError.server(StatusCodes.INTERNAL_SERVER_ERROR, e?.message ?? "Can't save images", {
          files: uploaded,
        });
      }),
    ]);

    res.status(StatusCodes.OK).json({ success: true });
  },
  async delete(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { Query } = Delete;
    const { force } = Query.parse(req.query);
    const product = res.locals.product!;

    await product.destroy({ force, transaction });
    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
