import { z } from "zod";

export const Csrf = z
  .object({
    secret: z.string().trim().min(1),
  })
  .strict()
  .optional();

export const Passport = z
  .object({
    user: z.string().trim().min(1).uuid(),
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

export const Session = z.object({ csrf: Csrf, passport: Passport, access: Access }).strict();
