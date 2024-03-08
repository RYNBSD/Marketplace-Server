import type {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import type { z } from "zod";
import type { schema } from "../schema/index.js";

type CreateOptionalIdString = { id: CreationOptional<string> };

type User = z.infer<typeof schema.db.User> & CreateOptionalIdString;
type UserSettings = z.infer<typeof schema.db.UserSettings>;

type Seller = z.infer<typeof schema.db.Seller> & CreateOptionalIdString;
type SellerSettings = z.infer<typeof schema.db.SellerSettings>;
type SellerLinks = z.infer<typeof schema.db.SellerLinks> &
  CreateOptionalIdString;
type SellerViewers = z.infer<typeof schema.db.SellerViewers> &
  CreateOptionalIdString;

type Category = z.infer<typeof schema.db.Category> & CreateOptionalIdString;
type CategoryViewers = z.infer<typeof schema.db.CategoryViewers> &
  CreateOptionalIdString;

type Product = z.infer<typeof schema.db.Product> & CreateOptionalIdString;
type ProductInfo = z.infer<typeof schema.db.ProductInfo> &
  CreateOptionalIdString;
type ProductQuality = z.infer<typeof schema.db.ProductQuality> &
  CreateOptionalIdString;
type ProductImages = z.infer<typeof schema.db.ProductImages> &
  CreateOptionalIdString;
type ProductRatings = z.infer<typeof schema.db.ProductRatings>;
type ProductSizes = z.infer<typeof schema.db.ProductSizes> &
  CreateOptionalIdString;
type ProductColors = z.infer<typeof schema.db.ProductColors> &
  CreateOptionalIdString;
type ProductViewers = z.infer<typeof schema.db.ProductViewers> &
  CreateOptionalIdString;

type Tag = z.infer<typeof schema.db.Tag> & CreateOptionalIdString;
type ProductTags = z.infer<typeof schema.db.ProductTags>;

type Orders = z.infer<typeof schema.db.Orders> & CreateOptionalIdString;

export type Tables = {
  User: Model<InferAttributes<User>, InferCreationAttributes<User>>;
  UserSettings: Model<
    InferAttributes<UserSettings>,
    InferCreationAttributes<UserSettings>
  >;
  Seller: Model<InferAttributes<Seller>, InferCreationAttributes<Seller>>;
  SellerSettings: Model<
    InferAttributes<SellerSettings>,
    InferCreationAttributes<SellerSettings>
  >;
  SellerLinks: Model<
    InferAttributes<SellerLinks>,
    InferCreationAttributes<SellerLinks>
  >;
  SellerViewers: Model<
    InferAttributes<SellerViewers>,
    InferCreationAttributes<SellerViewers>
  >;
  Category: Model<InferAttributes<Category>, InferCreationAttributes<Category>>;
  CategoryViewers: Model<
    InferAttributes<CategoryViewers>,
    InferCreationAttributes<CategoryViewers>
  >;
  Product: Model<InferAttributes<Product>, InferCreationAttributes<Product>>;
  ProductInfo: Model<
    InferAttributes<ProductInfo>,
    InferCreationAttributes<ProductInfo>
  >;
  ProductQuality: Model<
    InferAttributes<ProductQuality>,
    InferCreationAttributes<ProductQuality>
  >;
  ProductImages: Model<
    InferAttributes<ProductImages>,
    InferCreationAttributes<ProductImages>
  >;
  ProductRatings: Model<
    InferAttributes<ProductRatings>,
    InferCreationAttributes<ProductRatings>
  >;
  ProductSizes: Model<
    InferAttributes<ProductSizes>,
    InferCreationAttributes<ProductSizes>
  >;
  ProductColors: Model<
    InferAttributes<ProductColors>,
    InferCreationAttributes<ProductColors>
  >;
  ProductViewers: Model<
    InferAttributes<ProductViewers>,
    InferCreationAttributes<ProductViewers>
  >;
  Tag: Model<InferAttributes<Tag>, InferCreationAttributes<Tag>>;
  ProductTags: Model<
    InferAttributes<ProductTags>,
    InferCreationAttributes<ProductTags>
  >;
  Orders: Model<InferAttributes<Orders>, InferCreationAttributes<Orders>>;
};
