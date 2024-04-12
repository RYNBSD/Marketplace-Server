import { z } from "zod";
import { ENUM, VALUES } from "../../../../../constant/index.js";

const { QUALITY } = ENUM;
const { MIN, MAX } = VALUES.LENGTH;

export default {
  Create: {
    Body: z.object({
      title: z.string().trim().min(MIN.REQUIRED).max(MAX.PRODUCT.TITLE),
      titleAr: z.string().trim().min(MIN.REQUIRED).max(MAX.PRODUCT.TITLE),
      description: z.string().trim().max(MAX.PRODUCT.DESCRIPTION),
      descriptionAr: z.string().trim().max(MAX.PRODUCT.DESCRIPTION),
      quality: z.enum(QUALITY),
      stock: z.number().min(0),
      price: z.number().min(0),
      discount: z.number().min(0).max(100),
      categoryId: z.string().trim().min(MIN.REQUIRED).uuid(),
      infos: z.string().trim(),
      sizes: z.string().trim(),
      tags: z.string().trim(),
      colors: z.string().trim(),
    }),
  },
  Update: {
    Body: z.object({
      title: z.string().trim().min(MIN.REQUIRED).max(MAX.PRODUCT.TITLE),
      titleAr: z.string().trim().min(MIN.REQUIRED).max(MAX.PRODUCT.TITLE),
      description: z.string().trim().max(MAX.PRODUCT.DESCRIPTION),
      descriptionAr: z.string().trim().max(MAX.PRODUCT.DESCRIPTION),
      quality: z.enum(QUALITY),
      stock: z.number().min(0),
      price: z.number().min(0),
      discount: z.number().min(0).max(100),
      categoryId: z.string().trim().min(MIN.REQUIRED).uuid(),
      infos: z.string().trim(),
      sizes: z.string().trim(),
      tags: z.string().trim(),
      colors: z.string().trim(),
    }),
  },
  Delete: {
    Query: z.object({
      force: z.coerce.boolean().optional().default(false),
    }),
  },
} as const;
