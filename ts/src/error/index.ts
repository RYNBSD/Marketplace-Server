import type { KEYS } from "../constant/index.js";
import { getReasonPhrase, StatusCodes, ReasonPhrases } from "http-status-codes";
import { schema } from "../schema/index.js";

const { toString } = schema.validators;

type HandlerTypes = (typeof KEYS.ERROR.HANDLERS)[number];

export class BaseError extends Error {
  public readonly isOperational: boolean;
  public readonly handler: HandlerTypes;
  public readonly statusText: ReasonPhrases;
  public readonly statusCode: StatusCodes;
  constructor(
    statusCode: StatusCodes,
    message: string,
    handler: HandlerTypes,
    isOperational: boolean
  ) {
    super(message);
    this.statusCode = statusCode;
    this.statusText = getReasonPhrase(this.statusCode) as ReasonPhrases;
    this.handler = handler;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }

  public static async handleError(error: unknown) {
    if (!IS_PRODUCTION) console.error(error);

    const [lib, model] = await Promise.all([
      import("../lib/index.js"),
      import("../model/index.js"),
    ]);

    type NewErrorType = {
      message: string;
      stack: string;
      statusCode: StatusCodes;
      isOperational: boolean;
      handler: HandlerTypes;
    };

    const err =
      error instanceof Error ? error : new Error(toString.parse(error));

    const newError: NewErrorType = {
      message: err.message,
      stack: err.stack ?? "",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      isOperational: false,
      handler: "server",
    };
    if (err instanceof BaseError) {
      newError.statusCode = err.statusCode;
      newError.handler = err.handler;
      newError.isOperational = err.isOperational;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      const { Mail } = lib;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      const { ServerError } = model.db;

      await Promise.all([
        new Mail(
          "",
          `New error - ${
            newError.isOperational ? "Catched" : "Urgent"
          } - Status: ${newError.statusCode}`,
          JSON.stringify(newError)
        ).send(),
        ServerError.create(newError, {
          fields: [
            "message",
            "stack",
            "statusCode",
            "isOperational",
            "handler",
          ],
        }),
      ]);
    } catch (error) {
      if (!IS_PRODUCTION) console.error(error);
      process.exit(1);
    }
  }

  public static checkOperational(error: Error): boolean {
    return error instanceof BaseError ? error.isOperational : false;
  }
}

export class APIError {
  static controller(statusCode: StatusCodes, message: string = "") {
    return new BaseError(statusCode, message, "controller", true);
  }

  static middleware(statusCode: StatusCodes, message: string = "") {
    return new BaseError(statusCode, message, "middleware", true);
  }

  static socket(statusCode: StatusCodes, message: string = "") {
    return new BaseError(statusCode, message, "socket", true);
  }

  static passport(statusCode: StatusCodes, message: string = "") {
    return new BaseError(statusCode, message, "passport", true);
  }

  static server(statusCode: StatusCodes, message: string = "") {
    return new BaseError(statusCode, message, "server", false);
  }
}
