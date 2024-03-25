import { Tables } from "./db.js";

type Locals = {
  store: Tables["Store"];
  category: Tables["Category"];
  product: Tables["Product"];
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
  Locals: Partial<Locals>;
};
