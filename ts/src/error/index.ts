import { ENV, type KEYS } from "../constant/index.js";
import { getReasonPhrase, StatusCodes, ReasonPhrases } from "http-status-codes";
import { lib } from "../lib/index.js";
import { model } from "../model/index.js";
import { schema } from "../schema/index.js";

const { toString } = schema.validators;

export class BaseError extends Error {
  public readonly isOperational: boolean;
  public readonly handler: HandlerTypes;
  public readonly statusText: ReasonPhrases;
  public readonly statusCode: StatusCodes;
  public readonly rollback: Rollback;

  constructor(
    statusCode: StatusCodes,
    message: string,
    handler: HandlerTypes,
    isOperational: boolean,
    rollback: Rollback,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.statusText = getReasonPhrase(this.statusCode) as ReasonPhrases;
    this.handler = handler;
    this.isOperational = isOperational;
    this.rollback = rollback;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }

  public static async handleError(error: unknown) {
    if (!IS_PRODUCTION) {
      console.error(error);
      return;
    }

    type NewErrorType = {
      message: string;
      stack: string;
      statusCode: StatusCodes;
      isOperational: boolean;
      handler: HandlerTypes;
      rollback: Rollback;
    };

    const err = error instanceof Error ? error : new Error(toString.parse(error));

    const newError: NewErrorType = {
      message: err.message,
      stack: (err.stack ?? "").replaceAll("\n", "<br/>"),
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      isOperational: false,
      handler: "server",
      rollback: null,
    };
    if (err instanceof BaseError) {
      newError.statusCode = err.statusCode;
      newError.handler = err.handler;
      newError.isOperational = err.isOperational;
      newError.rollback = err.rollback;
    }

    try {
      const {
        Mail,
        file: { FileUploader },
      } = lib;
      const { ServerError } = model.db;

      const files = newError.rollback?.files ?? [];

      await Promise.all([
        new Mail(
          ENV.MAIL.USER,
          `New error - ${newError.isOperational ? "Catch" : "Urgent"} - Status: ${newError.statusCode}`,
          Mail.errorTemplate(newError),
        ).send(),
        ServerError.create(newError, {
          fields: ["message", "stack", "statusCode", "isOperational", "handler"],
        }),
        FileUploader.remove(...files),
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
  static controller(statusCode: StatusCodes, message: string = "", rollback: Rollback = null) {
    return new BaseError(statusCode, message, "controller", true, rollback);
  }

  static middleware(statusCode: StatusCodes, message: string = "", rollback: Rollback = null) {
    return new BaseError(statusCode, message, "middleware", true, rollback);
  }

  static socket(statusCode: StatusCodes, message: string = "", rollback: Rollback = null) {
    return new BaseError(statusCode, message, "socket", true, rollback);
  }

  static passport(statusCode: StatusCodes, message: string = "", rollback: Rollback = null) {
    return new BaseError(statusCode, message, "passport", true, rollback);
  }

  static server(statusCode: StatusCodes, message: string = "", rollback: Rollback = null) {
    return new BaseError(statusCode, message, "server", false, rollback);
  }
}

type HandlerTypes = (typeof KEYS.ERROR.HANDLERS)[number];

type Rollback = RollbackFields | null;

type RollbackFields = {
  files: string[];
};
