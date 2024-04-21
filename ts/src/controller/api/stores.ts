import type { NextFunction, Request, Response } from "express";
import type { TResponse } from "../../types/index.js";
import { Op, type Transaction } from "sequelize";
// import Fuse, { type IFuseOptions } from "fuse.js";
import { StatusCodes } from "http-status-codes";
import { schema } from "../../schema/index.js";
import { model } from "../../model/index.js";
import { KEYS } from "../../constant/index.js";
import { service } from "../../service/index.js";

const { Search, Home } = schema.req.api.store;
const { DB } = KEYS;

export default {
  async search(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Query } = Search;
    const { s, limit } = Query.parse(req.query);
    const { Store, Category, Product, ProductImage } = model.db;

    const keys = s
      .split(/\s+/)
      .filter((s) => /^[a-zA-Z0-9،-٩]+$/.test(s))
      .map((s) => ({ [Op.iLike]: `%${s}%` }));

    const [products, categories, stores] = await Promise.all([
      Product.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
        where: {
          [Op.or]: [
            ...keys.map((key) => ({ title: key })),
            ...keys.map((key) => ({ titleAr: key })),
            ...keys.map((key) => ({ description: key })),
            ...keys.map((key) => ({ descriptionAr: key })),
          ],
        },
        include: [
          {
            as: DB.MODELS.PRODUCT.IMAGE,
            attributes: ["image"],
            model: ProductImage,
            required: true,
            limit: 1,
          },
          {
            as: DB.MODELS.CATEGORY.MODEL,
            attributes: ["storeId"],
            model: Category,
            required: true,
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
      }),
      Category.findAll({
        attributes: ["id", "name", "nameAr", "image", "storeId"],
        where: {
          [Op.or]: [...keys.map((key) => ({ nameAr: key })), ...keys.map((key) => ({ name: key }))],
        },
        order: [["createdAt", "DESC"]],
        raw: true,
        limit,
      }),
      Store.findAll({
        attributes: ["id", "image", "name"],
        where: { [Op.or]: keys.map((key) => ({ name: key })) },
        order: [["createdAt", "DESC"]],
        raw: true,
        limit,
      }),
    ]);

    //   const fuseOptions: IFuseOptions<any> = {
    //     // The list of keys to search in the data
    //     keys: ["name", "nameAr", "title", "titleAr", "description", "descriptionAr"],
    //     // Should search queries be sorted
    //     shouldSort: true,
    //     // Search in a specific threshold
    //     threshold: 0.4,
    //     // Minimum number of characters before starting a search
    //     minMatchCharLength: 2,
    //     // Determine the number of search results returned
    //     includeScore: true,
    //     // Use extended search in the pattern (allows the use of wildcards)
    //     useExtendedSearch: true,
    //     // The location where the matched keys will be stored in each result item
    //     includeMatches: true,
    //     // Whether to ignore special characters
    //     ignoreLocation: true,
    // };
    //   const [] = new Fuse()

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        stores,
        categories,
        products: products.map((product) => {
          const { dataValues } = product;

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dataValues.image = dataValues[DB.MODELS.PRODUCT.IMAGE][0].dataValues.image;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete dataValues[DB.MODELS.PRODUCT.IMAGE];

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dataValues.storeId = dataValues[DB.MODELS.CATEGORY.MODEL].dataValues.storeId;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete dataValues[DB.MODELS.CATEGORY.MODEL];

          return dataValues;
        }),
      },
    });
  },
  async all(_req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Store } = model.db;
    const stores = await Store.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      // limit: 25,
      raw: true,
      order: [["createdAt", "DESC"]],
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: { stores },
    });
  },
  async categories(_req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Category } = model.db;
    const categories = await Category.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      // limit: 25,
      raw: true,
      order: [["createdAr", "DESC"]],
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        categories,
      },
    });
  },
  async products(_req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Product, ProductImage } = model.db;
    const products = await Product.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      include: {
        as: DB.MODELS.PRODUCT.IMAGE,
        attributes: ["image"],
        model: ProductImage,
        required: true,
        limit: 1,
      },
      order: [["createdAt", "DESC"]],
      // limit: 25,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        products: products.map((product) => {
          const { dataValues } = product;

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dataValues.image = dataValues[DB.MODELS.PRODUCT.IMAGE][0].image;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete dataValues[DB.MODELS.PRODUCT.IMAGE];
          return dataValues;
        }),
      },
    });
  },
  async store(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const { Params } = Home;
    const { storeId } = Params.parse(req.params);

    const { user } = req;
    const { StoreViewer } = model.db;
    await StoreViewer.create(
      { ip: req.clientIp, userId: user?.dataValues.id, storeId },
      { fields: ["ip", "userId", "storeId"], transaction },
    );

    const store = res.locals.store!;
    const { Category, Product, ProductImage } = model.db;

    const categories = await Category.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      order: [["createdAt", "DESC"]],
      where: { storeId: store.dataValues.id },
    });

    const categoriesId = categories.map((category) => category.dataValues.id);

    const products = await Product.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: {
        categoryId: categoriesId,
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          as: DB.MODELS.PRODUCT.IMAGE,
          attributes: ["image"],
          model: ProductImage,
          required: true,
          limit: 1,
        },
        {
          as: DB.MODELS.CATEGORY.MODEL,
          attributes: ["storeId"],
          model: Category,
          required: true,
        },
      ],
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        store: store.dataValues,
        categories: categories.map((category) => category.dataValues),
        products: products.map((product) => {
          const { dataValues } = product;

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dataValues.image = dataValues[DB.MODELS.PRODUCT.IMAGE][0].dataValues.image;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete dataValues[DB.MODELS.PRODUCT.IMAGE];

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dataValues.storeId = dataValues[DB.MODELS.CATEGORY.MODEL].dataValues.storeId;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete dataValues[DB.MODELS.CATEGORY.MODEL];

          return dataValues;
        }),
      },
    });
  },
  async category(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const category = res.locals.category!;
    const { user } = req;
    const { CategoryViewer, Product, ProductImage, Category } = model.db;
    await CategoryViewer.create(
      { ip: req.clientIp, userId: user?.dataValues.id, categoryId: category.dataValues.id },
      { fields: ["ip", "userId", "categoryId"], transaction },
    );

    const products = await Product.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      where: { categoryId: category.dataValues.id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          as: DB.MODELS.PRODUCT.IMAGE,
          attributes: ["image"],
          model: ProductImage,
          required: true,
          limit: 1,
        },
        {
          as: DB.MODELS.CATEGORY.MODEL,
          attributes: ["storeId"],
          model: Category,
          required: true,
        },
      ],
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        category: category.dataValues,
        products: products.map((product) => {
          const { dataValues } = product;

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dataValues.image = dataValues[DB.MODELS.PRODUCT.IMAGE][0].dataValues.image;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete dataValues[DB.MODELS.PRODUCT.IMAGE];

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dataValues.storeId = dataValues[DB.MODELS.CATEGORY.MODEL].dataValues.storeId;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete dataValues[DB.MODELS.CATEGORY.MODEL];

          return dataValues;
        }),
      },
    });
  },
  async product(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>,
    _next: NextFunction,
    transaction: Transaction,
  ) {
    const localProduct = res.locals.product!;
    const { user } = req;
    const { ProductViewer } = model.db;
    await ProductViewer.create(
      { ip: req.clientIp, userId: user?.dataValues.id, productId: localProduct!.dataValues.id },
      { fields: ["ip", "userId", "productId"], transaction },
    );

    const product = await service.product.one(localProduct.dataValues.id);
    res.status(StatusCodes.OK).json({ success: true, data: { product } });
  },
} as const;
