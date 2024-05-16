import { z } from "zod";
import { ORDER_STATUS } from "../../../../../constant/enum.js";

export default {
  Patch: {
    Query: z.object({
      status: z.enum(ORDER_STATUS),
    }),
  },
} as const;
