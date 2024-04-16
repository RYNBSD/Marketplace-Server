import type { Request, Response } from "express";
import type { TResponse } from "../../types/index.js";
import { Op } from "sequelize";
// import Fuse, { type IFuseOptions } from "fuse.js";
import { StatusCodes } from "http-status-codes";
import { schema } from "../../schema/index.js";
import { model } from "../../model/index.js";
import { KEYS, VALUES } from "../../constant/index.js";
import { service } from "../../service/index.js";

const { Search, Categories, Products, Home } = schema.req.api.store;
const { DB } = KEYS;
const { LENGTH } = VALUES;

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
        attributes: ["id", "title", "titleAr", "description", "descriptionAr"],
        where: {
          [Op.or]: [
            ...keys.map((key) => ({ title: key })),
            ...keys.map((key) => ({ titleAr: key })),
            ...keys.map((key) => ({ description: key })),
            ...keys.map((key) => ({ descriptionAr: key })),
          ],
        },
        include: {
          as: DB.MODELS.PRODUCT.IMAGE,
          attributes: ["image"],
          model: ProductImage,
          required: true,
          limit: 1,
        },
        order: [["createdAt", "DESC"]],
        limit,
      }),
      Category.findAll({
        attributes: ["id", "name", "nameAr", "image"],
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
          dataValues.image = dataValues[DB.MODELS.PRODUCT.IMAGE][0].image;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete dataValues[DB.MODELS.PRODUCT.IMAGE];
          return dataValues;
        }),
      },
    });
  },
  async all(_req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { store } = service;
    const stores = await store.all();

    res.status(StatusCodes.OK).json({
      success: true,
      data: { stores },
    });
  },
  async categories(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Query } = Categories;
    const { storeId } = Query.parse(req.query);

    const { category } = service;
    const categories = await category.all(storeId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        categories,
      },
    });
  },
  async products(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Query } = Products;
    const { storeId, categoryId } = Query.parse(req.query);

    const { product } = service;
    const products = await product.all({ storeId, categoryId });

    res.status(StatusCodes.OK).json({ success: true, data: { products } });
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

    // TODO: use services instande of model.query
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
