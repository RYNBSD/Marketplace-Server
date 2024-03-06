import type { KEYS } from "../constant/index.js"
import { getReasonPhrase, StatusCodes, ReasonPhrases } from "http-status-codes";
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
        this.statusText = getReasonPhrase(
            this.statusCode
        ).toLowerCase() as ReasonPhrases;
        this.handler = handler;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }

    public static async handleError(error: Error) {
        if (!IS_PRODUCTION) console.error(error);

        type NewErrorType = {
            message: string;
            stack: string;
            statusCode: StatusCodes;
            statusText: ReasonPhrases;
            isOperational: boolean;
            handler: HandlerTypes;
        };
        const newError: NewErrorType = {
            message: error.message,
            stack: error.stack ?? "",
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
            isOperational: false,
            handler: "server",
        };
        if (error instanceof BaseError) {
            newError.statusCode = error.statusCode;
            newError.statusText = error.statusText;
            newError.handler = error.handler;
        }

        try {
            const [
                {
                    lib: { Mail },
                },
                {
                    model: {
                        tables: { ServerErrors },
                    },
                },
            ] = await Promise.all([
                import("../lib/index.js"),
                import("../model/index.js"),
            ]);
            await Promise.all([
                new Mail(
                    "",
                    `New error - ${newError.statusText} - ${newError.statusCode}`,
                    JSON.stringify(newError)
                ).send(),
                ServerErrors.create(newError, {
                    fields: [
                        "message",
                        "stack",
                        "statusCode",
                        "statusText",
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

    static server(statusCode: StatusCodes, message: string = "") {
        return new BaseError(statusCode, message, "server", false);
    }
}
