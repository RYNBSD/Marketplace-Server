import { z } from "zod";
import { VALUES } from "../../../../constant/index.js";

const { MIN, MAX } = VALUES.LENGTH;

export default {
  Name: {
    Body: z.object({
      name: z.string().trim().min(MIN.REQUIRED).max(MAX.STORE.NAME),
    }),
  },
  Category: {
    Body: z.object({
      name: z.string().trim().min(MIN.REQUIRED).max(MAX.CATEGORY.NAME),
      nameAr: z.string().trim().min(MIN.REQUIRED).max(MAX.CATEGORY.NAME),
    }),
  },
  Product: {
    Body: z.object({
      title: z.string().trim().min(MIN.REQUIRED).max(MAX.PRODUCT.TITLE),
      titleAr: z.string().trim().min(MIN.REQUIRED).max(MAX.PRODUCT.TITLE),
    }),
  },
} as const;
