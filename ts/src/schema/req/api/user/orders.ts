import { z } from "zod";
import { ProductId } from "../../../id.js";

export default {
  Create: {
    Body: z.object({
      orders: z.array(
        z
          .object({
            quantity: z.coerce.number().min(0),
            totalPrice: z.coerce.number().min(0),
          })
          .merge(ProductId),
      ),
    }),
  },
  Update: {
    Query: z.object({
      quantity: z.coerce.number().min(1),
    }),
  },
} as const;
