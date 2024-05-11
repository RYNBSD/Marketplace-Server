import type { CookieOptions } from "express";

export const cookieOptions = {
  maxAge: 1000 * 60 * 15,
  sameSite: "none",
  httpOnly: IS_PRODUCTION,
  secure: IS_PRODUCTION,
  path: "/",
} satisfies CookieOptions;
