import { z } from "zod";
import { KEYS, VALUES } from "../../../constant/index.js";

const {
  REQUEST: { PARAMS },
} = KEYS;
const { MIN, MAX } = VALUES.LENGTH;

const SellerId = z
  .object({ [PARAMS.ID.SELLER]: z.string().trim().min(MIN.REQUIRED).uuid() })
  .strict();
const CategoryId = z
  .object({ [PARAMS.ID.CATEGORY]: z.string().trim().min(MIN.REQUIRED).uuid() })
  .strict();
const ProductId = z
  .object({ [PARAMS.ID.PRODUCT]: z.string().trim().min(MIN.REQUIRED).uuid() })
  .strict();

export default {
  All: {
    Query: z
      .object({
        lastSellerId: z.string().trim().min(MIN.REQUIRED).uuid().optional(),
        limit: z.number().min(MIN.REQUIRED).optional(),
      })
      .strict(),
  },
  Profile: {
    Params: SellerId,
  },
  Category: {
    Params: z.object({}).merge(SellerId).merge(CategoryId).strict(),
  },
  Product: {
    Params: z
      .object({})
      .merge(SellerId)
      .merge(CategoryId)
      .merge(ProductId)
      .strict(),
  },
  Update: {
    Body: z
      .object({
        storeName: z
          .string()
          .trim()
          .min(MIN.REQUIRED)
          .max(MAX.SELLER.STORE_NAME),
      })
      .strict(),
  },
} as const;
