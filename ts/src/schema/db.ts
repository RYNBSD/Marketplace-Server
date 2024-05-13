import { z } from "zod";
import { ENUM, KEYS } from "../constant/index.js";

// /(XS|S|M|L|XL)|(^[2-9](XL|XS))/i

const IdInt = z.object({ id: z.number() });
const IdUUID = z.object({ id: z.string().uuid() }).strict();
const UserId = z.object({ userId: z.string().uuid() }).strict();
const NullUserId = z.object({ userId: z.string().uuid().nullable() }).strict();
const StoreId = z.object({ storeId: z.string().uuid() }).strict();
const CategoryId = z.object({ categoryId: z.string().uuid() }).strict();
const ProductId = z.object({ productId: z.string().uuid() }).strict();
const TagId = z.object({ tagId: z.string().uuid() }).strict();

const Ip = z.object({ ip: z.string().nullable() }).strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: UUID v4
 *        username:
 *          type: string
 *        email:
 *          type: string
 *          description: Unique
 *        emailVerified:
 *          type: string
 *          description: Show when the user has verified his email otherwise null
 *        password:
 *          type: string
 *        image:
 *          type: string
 *          description: Uri
 */
export const User = z
  .object({
    username: z.string(),
    email: z.string(),
    emailVerified: z.date().nullable(),
    password: z.string(),
    image: z.string(),
  })
  .merge(IdUUID)
  .strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    UserSetting:
 *      type: object
 *      properties:
 *        userId:
 *          type: string
 *          description: User reference
 *        theme:
 *          type: string
 *        locale:
 *          type: string
 *          description: User preferred language
 *        forceTheme:
 *          type: boolean
 *        disableAnimations:
 *          type: boolean
 *          description: true enable animations otherwise disable
 */
export const UserSetting = z
  .object({
    theme: z.enum(ENUM.THEMES),
    locale: z.enum(ENUM.LOCALE),
    forceTheme: z.boolean(),
    disableAnimations: z.boolean(),
  })
  .merge(UserId)
  .strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    Store:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: UUID v4
 *        userId:
 *          type: string
 *          description: User reference
 *        name:
 *          type: string
 *          description: Unique
 *        image:
 *          type: string
 *          description: Uri
 */
export const Store = z
  .object({
    name: z.string(),
    image: z.string(),
  })
  .merge(IdUUID)
  .merge(UserId)
  .strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    StoreSetting:
 *      type: object
 *      properties:
 *        storeId:
 *          type: string
 *          description: Store reference
 */
export const StoreSetting = z
  .object({
    // theme: z.enum(ENUM.THEMES),
  })
  .merge(StoreId)
  .strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    StoreLink:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: UUID v4
 *        storeId:
 *          type: string
 *          description: Store reference
 *        platform:
 *          type: string
 *          description: Specify platform (instagram, facebook)
 *        link:
 *          type: string
 */
export const StoreLink = z
  .object({
    platform: z.enum(ENUM.PLATFORMS),
    link: z.string().url(),
  })
  .merge(IdUUID)
  .merge(StoreId)
  .strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    StoreViewer:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        storeId:
 *          type: string
 *          description: Store reference
 *        userId:
 *          type: string
 *          description: User reference, can be null.
 *        ip:
 *          type: string
 *          description: Can be null, ip of viewer.
 */
export const StoreViewer = z.object({}).merge(IdInt).merge(StoreId).merge(NullUserId).merge(Ip).strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    Category:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: UUID v4
 *        storeId:
 *          type: string
 *          description: Store reference
 *        name:
 *          type: string
 *          description: English
 *        nameAr:
 *          type: string
 *          description: Arabic
 *        image:
 *          type: string
 *          description: Uri
 */
export const Category = z
  .object({
    name: z.string(),
    nameAr: z.string(),
    image: z.string(),
  })
  .merge(IdUUID)
  .merge(StoreId)
  .strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    CategoryViewer:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        categoryId:
 *          type: string
 *          description: Category reference
 *        userId:
 *          type: string
 *          description: User reference, can be null.
 *        ip:
 *          type: string
 *          description: Can be null, ip of viewer.
 */
export const CategoryViewer = z.object({}).merge(IdInt).merge(CategoryId).merge(NullUserId).merge(Ip).strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: UUID v4
 *        categoryId:
 *          type: string
 *          description: category reference
 *        title:
 *          type: string
 *          description: English
 *        titleAr:
 *          type: string
 *          description: Arabic
 *        description:
 *          type: string
 *          description: English
 *        descriptionAr:
 *          type: string
 *          description: Arabic
 *        quality:
 *          type: string
 *          description: low | medium | high
 *        stock:
 *          type: integer
 *        model:
 *          type: string
 *          description: Uri, 3D model
 *        price:
 *          type: integer
 *        discount:
 *          type: integer
 *          description: in percentage (0-100)%
 */
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
  .merge(IdUUID)
  .merge(CategoryId)
  .strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    ProductInfo:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        productId:
 *          type: string
 *          description: Product reference
 *        info:
 *          type: string
 *          description: English, more product info
 *        infoAr:
 *          type: string
 *          description: Arabic, more product info
 */
export const ProductInfo = z
  .object({
    info: z.string(),
    infoAr: z.string(),
  })
  .merge(IdInt)
  .merge(ProductId)
  .strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    ProductImage:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        productId:
 *          type: string
 *          description: Product reference
 *        image:
 *          type: string
 *          description: Uri
 */
export const ProductImage = z
  .object({
    image: z.string(),
  })
  .merge(IdInt)
  .merge(ProductId)
  .strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    ProductRating:
 *      type: object
 *      properties:
 *        userId:
 *          type: string
 *          description: User reference
 *        productId:
 *          type: string
 *          description: Product reference
 *        rate:
 *          type: string
 *          description: From 0-5
 *        comment:
 *          type: string
 */
export const ProductRating = z
  .object({
    rate: z.enum(ENUM.RATING_STARS),
    comment: z.string(),
  })
  .merge(UserId)
  .merge(ProductId)
  .strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    ProductSize:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        productId:
 *          type: string
 *          description: Product reference
 *        size:
 *          type: string
 *          description: Like s, m, l...
 */
export const ProductSize = z
  .object({
    size: z.string(),
  })
  .merge(IdInt)
  .merge(ProductId)
  .strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    ProductColor:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        productId:
 *          type: string
 *          description: Product reference
 *        color:
 *          type: string
 *          description: Hex (#000000)
 */
export const ProductColor = z
  .object({
    color: z.string(),
  })
  .merge(IdInt)
  .merge(ProductId)
  .strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    ProductViewer:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        productId:
 *          type: string
 *          description: Product reference
 *        userId:
 *          type: string
 *          description: User reference, can be null.
 *        ip:
 *          type: string
 *          description: Can be null, ip of viewer.
 */
export const ProductViewer = z.object({}).merge(IdInt).merge(ProductId).merge(NullUserId).merge(Ip).strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    Tag:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: UUID v4
 *        storeId:
 *          type: string
 *          description: Store reference
 *        tag:
 *          type: string
 */
export const Tag = z
  .object({
    tag: z.string(),
  })
  .merge(IdUUID)
  .merge(StoreId)
  .strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    ProductTag:
 *      type: object
 *      properties:
 *        productId:
 *          type: string
 *          description: Product reference
 *        tagId:
 *          type: string
 *          description: Tag reference
 */
export const ProductTag = z.object({}).merge(ProductId).merge(TagId).strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    Order:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        userId:
 *          type: string
 *          description: User reference
 *        productId:
 *          type: string
 *          description: Product reference
 *        quantity:
 *          type: integer
 *          description: product quantity
 *        totalPrice:
 *          type: integer
 *          description: total price of product order
 *        status:
 *          type: string
 *          description: define status of order, wait | process | done | canceled
 *        processedAt:
 *          type: string
 *          description: In Date format, if null the product is still not processed
 *        doneAt:
 *          type: string
 *          description: In Date format, if null the product is still not shipped
 *        canceledAt:
 *          type: string
 *          description: In Date format, if null the product is not canceled
 */
export const Order = z
  .object({
    quantity: z.number(),
    totalPrice: z.number(),
    status: z.enum(ENUM.ORDER_STATUS),
    processedAt: z.date().nullable(),
    doneAt: z.date().nullable(),
    canceledAt: z.date().nullable(),
  })
  .merge(IdInt)
  .merge(UserId)
  .merge(ProductId)
  .strict();

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    ResponseTime:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        date:
 *          type: integer
 *          description: Seconds, date of response
 *        time:
 *          type: integer
 *          description: Milliseconds, benchmark of response
 *        method:
 *          type: string
 *          description: Request method
 *        path:
 *          type: string
 *          description: Request path
 *        statusCode:
 *          type: integer
 *          description: Response status code
 */
export const ResponseTime = z
  .object({
    date: z.number(),
    time: z.number(),
    method: z.string(),
    path: z.string(),
    statusCode: z.number(),
  })
  .merge(IdInt);

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    ServerError:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        message:
 *          type: string
 *          description:  Error message
 *        stack:
 *          type: string
 *          description: Error stack trace
 *        statusCode:
 *          type: integer
 *          description: Response status code
 *        isOperational:
 *          type: boolean
 *          description: if true error is handled otherwise is not handled
 *        handler:
 *          type: string
 *          description: Where the error is thrown and by who ?
 */
export const ServerError = z
  .object({
    message: z.string(),
    stack: z.string().nullable(),
    statusCode: z.number(),
    isOperational: z.boolean(),
    handler: z.enum(KEYS.ERROR.HANDLERS),
  })
  .merge(IdInt);
