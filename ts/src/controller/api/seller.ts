import type { Request, Response } from "express";
import type { TResponse } from "../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { schema } from "../../schema/index.js";
import { APIError } from "../../error/index.js";
import { model } from "../../model/index.js";
import { lib } from "../../lib/index.js";

const { All, Profile, Category, Product, Update } = schema.req.api.seller;

export default {
  async all(
    req: Request,
    res: Response<TResponse["Body"]["Success"], Partial<TResponse["Locals"]["User"]>>
  ) {
    const { Query } = All;
    const { lastSellerId = "", limit = 25 } = Query.parse(req.query);

    res.status(StatusCodes.OK).json({ success: true });
  },
  async profile(
    req: Request,
    res: Response<TResponse["Body"]["Success"], Partial<TResponse["Locals"]["User"]>>
  ) {
    const { Params } = Profile;
    const { sellerId } = Params.parse(req.params);
    res.status(StatusCodes.OK).json({ success: true });
  },
  async category(
    req: Request,
    res: Response<TResponse["Body"]["Success"], Partial<TResponse["Locals"]["User"]>>
  ) {
    const { Params } = Category;
    const { sellerId, categoryId } = Params.parse(req.params);

    res.status(StatusCodes.OK).json({ success: true });
  },
  async product(
    req: Request,
    res: Response<TResponse["Body"]["Success"], Partial<TResponse["Locals"]["User"]>>
  ) {
    const { Params } = Product;
    const { sellerId, categoryId, productId } = Params.parse(req.params);

    res.status(StatusCodes.OK).json({ success: true });
  },
  async update(
    req: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]["User"]>
  ) {
    const { Body } = Update;
    const { storeName } = Body.parse(req.body);

    const { seller } = res.locals;
    if (seller === null)
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unprovided local seller (seller:update)"
      );

    let newImage = seller.dataValues.image;
    const image = req.file ?? null;

    if (image !== null) {
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

      newImage = uploaded[0]!;
    }

    await seller.update({ storeName, image: newImage });
    res.status(StatusCodes.OK).json({ success: true });
  },
  async delete(
    _: Request,
    res: Response<TResponse["Body"]["Success"], TResponse["Locals"]["User"]>
  ) {
    const { seller } = res.locals;
    if (seller === null)
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unprovided local seller (seller:update)"
      );

    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
