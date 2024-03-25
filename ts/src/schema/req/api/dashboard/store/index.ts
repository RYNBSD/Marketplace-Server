import { z } from "zod";
import { VALUES } from "../../../../../constant/index.js";

const { MIN, MAX } = VALUES.LENGTH;

const [{ default: categories }, { default: products }] = await Promise.all([
  import("./categories.js"),
  import("./products.js"),
]);

export default {
  Update: {
    Body: z.object({
      name: z.string().trim().min(MIN.REQUIRED).max(MAX.STORE.NAME),
    }),
  },
  categories,
  products,
} as const;
