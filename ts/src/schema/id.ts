import { z } from "zod";
import { KEYS, VALUES } from "../constant/index.js";

const {
  REQUEST: { PARAMS },
} = KEYS;
const { MIN } = VALUES.LENGTH;

export const SellerId = z.object({
  [PARAMS.ID.SELLER]: z.string().trim().min(MIN.REQUIRED).uuid(),
});

export const CategoryId = z.object({
  [PARAMS.ID.CATEGORY]: z.string().trim().min(MIN.REQUIRED).uuid(),
});

export const ProductId = z.object({
  [PARAMS.ID.PRODUCT]: z.string().trim().min(MIN.REQUIRED).uuid(),
});
