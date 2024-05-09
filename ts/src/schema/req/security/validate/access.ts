import { z } from "zod";
import { VALUES } from "../../../../constant/index.js";

const { MIN } = VALUES.LENGTH;

export default {
  Token: {
    Body: z.object({
      code: z.string().trim().min(MIN.REQUIRED),
    }),
  },
} as const;
