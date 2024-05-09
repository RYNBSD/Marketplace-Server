import type { Request, Response } from "express";
import type { TResponse } from "../../../types/index.js";
import { StatusCodes } from "http-status-codes";
import { KEYS } from "../../../constant/index.js";
import { APIError } from "../../../error/index.js";
import { util } from "../../../util/index.js";
import { schema } from "../../../schema/index.js";

const { COOKIE } = KEYS;
const { Token } = schema.req.security.validate.access;

export default {
  async token(req: Request, res: Response<TResponse["Body"]["Success"], TResponse["Locals"]>) {
    const token = `${req.cookies?.[COOKIE.TOKEN] ?? ""}`;
    if (token.length === 0) throw APIError.controller(StatusCodes.BAD_REQUEST, "Empty access token");

    const key = req.session.access?.key ?? "";
    if (key.length === 0) throw APIError.server(StatusCodes.FORBIDDEN, "Invalid access key");

    const iv = req.session.access?.iv ?? "";
    if (iv.length === 0) throw APIError.server(StatusCodes.FORBIDDEN, "Invalid access iv");

    const { Body } = Token;
    const { code } = Body.parse(req.body);

    const { access } = util;
    const isValid = access.verify(token, key, iv, code);
    if (!isValid.valid) throw APIError.controller(StatusCodes.FORBIDDEN, "Invalid access token");

    res.status(StatusCodes.OK).json({ success: true });
  },
} as const;
