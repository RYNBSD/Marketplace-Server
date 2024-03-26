import type { NextFunction, Request, Response } from "express";
import type { TResponse, Tables } from "../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { serialize } from "cookie";
import { APIError } from "../../error/index.js";
import { schema } from "../../schema/index.js";
import { authenticate } from "../../passport/fn.js";
import { model } from "../../model/index.js";
import { util } from "../../util/index.js";
import { lib } from "../../lib/index.js";
import { KEYS } from "../../constant/index.js";
import { config } from "../../config/index.js";

const { COOKIE } = KEYS;
const { SignUp, VerifyEmail, ForgotPassword } = schema.req.api.auth;

export default {
  async signUp(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Body } = SignUp;
    const { username, email, password, theme, locale } = Body.parse(req.body);

    const { User, UserSetting } = model.db;
    const checkEmail = await User.findOne({
      attributes: ["email"],
      where: { email },
      limit: 1,
      plain: true,
    });
    if (checkEmail !== null) throw APIError.controller(StatusCodes.BAD_REQUEST, "Email already exist");

    const image = req.file;
    if (image === undefined || image.buffer.length === 0)
      throw APIError.controller(StatusCodes.BAD_REQUEST, "Please, provide an image");

    const { FileConverter, FileUploader } = lib.file;
    const converter = await new FileConverter(image.buffer).convert();
    if (converter.length === 0)
      throw APIError.controller(StatusCodes.UNSUPPORTED_MEDIA_TYPE, "Unsupported image format");

    const uploaded = await new FileUploader(...converter).upload();
    if (uploaded.length === 0) throw APIError.server(StatusCodes.INTERNAL_SERVER_ERROR, "Can't upload your image");

    const { hash } = util.bcrypt;

    const user = await User.create(
      {
        username,
        email,
        password: hash(password),
        image: uploaded[0]!,
      },
      { fields: ["username", "email", "password", "image"] },
    );
    await UserSetting.create(
      {
        userId: user.dataValues.id,
        theme,
        locale,
        forceTheme: false,
        disableAnimations: false,
      },
      {
        fields: ["userId", "theme", "locale", "forceTheme", "disableAnimations"],
      },
    );

    res.status(StatusCodes.CREATED).json({ success: true });
  },
  async signIn(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>, next: NextFunction) {
    const user = (await authenticate("local", req, res, next)) as Tables["User"];

    const { sign } = util.jwt;
    const { UserSetting, Store } = model.db;

    const setting = await UserSetting.findOne({
      attributes: {
        exclude: ["userId"],
      },
      where: { userId: user.dataValues.id },
      plain: true,
      limit: 1,
    });

    const store = await Store.findOne({
      attributes: ["id"],
      where: { userId: user.dataValues.id },
      plain: true,
      limit: 1,
    });

    const { cookie } = config;

    res
      .status(StatusCodes.OK)
      .setHeader("Set-Cookie", serialize(COOKIE.AUTHORIZATION, sign(user.dataValues.id), cookie.options))
      .json({
        success: true,
        data: {
          user: user.dataValues,
          setting: setting!.dataValues,
          store: store?.dataValues ?? null,
        },
      });
  },
  async signOut(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    req.logOut((err) => {
      const { toBoolean } = schema.validators;
      if (toBoolean.parse(err)) throw err;

      req.session.csrf = { secret: "" };
      req.session.access = { key: "", iv: "" };
      res.status(StatusCodes.OK).json({ success: true });
    });
  },
  async me(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>, next: NextFunction) {
    const user = (await authenticate("bearer", req, res, next)) as Tables["User"];

    const { sign } = util.jwt;
    const { UserSetting, Store } = model.db;

    const setting = await UserSetting.findOne({
      attributes: {
        exclude: ["userId"],
      },
      where: { userId: user.dataValues.id },
      plain: true,
      limit: 1,
    });

    const store = await Store.findOne({
      attributes: ["id"],
      where: { userId: user.dataValues.id },
      plain: true,
      limit: 1,
    });

    const { cookie } = config;

    res
      .status(StatusCodes.OK)
      .setHeader("Set-Cookie", serialize(COOKIE.AUTHORIZATION, sign(user.dataValues.id), cookie.options))
      .json({
        success: true,
        data: {
          user: user.dataValues,
          setting: setting!.dataValues,
          store: store?.dataValues ?? null,
        },
      });
  },
  async verifyEmail(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { Query } = VerifyEmail;
    const { token } = Query.parse(req.query);
    const { verify } = util.jwt;

    const id = (verify(token) as string | null) ?? "";
    if (id.length === 0) throw APIError.controller(StatusCodes.BAD_REQUEST, "Invalid token");

    const { isUUID } = schema.validators;
    const parsedId = isUUID.parse(id);

    const { User } = model.db;
    const [_, user] = await User.update(
      { emailVerified: new Date() },
      {
        fields: ["emailVerified"],
        where: { id: parsedId },
        limit: 1,
        returning: true,
      },
    );
    if (user.length === 0) throw APIError.controller(StatusCodes.NOT_FOUND, "User not found");

    res.status(StatusCodes.OK).json({ success: true });
  },
  async forgotPassword(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const { user } = req;
    const { Body } = ForgotPassword;
    const { password } = Body.parse(req.body);

    const { hash } = util.bcrypt;
    await user!.update({ password: hash(password) });

    if (user!.dataValues.emailVerified === null) await user!.update({ emailVerified: new Date() });

    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
