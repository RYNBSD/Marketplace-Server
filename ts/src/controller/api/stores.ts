import type { Request, Response } from "express";
import type { TResponse } from "../../types/index.js";
import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";
import { schema } from "../../schema/index.js";
import { model } from "../../model/index.js";
import { KEYS, VALUES } from "../../constant/index.js";

const { Search, Stores, Categories, Products, Home } = schema.req.api.store;
const { DB } = KEYS;
const { NULL, LENGTH } = VALUES;

export default {
  async search(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Query } = Search;
    const { s, limit } = Query.parse(req.query);
    const { Store, Category, Product } = model.db;

    const [sellers, categories, products] = await Promise.all([
      Store.findAll({
        attributes: ["id", "image", "name"],
        where: { name: { [Op.iLike]: `%${s}%` } },
        order: ["createdAt", "DESC"],
        limit,
      }),
      Category.findAll({
        attributes: ["id", "name", "nameAr", "image"],
        where: {
          [Op.or]: {
            nameAr: { [Op.iLike]: `%${s}%` },
            name: { [Op.iLike]: `%${s}%` },
          },
        },
        order: ["createdAt", "DESC"],
        limit,
      }),
      Product.findAll({
        attributes: ["id", "title", "titleAr", "description", "descriptionAr"],
        where: {
          [Op.or]: {
            title: { [Op.iLike]: `%${s}%` },
            titleAr: { [Op.iLike]: `%${s}%` },
            description: { [Op.iLike]: `%${s}%` },
            descriptionAr: { [Op.iLike]: `%${s}%` },
          },
        },
        order: ["createdAt", "DESC"],
        limit,
      }),
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        sellers: sellers.map((seller) => seller.dataValues),
        categories: categories.map((category) => category.dataValues),
        products: products.map((product) => product.dataValues),
      },
    });
  },
  async all(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Query } = Stores;
    const { lastStoreId = NULL.UUID, limit } = Query.parse(req.query);

    const {
      db: { Store },
      fn: { tableIndex },
    } = model;
    const { TABLES } = DB;

    const offset = await tableIndex(TABLES.STORE.TABLE, lastStoreId);

    const stores = await Store.findAll({
      attributes: ["id", "image", "name"],
      offset,
      limit,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: { stores: stores.map((store) => store.dataValues) },
    });
  },
  async categories(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Query } = Categories;
    const { storeId } = Query.parse(req.query) ?? { storeId: "" };

    const { Category, Store } = model.db;

    const categories = await Category.findAll({
      attributes: ["id", "image", "name", "nameAr"],
      where: { storeId },
      order: ["createdAt", "DESC"],
      include: {
        attributes: [["id", "storeId"]],
        model: Store,
        separate: true,
        required: true,
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        categories: categories.map((category) => category.dataValues),
      },
    });
  },
  async products(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Query } = Products;
    const q = Query.parse(req.query);

    res.status(StatusCodes.OK).json({ success: true });
  },
  /** Store home page (landing page) */
  async home(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Params } = Home;
    const { storeId } = Params.parse(req.params);

    const { user } = req;
    if (user !== undefined) {
      const { StoreViewer } = model.db;
      await StoreViewer.create({ userId: user.dataValues.id, storeId }, { fields: ["userId", "storeId"] });
    }

    const { store } = res.locals;
    const {
      db: { Product, ProductImage },
      query,
    } = model;

    const categories = await query.category.withProductsCount(store!.dataValues.id);

    const products = await Product.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: {
        [Op.or]: {
          categoryId: categories.map((category) => category.id),
        },
      },
      limit: LENGTH.LIMIT,
      order: ["createdAt", "DESC"],
      include: {
        attributes: ["image"],
        model: ProductImage,
        separate: true,
        required: true,
        limit: 1,
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        store: store!.dataValues,
        categories,
        products: products.map((product) => product.dataValues),
      },
    });
  },
  async category(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { category } = res.locals;

    const { user } = req;
    if (user !== undefined) {
      const { CategoryViewer } = model.db;
      await CategoryViewer.create(
        { userId: user.dataValues.id, categoryId: category!.dataValues.id },
        { fields: ["userId", "categoryId"] },
      );
    }

    const { Product, ProductImage } = model.db;
    const products = await Product.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: { categoryId: category!.dataValues.id },
      order: ["createdAt", "DESC"],
      include: {
        attributes: ["image"],
        model: ProductImage,
        required: true,
        separate: true,
        limit: 1,
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        products: products.map((product) => product.dataValues),
      },
    });
  },
  async product(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { product } = res.locals;
    const { user } = req;
    if (user !== undefined) {
      const { ProductViewer } = model.db;
      await ProductViewer.create(
        { userId: user.dataValues.id, productId: product!.dataValues.id },
        { fields: ["userId", "productId"] },
      );
    }

    const { User, Tag, Product, ProductImage, ProductColor, ProductInfo, ProductRating, ProductSize, ProductTag } =
      model.db;

    const fullProduct = await Product.findOne({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: { id: product!.dataValues.id },
      include: [
        {
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          model: ProductImage,
          separate: true,
          required: true,
        },
        {
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          model: ProductColor,
          separate: true,
          required: false,
        },
        {
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          model: ProductInfo,
          separate: true,
          required: false,
        },
        {
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          model: ProductSize,
          separate: true,
          required: false,
        },
        {
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          model: ProductRating,
          separate: true,
          required: false,
          include: [
            {
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
              model: User,
              separate: true,
              required: true,
            },
          ],
        },
        {
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
          model: ProductTag,
          separate: true,
          required: false,
          include: [
            {
              attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
              model: Tag,
              separate: true,
              required: true,
            },
          ],
        },
      ],
    });

    res.status(StatusCodes.OK).json({ success: true, data: { product: fullProduct!.dataValues } });
  },
} as const;
