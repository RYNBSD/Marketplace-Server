import type { Request, Response } from "express";
import type { TResponse } from "../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../../error/index.js";
import { model } from "../../model/index.js";
import { schema } from "../../schema/index.js";
import { lib } from "../../lib/index.js";

const { Setting, BecomeSeller, Update, Delete } = schema.req.api.user;

export default {
  async profile(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>
  ) {
    const { user } = req;
    const { UserSetting, Store } = model.db;

    const setting = await UserSetting.findOne({
      attributes: ["theme", "locale", "forceTheme", "disableAnimations"],
      where: { userId: user!.dataValues.id },
      plain: true,
      limit: 1,
    });
    const store = await Store.findOne({
      attributes: ["id", "name", "image"],
      where: { userId: user!.dataValues.id },
      plain: true,
      limit: 1,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user: user!.dataValues,
        setting: setting!.dataValues,
        store: store?.dataValues ?? null,
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
  async setting(req: Request, res: Response<TResponse["Body"]["Success"]>) {
    const { Body } = Setting;
    const { user } = req;

    const { theme, locale, disableAnimations, forceTheme } = Body.parse(
      req.body
    );
    const { UserSetting } = model.db;

    const [_, setting] = await UserSetting.update(
      { theme, locale, disableAnimations, forceTheme },
      {
        where: { userId: user!.dataValues.id },
        fields: ["theme", "locale", "forceTheme", "disableAnimations"],
        returning: true,
        limit: 1,
      }
    );

    res
      .status(StatusCodes.OK)
      .json({ success: true, data: { setting: setting[0]!.dataValues } });
  },
  async becomeSeller(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>
  ) {
    const { Body } = BecomeSeller;
    const { name, theme } = Body.parse(req.body);

    const { Store } = model.db;

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

    const image = req.file;
    if (image === undefined || image.buffer.length === 0)
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
    const { StoreSetting } = model.db;

    const store = await Store.create(
      {
        name,
        image: uploaded[0]!,
        userId: user!.dataValues.id,
      },
      { fields: ["name", "image", "userId"] }
    );
    const setting = await StoreSetting.create(
      {
        theme,
        storeId: store.dataValues.id,
      },
      { fields: ["theme", "storeId"] }
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        store: store.dataValues,
        setting: setting.dataValues,
      },
    });
  },
  async update(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>
  ) {
    const { user } = req;
    const { Body } = Update;
    const { username } = Body.parse(req.body);

    const image = req.file;
    let newImage = "";
    if (image !== undefined && image.buffer.length > 0) {
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

      await FileUploader.remove(user!.dataValues.image);
      newImage = uploaded[0]!;
    }

    await user!.update({ username, image: newImage || user!.dataValues.image });
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user: user!.dataValues,
      },
    });
  },
  async delete(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>
  ) {
    const { user } = req;
    const { Query } = Delete;
    const { force = false } = Query.parse(req.query);

    const { Store } = model.db;
    const store = await Store.findOne({
      attributes: ["userId", "id"],
      where: { userId: user!.dataValues.id },
      plain: true,
      limit: 1,
    });

    const deletePromises: Promise<unknown>[] = [];

    if (store !== null) {
      const { Category, Product } = model.db;

      const categoryIds = await Category.findAll({
        attributes: ["id"],
        where: { storeId: store.dataValues.id },
      });

      const products = Product.destroy({
        force,
        where: {
          categoryId: categoryIds.map((category) => category.dataValues.id),
        },
      });
      deletePromises.push(products);

      const category = Category.destroy({
        force,
        where: { storeId: store.dataValues.id },
      });
      deletePromises.push(category);
      deletePromises.push(store.destroy({ force }));
    }
    deletePromises.push(user!.destroy({ force }));

    await Promise.all(deletePromises);
    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
