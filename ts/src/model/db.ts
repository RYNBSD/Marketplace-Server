import type { Tables } from "../types/index.js";
import { DataTypes } from "sequelize";
import { ENUM, KEYS, VALUES } from "../constant/index.js";

const { DB } = KEYS;
const { MAX } = VALUES.LENGTH;

export const User = sequelize.define<Tables["User"]>(
  "user",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING(MAX.USER.USERNAME),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(MAX.USER.EMAIL),
      allowNull: false,
      unique: true,
    },
    emailVerified: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(MAX.USER.PASSWORD),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(MAX.IMAGE),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: DB.TABLES.USER.TABLE,
    timestamps: true,
    paranoid: true,
  },
);
User.addHook("afterDestroy", async (user) => {
  await Promise.all([Store.destroy({ force: false, where: { userId: user.dataValues.id } })]);
});

export const UserSetting = sequelize.define<Tables["UserSetting"]>(
  "user-setting",
  {
    [DB.ID.FOREIGN_KEY.USER]: {
      primaryKey: true,
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
    },
    theme: {
      type: DataTypes.ENUM(...ENUM.THEMES),
      defaultValue: ENUM.THEMES[0],
      allowNull: false,
    },
    locale: {
      type: DataTypes.ENUM(...ENUM.LOCALE),
      defaultValue: ENUM.LOCALE[0],
      allowNull: false,
    },
    forceTheme: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    disableAnimations: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: DB.TABLES.USER.SETTING,
    timestamps: true,
  },
);
User.hasOne(UserSetting, { foreignKey: DB.ID.FOREIGN_KEY.USER });

export const Store = sequelize.define<Tables["Store"]>(
  "seller",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(MAX.STORE.NAME),
      unique: true,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(MAX.IMAGE),
      allowNull: false,
    },
    [DB.ID.FOREIGN_KEY.USER]: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { tableName: DB.TABLES.STORE.TABLE, timestamps: true, paranoid: true },
);
User.hasOne(Store, { foreignKey: DB.ID.FOREIGN_KEY.USER });
Store.addHook("afterDestroy", async (store) => {
  await Promise.all([
    // StoreSetting.destroy({ force: false, where: { storeId: store.dataValues.id } }),
    StoreLink.destroy({ force: false, where: { storeId: store.dataValues.id } }),
    Category.destroy({ force: false, where: { storeId: store.dataValues.id } }),
  ]);
});

export const StoreSetting = sequelize.define<Tables["StoreSetting"]>(
  "seller-setting",
  {
    [DB.ID.FOREIGN_KEY.STORE]: {
      primaryKey: true,
      type: DataTypes.UUID,
      references: {
        model: Store,
        key: "id",
      },
    },
    theme: {
      type: DataTypes.ENUM(...ENUM.THEMES),
      defaultValue: ENUM.THEMES[0],
      allowNull: false,
    },
  },
  {
    tableName: DB.TABLES.STORE.SETTING,
    timestamps: true,
  },
);
Store.hasOne(StoreSetting, { foreignKey: DB.ID.FOREIGN_KEY.STORE });

export const StoreLink = sequelize.define<Tables["StoreLink"]>(
  "seller-link",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    platform: {
      type: DataTypes.ENUM(...ENUM.PLATFORMS),
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING(MAX.STORE.LINK),
      allowNull: false,
    },
    [DB.ID.FOREIGN_KEY.STORE]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Store,
        key: "id",
      },
    },
  },
  {
    tableName: DB.TABLES.STORE.LINK,
    timestamps: true,
    paranoid: true,
  },
);
Store.hasMany(StoreLink, { foreignKey: DB.ID.FOREIGN_KEY.STORE });

export const StoreViewer = sequelize.define<Tables["StoreViewer"]>(
  "seller-viewer",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    [DB.ID.FOREIGN_KEY.USER]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    [DB.ID.FOREIGN_KEY.STORE]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Store,
        key: "id",
      },
    },
  },
  { tableName: DB.TABLES.STORE.VIEWER, createdAt: true, updatedAt: false },
);
Store.hasMany(StoreViewer, { foreignKey: DB.ID.FOREIGN_KEY.STORE });
User.hasMany(StoreViewer, { foreignKey: DB.ID.FOREIGN_KEY.USER });

export const Category = sequelize.define<Tables["Category"]>(
  "category",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(MAX.CATEGORY.NAME),
      allowNull: false,
    },
    nameAr: {
      type: DataTypes.STRING(MAX.CATEGORY.NAME),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(MAX.IMAGE),
      allowNull: false,
    },
    [DB.ID.FOREIGN_KEY.STORE]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Store,
        key: "id",
      },
    },
  },
  {
    tableName: DB.TABLES.CATEGORY.TABLE,
    timestamps: true,
    paranoid: true,
  },
);
Store.hasMany(Category, { foreignKey: DB.ID.FOREIGN_KEY.STORE });
Category.addHook("afterDestroy", async (category) => {
  await Promise.all([Product.destroy({ force: false, where: { categoryId: category.dataValues.id } })]);
});

export const CategoryViewer = sequelize.define<Tables["CategoryViewer"]>(
  "category-viewer",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    [DB.ID.FOREIGN_KEY.USER]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    [DB.ID.FOREIGN_KEY.CATEGORY]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  { tableName: DB.TABLES.CATEGORY.VIEWER, createdAt: true, updatedAt: false },
);
Category.hasMany(CategoryViewer, { foreignKey: DB.ID.FOREIGN_KEY.CATEGORY });
User.hasMany(CategoryViewer, { foreignKey: DB.ID.FOREIGN_KEY.USER });

export const Product = sequelize.define<Tables["Product"]>(
  "product",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING(MAX.PRODUCT.TITLE),
      allowNull: false,
    },
    titleAr: {
      type: DataTypes.STRING(MAX.PRODUCT.TITLE),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(MAX.PRODUCT.DESCRIPTION),
      allowNull: true,
    },
    descriptionAr: {
      type: DataTypes.STRING(MAX.PRODUCT.DESCRIPTION),
      allowNull: true,
    },
    quality: {
      type: DataTypes.ENUM(...ENUM.QUALITY),
      allowNull: false,
    },
    stock: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(MAX.PRODUCT.MODEL),
      allowNull: true,
    },
    price: {
      type: DataTypes.DOUBLE.UNSIGNED,
      allowNull: false,
    },
    discount: {
      type: DataTypes.DOUBLE.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    [DB.ID.FOREIGN_KEY.CATEGORY]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    tableName: DB.TABLES.PRODUCT.TABLE,
    timestamps: true,
    paranoid: true,
  },
);
Category.hasMany(Product, { foreignKey: DB.ID.FOREIGN_KEY.CATEGORY });
Product.addHook("afterDestroy", async (product) => {
  await Promise.all([
    ProductInfo.destroy({ force: false, where: { productId: product.dataValues.id } }),
    ProductImage.destroy({ force: false, where: { productId: product.dataValues.id } }),
    ProductColor.destroy({ force: false, where: { productId: product.dataValues.id } }),
    ProductSize.destroy({ force: false, where: { productId: product.dataValues.id } }),
    ProductRating.destroy({ force: false, where: { productId: product.dataValues.id } }),
    ProductTag.destroy({ force: false, where: { productId: product.dataValues.id } }),
  ]);
});

export const ProductInfo = sequelize.define<Tables["ProductInfo"]>(
  "product-info",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    info: {
      type: DataTypes.STRING(MAX.PRODUCT.INFO),
      allowNull: false,
    },
    infoAr: {
      type: DataTypes.STRING(MAX.PRODUCT.INFO),
      allowNull: false,
    },
    [DB.ID.FOREIGN_KEY.PRODUCT]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    tableName: DB.TABLES.PRODUCT.INFO,
    timestamps: true,
    paranoid: true,
  },
);
Product.hasMany(ProductInfo, { foreignKey: DB.ID.FOREIGN_KEY.PRODUCT });

export const ProductImage = sequelize.define<Tables["ProductImage"]>(
  "product-image",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    image: {
      type: DataTypes.STRING(MAX.IMAGE),
      allowNull: false,
    },
    [DB.ID.FOREIGN_KEY.PRODUCT]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    tableName: DB.TABLES.PRODUCT.IMAGE,
    createdAt: true,
    updatedAt: false,
    paranoid: true,
  },
);
Product.hasMany(ProductImage, { foreignKey: DB.ID.FOREIGN_KEY.PRODUCT });

export const ProductRating = sequelize.define<Tables["ProductRating"]>(
  "product-rating",
  {
    [DB.ID.FOREIGN_KEY.USER]: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    [DB.ID.FOREIGN_KEY.PRODUCT]: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    rate: {
      type: DataTypes.ENUM(...ENUM.RATING_STARS),
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING(MAX.PRODUCT.COMMENT),
      allowNull: true,
    },
  },
  {
    tableName: DB.TABLES.PRODUCT.RATING,
    timestamps: true,
    paranoid: true,
  },
);
Product.hasMany(ProductRating, { foreignKey: DB.ID.FOREIGN_KEY.PRODUCT });
User.hasMany(ProductRating, { foreignKey: DB.ID.FOREIGN_KEY.USER });

export const ProductSize = sequelize.define<Tables["ProductSize"]>(
  "product-size",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    size: {
      type: DataTypes.STRING(MAX.PRODUCT.SIZE),
      validate: {
        is: /\b((xs|s|m|l|xl)|([2-9](xs|xl)))\b/i,
      },
      allowNull: false,
    },
    [DB.ID.FOREIGN_KEY.PRODUCT]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    tableName: DB.TABLES.PRODUCT.SIZE,
    createdAt: true,
    updatedAt: false,
    paranoid: true,
  },
);
Product.hasMany(ProductSize, { foreignKey: DB.ID.FOREIGN_KEY.PRODUCT });

export const ProductColor = sequelize.define<Tables["ProductColor"]>(
  "product-color",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    color: {
      type: DataTypes.STRING(MAX.PRODUCT.COLOR),
      allowNull: false,
    },
    [DB.ID.FOREIGN_KEY.PRODUCT]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    tableName: DB.TABLES.PRODUCT.COLOR,
    createdAt: true,
    updatedAt: false,
    paranoid: true,
  },
);
Product.hasMany(ProductColor, { foreignKey: DB.ID.FOREIGN_KEY.PRODUCT });

export const ProductViewer = sequelize.define<Tables["ProductViewer"]>(
  "product-viewer",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    [DB.ID.FOREIGN_KEY.USER]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    [DB.ID.FOREIGN_KEY.PRODUCT]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  { tableName: DB.TABLES.PRODUCT.VIEWER, createdAt: true, updatedAt: false },
);
Product.hasMany(ProductViewer, { foreignKey: DB.ID.FOREIGN_KEY.PRODUCT });
User.hasMany(ProductViewer, { foreignKey: DB.ID.FOREIGN_KEY.PRODUCT });

export const Tag = sequelize.define<Tables["Tag"]>(
  "tag",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    tag: {
      type: DataTypes.STRING(MAX.TAG),
      unique: true,
      allowNull: false,
    },
    [DB.ID.FOREIGN_KEY.STORE]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Store,
        key: "id",
      },
    },
  },
  {
    tableName: DB.TABLES.TAG,
    createdAt: true,
    updatedAt: false,
  },
);
Store.hasMany(Tag, { foreignKey: DB.ID.FOREIGN_KEY.STORE });
Tag.addHook("afterDestroy", async (tag) => {
  await Promise.all([ProductTag.destroy({ force: false, where: { tagId: tag.dataValues.id } })]);
});

export const ProductTag = sequelize.define<Tables["ProductTag"]>(
  "product-tag",
  {
    [DB.ID.FOREIGN_KEY.TAG]: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Tag,
        key: "id",
      },
    },
    [DB.ID.FOREIGN_KEY.PRODUCT]: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    tableName: DB.TABLES.PRODUCT.TAG,
    createdAt: true,
    updatedAt: false,
    paranoid: true,
  },
);
Product.hasMany(ProductTag, { foreignKey: DB.ID.FOREIGN_KEY.PRODUCT });
Tag.hasMany(ProductTag, { foreignKey: DB.ID.FOREIGN_KEY.TAG });

export const Order = sequelize.define<Tables["Order"]>(
  "order",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    quantity: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DOUBLE.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...ENUM.ORDER_STATUS),
      defaultValue: ENUM.ORDER_STATUS[0],
      allowNull: false,
    },
    [DB.ID.FOREIGN_KEY.USER]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    [DB.ID.FOREIGN_KEY.PRODUCT]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    doneAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    canceledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: DB.TABLES.ORDER,
    timestamps: true,
  },
);
Product.hasMany(Order, { foreignKey: DB.ID.FOREIGN_KEY.PRODUCT });
User.hasMany(Order, { foreignKey: DB.ID.FOREIGN_KEY.USER });

export const ResponseTime = sequelize.define<Tables["ResponseTime"]>(
  "response-time",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      // SELECT EXTRACT(epoch FROM CURRENT_TIMESTAMP);
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    time: {
      type: DataTypes.FLOAT.UNSIGNED,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    statusCode: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
    },
  },
  { tableName: DB.TABLES.RESPONSE_TIME, timestamps: false, paranoid: false },
);

export const ServerError = sequelize.define<Tables["ServerError"]>(
  "server-error",
  {
    [DB.ID.PRIMARY_KEY.ID]: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    stack: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    statusCode: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
    },
    isOperational: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    handler: {
      type: DataTypes.ENUM(...KEYS.ERROR.HANDLERS),
      allowNull: false,
    },
  },
  { tableName: DB.TABLES.SERVER_ERROR, timestamps: true },
);
