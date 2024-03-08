import { z } from "zod";
import { ENUM } from "../../../constant/index.js";

export default {
  BecomeSeller: {
    Body: z.object({
      storeName: z.string().trim().min(1).max(20),
      theme: z.enum(ENUM.THEMES),
    }),
  },
  Update: {
    Body: z.object({
      username: z.string().trim().min(1).max(50),
      theme: z.enum(ENUM.THEMES),
      locale: z.enum(ENUM.LOCALE),
      forceTheme: z.boolean(),
      disableAnimations: z.boolean(),
    }),
  },
  Delete: {
    Query: z.object({
      force: z.coerce.boolean().optional(),
    }),
  },
} as const;
