import { z } from "zod";

export default {
  isUUID: z.string().trim().min(1).uuid(),
} as const;
