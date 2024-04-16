import type { Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import type { z } from "zod";
import type { schema } from "../schema/index.ts";

type CreateOptionalIdNumber = { id: CreationOptional<number> };
type CreateOptionalIdString = { id: CreationOptional<string> };

type User = z.infer<typeof schema.db.User> & CreateOptionalIdString;
type UserSetting = z.infer<typeof schema.db.UserSetting>;

type Store = z.infer<typeof schema.db.Store> & CreateOptionalIdString;
type StoreSetting = z.infer<typeof schema.db.StoreSetting>;
type StoreLink = z.infer<typeof schema.db.StoreLink> & CreateOptionalIdString;
type StoreViewer = z.infer<typeof schema.db.StoreViewer> & CreateOptionalIdString;

type Category = z.infer<typeof schema.db.Category> & CreateOptionalIdString;
type CategoryViewer = z.infer<typeof schema.db.CategoryViewer> & CreateOptionalIdString;

type Product = z.infer<typeof schema.db.Product> & CreateOptionalIdString;
type ProductInfo = z.infer<typeof schema.db.ProductInfo> & CreateOptionalIdNumber;
type ProductImage = z.infer<typeof schema.db.ProductImage> & CreateOptionalIdNumber;
type ProductRating = z.infer<typeof schema.db.ProductRating>;
type ProductSizes = z.infer<typeof schema.db.ProductSize> & CreateOptionalIdNumber;
type ProductColor = z.infer<typeof schema.db.ProductColor> & CreateOptionalIdNumber;
type ProductViewer = z.infer<typeof schema.db.ProductViewer> & CreateOptionalIdString;

type Tag = z.infer<typeof schema.db.Tag> & CreateOptionalIdString;
type ProductTag = z.infer<typeof schema.db.ProductTag> & CreateOptionalIdNumber;

type Order = z.infer<typeof schema.db.Order> & CreateOptionalIdString;

type ResponseTime = z.infer<typeof schema.db.ResponseTime> & CreateOptionalIdNumber;

type ServerError = z.infer<typeof schema.db.ServerError> & CreateOptionalIdNumber;

export type Tables = {
  User: Model<InferAttributes<User>, InferCreationAttributes<User>>;
  UserSetting: Model<InferAttributes<UserSetting>, InferCreationAttributes<UserSetting>>;
  Store: Model<InferAttributes<Store>, InferCreationAttributes<Store>>;
  StoreSetting: Model<InferAttributes<StoreSetting>, InferCreationAttributes<StoreSetting>>;
  StoreLink: Model<InferAttributes<StoreLink>, InferCreationAttributes<StoreLink>>;
  StoreViewer: Model<InferAttributes<StoreViewer>, InferCreationAttributes<StoreViewer>>;
  Category: Model<InferAttributes<Category>, InferCreationAttributes<Category>>;
  CategoryViewer: Model<InferAttributes<CategoryViewer>, InferCreationAttributes<CategoryViewer>>;
  Product: Model<InferAttributes<Product>, InferCreationAttributes<Product>>;
  ProductInfo: Model<InferAttributes<ProductInfo>, InferCreationAttributes<ProductInfo>>;
  ProductImage: Model<InferAttributes<ProductImage>, InferCreationAttributes<ProductImage>>;
  ProductRating: Model<InferAttributes<ProductRating>, InferCreationAttributes<ProductRating>>;
  ProductSize: Model<InferAttributes<ProductSize>, InferCreationAttributes<ProductSize>>;
  ProductColor: Model<InferAttributes<ProductColor>, InferCreationAttributes<ProductColor>>;
  ProductViewer: Model<InferAttributes<ProductViewer>, InferCreationAttributes<ProductViewer>>;
  Tag: Model<InferAttributes<Tag>, InferCreationAttributes<Tag>>;
  ProductTag: Model<InferAttributes<ProductTag>, InferCreationAttributes<ProductTag>>;
  Order: Model<InferAttributes<Order>, InferCreationAttributes<Order>>;
  ResponseTime: Model<InferAttributes<ResponseTime>, InferCreationAttributes<ResponseTime>>;
  ServerError: Model<InferAttributes<ServerError>, InferCreationAttributes<ServerError>>;
};
