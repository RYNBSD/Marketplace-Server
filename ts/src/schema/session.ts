import { z } from "zod";

export const Csrf = z
  .object({
    secret: z.string().trim().min(1),
  })
  .strict()
  .optional();

export const User = z
  .object({
    id: z.string().trim().min(1).uuid(),
    seller: z
      .object({
        id: z.string().trim().min(1).uuid(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .optional();

export const Access = z
  .object({
    key: z.string().trim().min(1),
    iv: z.string().trim().min(1),
  })
  .strict()
  .optional();

export const Session = z
  .object({ csrf: Csrf, user: User, access: Access })
  .strict();
