import { z } from "zod";
import { ENUM, VALUES } from "../../../constant/index.js";

const { MAX, MIN, PASSWORD } = VALUES.LENGTH;

export default {
  SignUp: {
    Body: z.object({
      username: z.string().trim().min(MIN.REQUIRED).max(MAX.USER.USERNAME),
      email: z.string().trim().min(MIN.REQUIRED).email().max(MAX.USER.EMAIL),
      password: z.string().trim().min(PASSWORD),
      theme: z.enum(ENUM.THEMES),
      locale: z.enum(ENUM.LOCALE),
    }),
  },
  VerifyEmail: {
    Query: z.object({
      token: z.string().trim().min(MIN.REQUIRED).uuid(),
    }),
  },
  ForgotPassword: {
    Body: z.object({
      password: z.string().trim().min(PASSWORD),
    }),
  },
} as const;
