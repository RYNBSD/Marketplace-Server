import { z } from "zod";
import { VALUES } from "../../../constant/index.js";
import { StoreId } from "../../id.js";

const { MIN, LIMIT } = VALUES.LENGTH;

export default {
  Search: {
    Query: z.object({
      s: z.string().trim().min(MIN.REQUIRED),
      limit: z.coerce.number().min(MIN.REQUIRED).default(LIMIT),
    }),
  },
  Stores: {
    Query: z.object({
      lastStoreId: z.string().trim().min(MIN.REQUIRED).uuid().optional(),
      limit: z.coerce.number().min(MIN.REQUIRED).default(LIMIT),
    }),
  },
  // Categories: {
  //   Query: StoreId.optional().default({ storeId: "" }),
  // },
  // Products: {
  //   Query: z.object({}).merge(StoreId).merge(CategoryId).optional().default({ storeId: "", categoryId: "" }),
  // },
  Home: {
    Params: StoreId,
  },
} as const;
