import type { Tables } from "../types/index.js";
import { DataTypes } from "sequelize";
import { ENUM, KEYS, VALUES } from "../constant/index.js";

const { DB } = KEYS;
const { MAX } = VALUES.LENGTH;

export const User = sequelize.define<Tables["User"]>(
  "user",
  {
    id: {
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
  }
);

export const UserSetting = sequelize.define<Tables["UserSetting"]>(
  "user-setting",
  {
    userId: {
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
  }
);

export const Store = sequelize.define<Tables["Store"]>(
  "seller",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(MAX.SELLER.STORE_NAME),
      unique: true,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(MAX.IMAGE),
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { tableName: DB.TABLES.SELLER.TABLE, timestamps: true, paranoid: true }
);

export const StoreSetting = sequelize.define<Tables["StoreSetting"]>(
  "seller-setting",
  {
    storeId: {
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
    tableName: DB.TABLES.SELLER.SETTING,
    timestamps: true,
  }
);

export const StoreLink = sequelize.define<Tables["StoreLink"]>(
  "seller-link",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    platform: {
      type: DataTypes.ENUM(...ENUM.PLATFORMS),
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING(MAX.SELLER.LINK),
      allowNull: false,
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Store,
        key: "id",
      },
    },
  },
  {
    tableName: DB.TABLES.SELLER.LINK,
    timestamps: true,
    paranoid: true,
  }
);

export const StoreViewer = sequelize.define<Tables["StoreViewer"]>(
  "seller-viewer",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Store,
        key: "id",
      },
    },
  },
  { tableName: DB.TABLES.SELLER.VIEWER, createdAt: true, updatedAt: false }
);

export const Category = sequelize.define<Tables["Category"]>(
  "category",
  {
    id: {
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
    storeId: {
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
  }
);

export const CategoryViewer = sequelize.define<Tables["CategoryViewer"]>(
  "category-viewer",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  { tableName: DB.TABLES.CATEGORY.VIEWER, createdAt: true, updatedAt: false }
);

export const Product = sequelize.define<Tables["Product"]>(
  "product",
  {
    id: {
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
    categoryId: {
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
  }
);

export const ProductInfo = sequelize.define<Tables["ProductInfo"]>(
  "product-info",
  {
    id: {
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
    productId: {
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
  }
);

export const ProductImage = sequelize.define<Tables["ProductImage"]>(
  "product-image",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    image: {
      type: DataTypes.STRING(MAX.IMAGE),
      allowNull: false,
    },
    productId: {
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
  }
);

export const ProductRating = sequelize.define<Tables["ProductRating"]>(
  "product-rating",
  {
    userId: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    productId: {
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
  }
);

export const ProductSize = sequelize.define<Tables["ProductSize"]>(
  "product-size",
  {
    id: {
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
    productId: {
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
  }
);

export const ProductColor = sequelize.define<Tables["ProductColor"]>(
  "product-color",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    color: {
      type: DataTypes.STRING(MAX.PRODUCT.COLOR),
      allowNull: false,
    },
    productId: {
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
  }
);

export const ProductViewer = sequelize.define<Tables["ProductViewer"]>(
  "product-viewer",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  { tableName: DB.TABLES.PRODUCT.VIEWER, createdAt: true, updatedAt: false }
);

export const Tag = sequelize.define<Tables["Tag"]>(
  "tag",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    tag: {
      type: DataTypes.STRING(MAX.TAG),
      allowNull: false,
    },
    storeId: {
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
  }
);

export const ProductTag = sequelize.define<Tables["ProductTag"]>(
  "product-tag",
  {
    tagId: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Tag,
        key: "id",
      },
    },
    productId: {
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
  }
);

export const Order = sequelize.define<Tables["Order"]>(
  "order",
  {
    id: {
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    productId: {
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
  }
);

export const ResponseTime = sequelize.define<Tables["ResponseTime"]>(
  "response-time",
  {
    id: {
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
  { tableName: DB.TABLES.RESPONSE_TIME, timestamps: false, paranoid: false }
);

export const ServerError = sequelize.define<Tables["ServerError"]>(
  "server-error",
  {
    id: {
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
      allowNull: false
    },
    handler: {
      type: DataTypes.ENUM(...KEYS.ERROR.HANDLERS),
      allowNull: false
    }
  },
  { tableName: DB.TABLES.SERVER_ERROR, timestamps: true }
);
