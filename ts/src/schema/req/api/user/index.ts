import { z } from "zod";
import { ENUM, VALUES } from "../../../../constant/index.js";
import orders from "./orders.js";

const { MIN, MAX } = VALUES.LENGTH;

export default {
  Setting: {
    Body: z.object({
      theme: z.enum(ENUM.THEMES),
      locale: z.enum(ENUM.LOCALE),
      forceTheme: z.coerce.boolean(),
      disableAnimations: z.coerce.boolean(),
    }),
  },
  BecomeSeller: {
    Body: z.object({
      name: z.string().trim().min(MIN.REQUIRED).max(MAX.STORE.NAME),
      // theme: z.enum(ENUM.THEMES),
    }),
  },
  Update: {
    Body: z.object({
      username: z.string().trim().min(MIN.REQUIRED).max(MAX.USER.USERNAME),
    }),
  },
  orders,
} as const;
