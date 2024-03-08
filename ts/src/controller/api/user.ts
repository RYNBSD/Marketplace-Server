import type { Request, Response } from "express";
import type { TResponse } from "../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../../error/index.js";
import { model } from "../../model/index.js";
import { schema } from "../../schema/index.js";
import { lib } from "../../lib/index.js";

const { BecomeSeller, Update, Delete } = schema.req.api.user;

export default {
  async profile(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]["User"]>
  ) {
    const { user } = res.locals;
    const { UserSettings, Seller } = model.db;

    const setting = await UserSettings.findOne({
      attributes: ["theme", "locale", "forceTheme", "disableAnimations"],
      where: { userId: user.dataValues.id },
      limit: 1,
      plain: true,
    });
    if (setting === null)
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "User has not initial setting"
      );

    const seller = await Seller.findOne({
      attributes: ["id", "storeName", "image"],
      where: { userId: user.dataValues.id },
      limit: 1,
      plain: true,
    });
    if (seller !== null)
      req.session.user!.seller = { id: seller.dataValues.id };

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user: {
          ...user.dataValues,
          setting: setting.dataValues,
          seller: seller?.dataValues ?? null,
        },
      },
    });
  },
  async orders(req: Request, res: Response<TResponse["Body"]["Success"]>) {
    req;
    res.status(StatusCodes.OK).json({ success: true });
  },
  async order(req: Request, res: Response<TResponse["Body"]["Success"]>) {
    req;
    res.status(StatusCodes.OK).json({ success: true });
  },
  async becomeSeller(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]["User"]>
  ) {
    const { Body } = BecomeSeller;
    const { storeName, theme } = Body.parse(req.body);

    const image = req.file ?? null;
    if (image === null)
      throw APIError.controller(
        StatusCodes.BAD_REQUEST,
        "Please, provide a logo for your store"
      );

    const { FileConverter, FileUploader } = lib.file;
    const converted = await new FileConverter(image.buffer).convert();
    if (converted.length === 0)
      throw APIError.controller(
        StatusCodes.UNSUPPORTED_MEDIA_TYPE,
        "Invalid image format"
      );

    const uploaded = await new FileUploader().upload();
    if (uploaded.length === 0)
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Can't upload your image"
      );

    const { user } = res.locals;
    const { Seller, SellerSettings } = model.db;
    const seller = await Seller.create({
      storeName,
      image: uploaded[0]!,
      userId: user.dataValues.id,
    });
    const setting = await SellerSettings.create({
      theme,
      sellerId: seller.dataValues.id,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        seller: {
          ...seller.dataValues,
          setting: setting.dataValues,
        },
      },
    });
  },
  async update(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]["User"]>
  ) {
    const { Body } = Update;
    const { username, theme, locale, forceTheme, disableAnimations } =
      Body.parse(req.body);

    const image = req.file ?? null;
    let newImage = "";
    if (image !== null) {
      const { FileConverter, FileUploader } = lib.file;
      const converted = await new FileConverter(image.buffer).convert();
      if (converted.length === 0)
        throw APIError.controller(
          StatusCodes.UNSUPPORTED_MEDIA_TYPE,
          "Please, provide a valid image"
        );

      const uploaded = await new FileUploader(...converted).upload();
      if (uploaded.length === 0)
        throw APIError.server(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Can't upload your image"
        );

      newImage = uploaded[0]!;
    }

    const { UserSettings } = model.db;
    const { user } = res.locals;
    await Promise.all([
      user.update({ username, image: newImage || user.dataValues.image }),
      UserSettings.update(
        { theme, locale, forceTheme, disableAnimations },
        { where: { userId: user.dataValues.id } }
      ),
    ]);

    res.status(StatusCodes.OK).json({ success: true });
  },
  async delete(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]["User"]>
  ) {
    const { Query } = Delete;
    const { force = false } = Query.parse(req.query);

    const { user, seller } = res.locals;
    const deletePromises: Promise<unknown>[] = [];

    if (seller !== null) {
      const { Category, Product } = model.db;

      const categoryIds = await Category.findAll({
        attributes: ["id"],
        where: { sellerId: seller.dataValues.id },
      });
      const products = categoryIds.map((category) =>
        Product.destroy({
          force,
          where: { categoryId: category.dataValues.id },
        })
      );
      deletePromises.concat(products);

      const category = Category.destroy({
        force,
        where: { sellerId: seller.dataValues.id },
      });
      deletePromises.push(category);
      deletePromises.push(seller.destroy({ force }));
    }
    deletePromises.push(user.destroy({ force }));

    await Promise.all(deletePromises);
    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
