import { z } from "zod";
import { ENUM, VALUES } from "../../../constant/index.js";

const { MIN, MAX } = VALUES.LENGTH

export default {
  BecomeSeller: {
    Body: z.object({
      name: z.string().trim().min(MIN.REQUIRED).max(MAX.STORE.STORE_NAME),
      theme: z.enum(ENUM.THEMES),
    }),
  },
  Update: {
    Body: z.object({
      username: z.string().trim().min(MIN.REQUIRED).max(MAX.USER.USERNAME),
      theme: z.enum(ENUM.THEMES),
      locale: z.enum(ENUM.LOCALE),
      forceTheme: z.coerce.boolean(),
      disableAnimations: z.coerce.boolean(),
    }),
  },
  Delete: {
    Query: z.object({
      force: z.coerce.boolean().default(false),
    }),
  },
} as const;
