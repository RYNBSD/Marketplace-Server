import { z } from "zod";
import { VALUES } from "../../../../constant/index.js";

const { MIN } = VALUES.LENGTH;

export default {
  Email: {
    Body: z.object({
      email: z.string().trim().min(MIN.REQUIRED).email(),
    }),
  },
} as const;
