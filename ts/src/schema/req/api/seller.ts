import { z } from "zod";
import { VALUES } from "../../../constant/index.js";

const { MIN, MAX } = VALUES.LENGTH;

const SellerId = z
  .object({ sellerId: z.string().trim().min(MIN.REQUIRED).uuid() })
  .strict();
const CategoryId = z
  .object({ categoryId: z.string().trim().min(MIN.REQUIRED).uuid() })
  .strict();
const ProductId = z
  .object({ productId: z.string().trim().min(MIN.REQUIRED).uuid() })
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
