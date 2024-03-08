import type { NextFunction, Request, Response } from "express";
import type { TResponse } from "../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { serialize } from "cookie";
import { APIError } from "../../error/index.js";
import { schema } from "../../schema/index.js";
import { authenticate } from "../../passport/fn.js";
import { model } from "../../model/index.js";
import { util } from "../../util/index.js";
import { lib } from "../../lib/index.js";
import { KEYS, VALUES } from "../../constant/index.js";

const { COOKIE, HTTP } = KEYS;
const { SignUp, VerifyEmail, ForgotPassword } = schema.req.api.auth;

export default {
  async signUp(req: Request, res: Response<TResponse["Body"]["Success"]>) {
    const { Body } = SignUp;
    const { username, email, password, theme, locale } = Body.parse(req.body);

    const image = req.file ?? null;

    if (image === null)
      throw APIError.controller(
        StatusCodes.BAD_REQUEST,
        "Please, provide an image"
      );

    const { FileConverter, FileUploader } = lib.file;
    const converter = await new FileConverter(image.buffer).convert();
    if (converter.length === 0)
      throw APIError.controller(
        StatusCodes.UNSUPPORTED_MEDIA_TYPE,
        "Unsupported image format"
      );

    const uploaded = await new FileUploader(...converter).upload();
    if (uploaded.length === 0)
      throw APIError.server(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Can't upload your image"
      );

    const { User, UserSettings } = model.db;
    const { hash } = util.bcrypt;

    const user = await User.create({
      username,
      email,
      password: hash(password),
      image: uploaded[0]!,
    });
    await UserSettings.create({
      userId: user.dataValues.id,
      theme,
      locale,
      forceTheme: false,
      disableAnimations: false,
    });

    // TODO: send email verification

    res.status(StatusCodes.CREATED).json({ success: true });
  },
  async signIn(
    req: Request,
    res: Response<TResponse["Body"]["Success"]>,
    next: NextFunction
  ) {
    const user = (await authenticate("local", req, res, next)) as {
      id: string;
    };
    const { sign } = util.jwt;

    res
      .status(StatusCodes.OK)
      .setHeader(
        "Set-Cookie",
        serialize(COOKIE.JWT, sign(user.id), {
          maxAge: VALUES.TIME.MONTH,
          httpOnly: IS_PRODUCTION,
          sameSite: IS_PRODUCTION,
          secure: IS_PRODUCTION,
          path: "/",
        })
      )
      .json({ success: true, data: { user } });
  },
  async signOut(req: Request, res: Response<TResponse["Body"]["Success"]>) {
    req.logOut((err) => {
      if (err) throw err;

      req.session.csrf = { secret: "" };
      req.session.access = { key: "", iv: "" };
      res.status(StatusCodes.OK).json({ success: true });
    });
  },
  async me(
    req: Request,
    res: Response<TResponse["Body"]["Success"]>,
    next: NextFunction
  ) {
    const user = (await authenticate("bearer", req, res, next)) as {
      id: string;
    };
    const { sign } = util.jwt;

    res
      .status(StatusCodes.OK)
      .setHeader(
        "Set-Cookie",
        serialize(COOKIE.JWT, sign(user.id), {
          maxAge: VALUES.TIME.MONTH,
          httpOnly: IS_PRODUCTION,
          sameSite: IS_PRODUCTION,
          secure: IS_PRODUCTION,
          path: "/",
        })
      )
      .json({ success: true, data: { user } });
  },
  async verifyEmail(req: Request, res: Response<TResponse["Body"]["Success"]>) {
    const { Query } = VerifyEmail;
    const { token } = Query.parse(req.query);
    const { verify } = util.jwt;

    const id = (verify(token) as string | null) ?? "";
    if (id.length === 0)
      throw APIError.controller(StatusCodes.BAD_REQUEST, "Invalid token");

    const { isUUID } = schema.validators;
    const parsedId = isUUID.parse(id);

    const { User } = model.db;
    await User.update(
      { emailVerified: new Date() },
      {
        where: { id: parsedId },
        limit: 1,
      }
    );

    res.status(StatusCodes.OK).json({ success: true });
  },
  async forgotPassword(
    req: Request,
    res: Response<TResponse["Body"]["Success"]>
  ) {
    const { Body } = ForgotPassword;
    const { code, password, confirmPassword } = Body.parse(req.body);

    if (password !== confirmPassword)
      throw APIError.controller(StatusCodes.CONFLICT, "Passwords not equal");

    const { getHeader } = util.fn;
    const access = getHeader(req.headers, HTTP.HEADERS.ACCESS_TOKEN);
    if (access instanceof Array)
      throw APIError.controller(StatusCodes.CONFLICT, "Too many access tokens");
    if (access.length === 0)
      throw APIError.controller(StatusCodes.BAD_REQUEST, "Empty access token");

    const { verify } = util.access;
    const key = req.session.access?.key ?? "";
    const iv = req.session.access?.iv ?? "";
    const { valid, id } = verify("", key, iv, code);

    if (!valid)
      throw APIError.controller(StatusCodes.BAD_REQUEST, "Invalid token");

    const { hash } = util.bcrypt;
    const { User } = model.db;
    await User.update({ password: hash(password) }, { where: { id } });

    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
