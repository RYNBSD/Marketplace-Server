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
type UserSetting = z.infer<typeof schema.db.UserSetting>;

type Seller = z.infer<typeof schema.db.Seller> & CreateOptionalIdString;
type SellerSetting = z.infer<typeof schema.db.SellerSetting>;
type SellerLink = z.infer<typeof schema.db.SellerLink> &
  CreateOptionalIdString;
type SellerViewer = z.infer<typeof schema.db.SellerViewer> &
  CreateOptionalIdString;

type Category = z.infer<typeof schema.db.Category> & CreateOptionalIdString;
type CategoryViewer = z.infer<typeof schema.db.CategoryViewer> &
  CreateOptionalIdString;

type Product = z.infer<typeof schema.db.Product> & CreateOptionalIdString;
type ProductInfo = z.infer<typeof schema.db.ProductInfo> &
  CreateOptionalIdString;
type ProductImage = z.infer<typeof schema.db.ProductImage> &
  CreateOptionalIdString;
type ProductRating = z.infer<typeof schema.db.ProductRating>;
type ProductSizes = z.infer<typeof schema.db.ProductSize> &
  CreateOptionalIdString;
type ProductColor = z.infer<typeof schema.db.ProductColor> &
  CreateOptionalIdString;
type ProductViewer = z.infer<typeof schema.db.ProductViewer> &
  CreateOptionalIdString;

type Tag = z.infer<typeof schema.db.Tag> & CreateOptionalIdString;
type ProductTag = z.infer<typeof schema.db.ProductTag>;

type Order = z.infer<typeof schema.db.Order> & CreateOptionalIdString;

export type Tables = {
  User: Model<InferAttributes<User>, InferCreationAttributes<User>>;
  UserSetting: Model<
    InferAttributes<UserSetting>,
    InferCreationAttributes<UserSetting>
  >;
  Seller: Model<InferAttributes<Seller>, InferCreationAttributes<Seller>>;
  SellerSetting: Model<
    InferAttributes<SellerSetting>,
    InferCreationAttributes<SellerSetting>
  >;
  SellerLink: Model<
    InferAttributes<SellerLink>,
    InferCreationAttributes<SellerLink>
  >;
  SellerViewer: Model<
    InferAttributes<SellerViewer>,
    InferCreationAttributes<SellerViewer>
  >;
  Category: Model<InferAttributes<Category>, InferCreationAttributes<Category>>;
  CategoryViewer: Model<
    InferAttributes<CategoryViewer>,
    InferCreationAttributes<CategoryViewer>
  >;
  Product: Model<InferAttributes<Product>, InferCreationAttributes<Product>>;
  ProductInfo: Model<
    InferAttributes<ProductInfo>,
    InferCreationAttributes<ProductInfo>
  >;
  ProductImage: Model<
    InferAttributes<ProductImage>,
    InferCreationAttributes<ProductImage>
  >;
  ProductRating: Model<
    InferAttributes<ProductRating>,
    InferCreationAttributes<ProductRating>
  >;
  ProductSize: Model<
    InferAttributes<ProductSize>,
    InferCreationAttributes<ProductSize>
  >;
  ProductColor: Model<
    InferAttributes<ProductColor>,
    InferCreationAttributes<ProductColor>
  >;
  ProductViewer: Model<
    InferAttributes<ProductViewer>,
    InferCreationAttributes<ProductViewer>
  >;
  Tag: Model<InferAttributes<Tag>, InferCreationAttributes<Tag>>;
  ProductTag: Model<
    InferAttributes<ProductTag>,
    InferCreationAttributes<ProductTag>
  >;
  Order: Model<InferAttributes<Order>, InferCreationAttributes<Order>>;
};
