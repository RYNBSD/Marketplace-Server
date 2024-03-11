import { z } from "zod";
import { VALUES } from "../constant/index.js";

const { MIN } = VALUES.LENGTH;

export default {
  isUUID: z.string().trim().min(MIN.REQUIRED).uuid(),
  isNullish: z.unknown().nullish(),

  toBoolean: z.coerce.boolean(),
  toString: z.coerce.string(),
  toBigint: z.coerce.bigint(),
  toNumber: z.coerce.number(),
  toDate: z.coerce.date(),
} as const;
