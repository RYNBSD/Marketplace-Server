import { z } from "zod";
import { VALUES } from "../../../../../constant/index.js";

const { MIN, MAX, LIMIT } = VALUES.LENGTH;

export default {
  All: {
    Query: z.object({
      page: z.coerce.number().min(1),
      limit: z.coerce.number().min(1).default(LIMIT),
    }),
  },
  Create: {
    Body: z.object({
      name: z.string().trim().min(MIN.REQUIRED).max(MAX.CATEGORY.NAME),
      nameAr: z.string().trim().min(MIN.REQUIRED).max(MAX.CATEGORY.NAME),
    }),
  },
  Update: {
    Body: z.object({
      name: z.string().trim().min(MIN.REQUIRED).max(MAX.CATEGORY.NAME),
      nameAr: z.string().trim().min(MIN.REQUIRED).max(MAX.CATEGORY.NAME),
    }),
  },
  Delete: {
    Query: z.object({
      force: z.coerce.boolean().optional().default(false),
    }),
  },
} as const;
