import { z } from "zod";
import { VALUES } from "../../../constant/index.js";
import { StoreId, CategoryId } from "../../id.js";

const { MIN, MAX, LIMIT } = VALUES.LENGTH;

export default {
  Search: {
    Query: z.object({
      s: z.string().trim().min(MIN.REQUIRED),
      limit: z.number().min(MIN.REQUIRED).default(LIMIT),
    }),
  },
  Stores: {
    Query: z.object({
      lastStoreId: z.string().trim().min(MIN.REQUIRED).uuid().optional(),
      limit: z.number().min(MIN.REQUIRED).default(LIMIT),
    }),
  },
  Categories: {
    Query: StoreId.optional(),
  },
  Products: {
    Query: z.object({}).merge(StoreId).merge(CategoryId).optional(),
  },
  Home: {
    Params: StoreId,
  },
  Update: {
    Body: z.object({
      name: z.string().trim().min(MIN.REQUIRED).max(MAX.STORE.NAME),
    }),
  },
} as const;
