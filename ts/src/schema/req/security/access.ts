import { z } from "zod";
import { VALUES } from "../../../constant/index.js";

const { PASSWORD, MIN } = VALUES.LENGTH

export default {
  Email: {
    Middleware: {
      Body: z.object({
        code: z.string().length(6),
        password: z.string().trim().min(PASSWORD),
        confirmPassword: z.string().trim().min(PASSWORD),
      }),
    },
    Body: z
      .object({
        email: z.string().trim().min(MIN.REQUIRED).email(),
      }),
  },
} as const;
