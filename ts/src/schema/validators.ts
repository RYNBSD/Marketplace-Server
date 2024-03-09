import { z } from "zod";
import { VALUES } from "../constant/index.js";

const { MIN } = VALUES.LENGTH;

export default {
  isUUID: z.string().trim().min(MIN.REQUIRED).uuid(),
  isNullish: z.any().nullish(),
} as const;
