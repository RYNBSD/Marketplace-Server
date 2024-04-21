import type { Tables } from "../types/index.js";
import { DataTypes } from "sequelize";
import { ENUM, KEYS, VALUES } from "../constant/index.js";

const { ID, TABLES, MODELS } = KEYS.DB;
const { MAX } = VALUES.LENGTH;

export const User = sequelize.define<Tables["User"]>(
  MODELS.USER.MODEL,
  {
    [ID.PRIMARY_KEY.ID]: {
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
    tableName: TABLES.USER.TABLE,
    timestamps: true,
    paranoid: true,
  },
);
User.addHook("afterDestroy", async (user) => {
  await Promise.all([Store.destroy({ force: false, where: { userId: user.dataValues.id } })]);
});

export const UserSetting = sequelize.define<Tables["UserSetting"]>(
  MODELS.USER.SETTING,
  {
    [ID.FOREIGN_KEY.USER]: {
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
    tableName: TABLES.USER.SETTING,
    timestamps: true,
  },
);
User.hasOne(UserSetting, { foreignKey: ID.FOREIGN_KEY.USER, as: MODELS.USER.SETTING });

export const Store = sequelize.define<Tables["Store"]>(
  MODELS.STORE.MODEL,
  {
    [ID.PRIMARY_KEY.ID]: {
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
    [ID.FOREIGN_KEY.USER]: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { tableName: TABLES.STORE.TABLE, timestamps: true, paranoid: true },
);
User.hasOne(Store, { foreignKey: ID.FOREIGN_KEY.USER, as: MODELS.STORE.MODEL });
Store.addHook("afterDestroy", async (store) => {
  await Promise.all([
    StoreLink.destroy({ force: false, where: { storeId: store.dataValues.id } }),
    Category.destroy({ force: false, where: { storeId: store.dataValues.id } }),
  ]);
});

export const StoreSetting = sequelize.define<Tables["StoreSetting"]>(
  MODELS.STORE.SETTING,
  {
    [ID.FOREIGN_KEY.STORE]: {
      primaryKey: true,
      type: DataTypes.UUID,
      references: {
        model: Store,
        key: "id",
      },
    },
    // theme: {
    //   type: DataTypes.ENUM(...ENUM.THEMES),
    //   defaultValue: ENUM.THEMES[0],
    //   allowNull: false,
    // },
  },
  {
    tableName: TABLES.STORE.SETTING,
    timestamps: true,
  },
);
Store.hasOne(StoreSetting, { foreignKey: ID.FOREIGN_KEY.STORE, as: MODELS.STORE.SETTING });

export const StoreLink = sequelize.define<Tables["StoreLink"]>(
  MODELS.STORE.LINK,
  {
    [ID.PRIMARY_KEY.ID]: {
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
    [ID.FOREIGN_KEY.STORE]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Store,
        key: "id",
      },
    },
  },
  {
    tableName: TABLES.STORE.LINK,
    timestamps: true,
    paranoid: true,
  },
);
Store.hasMany(StoreLink, { foreignKey: ID.FOREIGN_KEY.STORE, as: MODELS.STORE.LINK });

export const StoreViewer = sequelize.define<Tables["StoreViewer"]>(
  MODELS.STORE.VIEWER,
  {
    [ID.PRIMARY_KEY.ID]: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      allowNull: true,
      primaryKey: true,
    },
    ip: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    [ID.FOREIGN_KEY.USER]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    [ID.FOREIGN_KEY.STORE]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Store,
        key: "id",
      },
    },
  },
  { tableName: TABLES.STORE.VIEWER, createdAt: true, updatedAt: false },
);
Store.hasMany(StoreViewer, { foreignKey: ID.FOREIGN_KEY.STORE, as: MODELS.STORE.VIEWER });
User.hasMany(StoreViewer, { foreignKey: ID.FOREIGN_KEY.USER, as: MODELS.STORE.SETTING });

export const Category = sequelize.define<Tables["Category"]>(
  MODELS.CATEGORY.MODEL,
  {
    [ID.PRIMARY_KEY.ID]: {
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
    [ID.FOREIGN_KEY.STORE]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Store,
        key: "id",
      },
    },
  },
  {
    tableName: TABLES.CATEGORY.TABLE,
    timestamps: true,
    paranoid: true,
  },
);
Store.hasMany(Category, { foreignKey: ID.FOREIGN_KEY.STORE, as: MODELS.CATEGORY.MODEL });
Category.addHook("afterDestroy", async (category) => {
  await Promise.all([Product.destroy({ force: false, where: { categoryId: category.dataValues.id } })]);
});

export const CategoryViewer = sequelize.define<Tables["CategoryViewer"]>(
  MODELS.CATEGORY.VIEWER,
  {
    [ID.PRIMARY_KEY.ID]: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      allowNull: true,
      primaryKey: true,
    },
    ip: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    [ID.FOREIGN_KEY.USER]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    [ID.FOREIGN_KEY.CATEGORY]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  { tableName: TABLES.CATEGORY.VIEWER, createdAt: true, updatedAt: false },
);
Category.hasMany(CategoryViewer, { foreignKey: ID.FOREIGN_KEY.CATEGORY, as: MODELS.CATEGORY.VIEWER });
User.hasMany(CategoryViewer, { foreignKey: ID.FOREIGN_KEY.USER, as: MODELS.CATEGORY.VIEWER });

export const Product = sequelize.define<Tables["Product"]>(
  MODELS.PRODUCT.MODEL,
  {
    [ID.PRIMARY_KEY.ID]: {
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
    [ID.FOREIGN_KEY.CATEGORY]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    tableName: TABLES.PRODUCT.TABLE,
    timestamps: true,
    paranoid: true,
  },
);
Product.belongsTo(Category, { foreignKey: ID.FOREIGN_KEY.CATEGORY, as: MODELS.CATEGORY.MODEL });
Category.hasMany(Product, { foreignKey: ID.FOREIGN_KEY.CATEGORY, as: MODELS.PRODUCT.MODEL });
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
  MODELS.PRODUCT.INFO,
  {
    [ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
    },
    info: {
      type: DataTypes.STRING(MAX.PRODUCT.INFO),
      allowNull: false,
    },
    infoAr: {
      type: DataTypes.STRING(MAX.PRODUCT.INFO),
      allowNull: false,
    },
    [ID.FOREIGN_KEY.PRODUCT]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    tableName: TABLES.PRODUCT.INFO,
    timestamps: true,
    paranoid: true,
  },
);
Product.hasMany(ProductInfo, { foreignKey: ID.FOREIGN_KEY.PRODUCT, as: MODELS.PRODUCT.INFO });

export const ProductImage = sequelize.define<Tables["ProductImage"]>(
  MODELS.PRODUCT.IMAGE,
  {
    [ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING(MAX.IMAGE),
      allowNull: false,
    },
    [ID.FOREIGN_KEY.PRODUCT]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    tableName: TABLES.PRODUCT.IMAGE,
    createdAt: true,
    updatedAt: false,
    paranoid: true,
  },
);
Product.hasMany(ProductImage, { foreignKey: ID.FOREIGN_KEY.PRODUCT, as: MODELS.PRODUCT.IMAGE });

export const ProductRating = sequelize.define<Tables["ProductRating"]>(
  MODELS.PRODUCT.RATING,
  {
    [ID.FOREIGN_KEY.USER]: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    [ID.FOREIGN_KEY.PRODUCT]: {
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
    tableName: TABLES.PRODUCT.RATING,
    timestamps: true,
    paranoid: true,
  },
);
Product.hasMany(ProductRating, { foreignKey: ID.FOREIGN_KEY.PRODUCT, as: MODELS.PRODUCT.RATING });
User.hasMany(ProductRating, { foreignKey: ID.FOREIGN_KEY.USER, as: MODELS.PRODUCT.RATING });

export const ProductSize = sequelize.define<Tables["ProductSize"]>(
  MODELS.PRODUCT.SIZE,
  {
    [ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
    },
    size: {
      type: DataTypes.STRING(MAX.PRODUCT.SIZE),
      validate: {
        is: /\b((xs|s|m|l|xl)|([2-9](xs|xl)))\b/i,
      },
      allowNull: false,
    },
    [ID.FOREIGN_KEY.PRODUCT]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    tableName: TABLES.PRODUCT.SIZE,
    createdAt: true,
    updatedAt: false,
    paranoid: true,
  },
);
Product.hasMany(ProductSize, { foreignKey: ID.FOREIGN_KEY.PRODUCT, as: MODELS.PRODUCT.SIZE });

export const ProductColor = sequelize.define<Tables["ProductColor"]>(
  MODELS.PRODUCT.COLOR,
  {
    [ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
    },
    color: {
      type: DataTypes.STRING(MAX.PRODUCT.COLOR),
      allowNull: false,
    },
    [ID.FOREIGN_KEY.PRODUCT]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    tableName: TABLES.PRODUCT.COLOR,
    createdAt: true,
    updatedAt: false,
    paranoid: true,
  },
);
Product.hasMany(ProductColor, { foreignKey: ID.FOREIGN_KEY.PRODUCT, as: MODELS.PRODUCT.COLOR });

export const ProductViewer = sequelize.define<Tables["ProductViewer"]>(
  MODELS.PRODUCT.VIEWER,
  {
    [ID.PRIMARY_KEY.ID]: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    ip: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    [ID.FOREIGN_KEY.USER]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    [ID.FOREIGN_KEY.PRODUCT]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  { tableName: TABLES.PRODUCT.VIEWER, createdAt: true, updatedAt: false },
);
Product.hasMany(ProductViewer, { foreignKey: ID.FOREIGN_KEY.PRODUCT, as: MODELS.PRODUCT.VIEWER });
User.hasMany(ProductViewer, { foreignKey: ID.FOREIGN_KEY.PRODUCT, as: MODELS.PRODUCT.VIEWER });

export const Tag = sequelize.define<Tables["Tag"]>(
  MODELS.TAG,
  {
    [ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    tag: {
      type: DataTypes.STRING(MAX.TAG),
      unique: true,
      allowNull: false,
    },
    [ID.FOREIGN_KEY.STORE]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Store,
        key: "id",
      },
    },
  },
  {
    tableName: TABLES.TAG,
    createdAt: true,
    updatedAt: false,
  },
);
Store.hasMany(Tag, { foreignKey: ID.FOREIGN_KEY.STORE, as: MODELS.TAG });
Tag.addHook("afterDestroy", async (tag) => {
  await Promise.all([ProductTag.destroy({ force: false, where: { tagId: tag.dataValues.id } })]);
});

export const ProductTag = sequelize.define<Tables["ProductTag"]>(
  MODELS.PRODUCT.TAG,
  {
    [ID.PRIMARY_KEY.ID]: {
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
    },
    [ID.FOREIGN_KEY.TAG]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Tag,
        key: "id",
      },
    },
    [ID.FOREIGN_KEY.PRODUCT]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    tableName: TABLES.PRODUCT.TAG,
    createdAt: true,
    updatedAt: false,
    paranoid: true,
  },
);
Product.hasMany(ProductTag, { foreignKey: ID.FOREIGN_KEY.PRODUCT, as: MODELS.PRODUCT.TAG });
Tag.hasMany(ProductTag, { foreignKey: ID.FOREIGN_KEY.TAG, as: MODELS.PRODUCT.TAG });

export const Order = sequelize.define<Tables["Order"]>(
  MODELS.ORDER,
  {
    [ID.PRIMARY_KEY.ID]: {
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
    [ID.FOREIGN_KEY.USER]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    [ID.FOREIGN_KEY.PRODUCT]: {
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
    tableName: TABLES.ORDER,
    timestamps: true,
  },
);
Product.hasMany(Order, { foreignKey: ID.FOREIGN_KEY.PRODUCT, as: MODELS.ORDER });
User.hasMany(Order, { foreignKey: ID.FOREIGN_KEY.USER, as: MODELS.ORDER });

export const ResponseTime = sequelize.define<Tables["ResponseTime"]>(
  MODELS.RESPONSE_TIME,
  {
    [ID.PRIMARY_KEY.ID]: {
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
  { tableName: TABLES.RESPONSE_TIME, timestamps: false, paranoid: false },
);

export const ServerError = sequelize.define<Tables["ServerError"]>(
  MODELS.SERVER_ERROR,
  {
    [ID.PRIMARY_KEY.ID]: {
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
  { tableName: TABLES.SERVER_ERROR, timestamps: true },
);
