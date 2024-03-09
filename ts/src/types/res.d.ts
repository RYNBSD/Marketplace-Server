import { Tables } from "./db.js";

type Locals = {
  seller: {
    profile: Tables["Seller"] | null;
    category: Tables["Category"] | null;
    product: Tables["Product"] | null;
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
  Locals: Partial<Locals>;
};
