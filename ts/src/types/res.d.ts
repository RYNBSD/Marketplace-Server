import { Tables } from "./db.js";

type Locals = {
  User: {
    user: Tables["User"];
  };
};

type BodyData = Record<string, unknown>;

type Body = {
  Fail: {
    success: false;
    message?: string;
  };
  Success: {
    success: true;
    data?: BodyData | BodyData[];
  };
};

export type TResponse = {
  Body: Body;
  Locals: Locals;
};
