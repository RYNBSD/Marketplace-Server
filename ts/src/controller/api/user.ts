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
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>
  ) {
    const { user } = req;
    if (user === undefined)
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unauthenticated user (user:profile)"
      );

    const { UserSetting, Store } = model.db;

    const setting = await UserSetting.findOne({
      attributes: ["theme", "locale", "forceTheme", "disableAnimations"],
      where: { userId: user.dataValues.id },
      limit: 1,
    });
    if (setting === null)
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "User has not initial setting"
      );

    const seller = await Store.findOne({
      attributes: ["id", "name", "image"],
      where: { userId: user.dataValues.id },
      limit: 1,
    });

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
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>
  ) {
    const { Body } = BecomeSeller;
    const { Store } = model.db;

    const { name, theme } = Body.parse(req.body);

    const checkStoreName = await Store.findOne({
      attributes: ["name"],
      where: { name },
      limit: 1,
    });
    if (checkStoreName !== null)
      throw APIError.controller(
        StatusCodes.BAD_REQUEST,
        "Store name already exists"
      );

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

    const uploaded = await new FileUploader(...converted).upload();
    if (uploaded.length === 0)
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Can't upload your image"
      );

    const { user } = req;
    if (user === undefined)
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unauthenticated user (user:become-seller)"
      );

    const { StoreSetting } = model.db;
    const seller = await Store.create(
      {
        name,
        image: uploaded[0]!,
        userId: user.dataValues.id,
      },
      { fields: ["name", "image", "userId"] }
    );
    const setting = await StoreSetting.create(
      {
        theme,
        storeId: seller.dataValues.id,
      },
      { fields: ["theme", "storeId"] }
    );

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
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>
  ) {
    const { user } = req;
    if (user === undefined)
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unauthenticated user (user:update)"
      );

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

      await FileUploader.remove(user.dataValues.image);
      newImage = uploaded[0]!;
    }

    const { UserSetting } = model.db;
    await Promise.all([
      UserSetting.update(
        { theme, locale, forceTheme, disableAnimations },
        {
          fields: ["theme", "locale", "forceTheme", "disableAnimations"],
          where: { userId: user.dataValues.id },
        }
      ),
      user.update({ username, image: newImage || user.dataValues.image }),
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user: {
          ...user.dataValues,
          setting: {
            locale,
            theme,
            disableAnimations,
            forceTheme,
          },
        },
      },
    });
  },
  async delete(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>
  ) {
    const { user } = req;
    if (user === undefined)
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unauthenticated user (user:update)"
      );

    const { Query } = Delete;
    const { force = false } = Query.parse(req.query);

    const { Store } = model.db;
    const seller = await Store.findOne({
      attributes: ["userId"],
      where: { userId: user.dataValues.id },
      plain: true,
      limit: 1,
    });

    const deletePromises: Promise<unknown>[] = [];

    if (seller !== null) {
      const { Category, Product } = model.db;

      const categoryIds = await Category.findAll({
        attributes: ["id"],
        where: { storeId: seller.dataValues.id },
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
        where: { storeId: seller.dataValues.id },
      });
      deletePromises.push(category);
      deletePromises.push(seller.destroy({ force }));
    }
    deletePromises.push(user.destroy({ force }));

    await Promise.all(deletePromises);
    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
