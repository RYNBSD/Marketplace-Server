import { z } from "zod";
import categories from "./categories.js";
import products from "./products.js";
import { VALUES } from "../../../../../constant/index.js";

const { MIN, MAX } = VALUES.LENGTH;

export default {
  Update: {
    Body: z.object({
      name: z.string().trim().min(MIN.REQUIRED).max(MAX.STORE.NAME),
    }),
  },
  categories,
  products,
} as const;
