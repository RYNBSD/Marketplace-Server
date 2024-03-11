import { z } from "zod";
import { ENUM } from "../constant/index.js";

// /(XS|S|M|L|XL)|(^[2-9](XL|XS))/i

const Id = z.object({ id: z.string().uuid() }).strict();
const UserId = z.object({ userId: z.string().uuid() }).strict();
const SellerId = z.object({ sellerId: z.string().uuid() }).strict();
const CategoryId = z.object({ categoryId: z.string().uuid() }).strict();
const ProductId = z.object({ productId: z.string().uuid() }).strict();
const TagId = z.object({ tagId: z.string().uuid() }).strict();

export const User = z
  .object({
    username: z.string(),
    email: z.string(),
    emailVerified: z.date().nullable(),
    password: z.string(),
    image: z.string(),
  })
  .merge(Id)
  .strict();

export const UserSetting = z
  .object({
    theme: z.enum(ENUM.THEMES),
    locale: z.enum(ENUM.LOCALE),
    forceTheme: z.boolean(),
    disableAnimations: z.boolean(),
  })
  .merge(UserId)
  .strict();

export const Seller = z
  .object({
    storeName: z.string(),
    image: z.string(),
  })
  .merge(Id)
  .merge(UserId)
  .strict();

export const SellerSetting = z
  .object({
    theme: z.enum(ENUM.THEMES),
  })
  .merge(SellerId)
  .strict();

export const SellerLink = z
  .object({
    platform: z.enum(ENUM.PLATFORMS),
    link: z.string().url(),
  })
  .merge(Id)
  .merge(SellerId)
  .strict();

export const SellerViewer = z
  .object({})
  .merge(Id)
  .merge(SellerId)
  .merge(UserId)
  .strict();

export const Category = z
  .object({
    name: z.string(),
    nameAr: z.string(),
    image: z.string(),
  })
  .merge(Id)
  .merge(SellerId)
  .strict();

export const CategoryViewer = z
  .object({})
  .merge(Id)
  .merge(CategoryId)
  .merge(UserId)
  .strict();

export const Product = z
  .object({
    title: z.string(),
    titleAr: z.string(),
    description: z.string().nullable(),
    descriptionAr: z.string().nullable(),
    quality: z.enum(ENUM.QUALITY),
    stock: z.number(),
    model: z.string().nullable(),
    price: z.number(),
    discount: z.number(),
  })
  .merge(Id)
  .merge(CategoryId)
  .strict();

export const ProductInfo = z
  .object({
    info: z.string(),
    infoAr: z.string(),
  })
  .merge(Id)
  .merge(ProductId)
  .strict();

export const ProductImage = z
  .object({
    image: z.string(),
  })
  .merge(Id)
  .merge(ProductId)
  .strict();

export const ProductRating = z
  .object({
    rate: z.enum(ENUM.RATING_STARS),
    comment: z.string(),
  })
  .merge(UserId)
  .merge(ProductId)
  .strict();

export const ProductSize = z
  .object({
    size: z.string(),
  })
  .merge(Id)
  .merge(ProductId)
  .strict();

export const ProductColor = z
  .object({
    color: z.string(),
  })
  .merge(Id)
  .merge(ProductId)
  .strict();

export const ProductViewer = z
  .object({})
  .merge(Id)
  .merge(ProductId)
  .merge(UserId)
  .strict();

export const Tag = z
  .object({
    tag: z.string(),
  })
  .merge(Id)
  .merge(SellerId)
  .strict();

export const ProductTag = z.object({}).merge(ProductId).merge(TagId).strict();

export const Order = z
  .object({
    quantity: z.number(),
    totalPrice: z.number(),
    status: z.enum(ENUM.ORDER_STATUS),
    processedAt: z.date().nullable(),
    doneAt: z.date().nullable(),
    canceledAt: z.date().nullable(),
  })
  .merge(Id)
  .merge(UserId)
  .merge(ProductId)
  .strict();
