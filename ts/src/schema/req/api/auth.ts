import { z } from "zod";
import { ENUM } from "../../../constant/index.js";

export default {
  SignUp: {
    Body: z
      .object({
        username: z.string().trim().min(1).max(50),
        email: z.string().trim().min(1).email().max(100),
        password: z.string().trim().min(8),
        theme: z.enum(ENUM.THEMES),
        locale: z.enum(ENUM.LOCALE),
      })
      .strict(),
  },
  SignIn: {
    Body: z
      .object({
        email: z.string().trim().min(1).email(),
        password: z.string().trim().min(1),
      })
      .strict(),
  },
  VerifyEmail: {
    Query: z
      .object({
        token: z.string().trim().min(1).uuid(),
      })
      .strict(),
  },
  ForgotPassword: {
    Body: z
      .object({
        code: z.string().length(6),
        password: z.string().trim().min(8),
        confirmPassword: z.string().trim().min(8),
      })
      .strict(),
  },
} as const;
