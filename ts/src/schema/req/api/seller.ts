import { z } from "zod";
import { VALUES } from "../../../constant/index.js";
import { StoreId } from "../../id.js";

const { MIN, MAX, LIMIT } = VALUES.LENGTH;

export default {
  Search: {
    Query: z.object({
      s: z.string().trim().min(MIN.REQUIRED),
      limit: z.number().min(MIN.REQUIRED).default(LIMIT),
    }),
  },
  All: {
    Query: z.object({
      lastStoreId: z.string().trim().min(MIN.REQUIRED).uuid().optional(),
      limit: z.number().min(MIN.REQUIRED).default(LIMIT),
    }),
  },
  Home: {
    Params: StoreId,
  },
  Update: {
    Body: z.object({
      name: z.string().trim().min(MIN.REQUIRED).max(MAX.SELLER.STORE_NAME),
    }),
  },
} as const;
