import { z } from "zod";

export default {
  Email: {
    Body: z
      .object({
        email: z.string().trim().min(1).email(),
      }),
  },
} as const;
