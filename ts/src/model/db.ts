import { DataTypes } from "sequelize";
import type { Tables } from "../types/index.js";
import { ENUM } from "../constant/index.js";

export const User = sequelize.define<Tables["User"]>(
  "user",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    emailVerified: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(72),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "User",
    timestamps: true,
    paranoid: true,
  }
);

export const UserSettings = sequelize.define<Tables["UserSettings"]>(
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
    tableName: "UserSetting",
    timestamps: true,
  }
);

export const Seller = sequelize.define<Tables["Seller"]>(
  "seller",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    storeName: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
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
  { tableName: "Seller", timestamps: true, paranoid: true }
);

export const SellerSettings = sequelize.define<Tables["SellerSettings"]>(
  "seller-setting",
  {
    sellerId: {
      primaryKey: true,
      type: DataTypes.UUID,
      references: {
        model: Seller,
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
    tableName: "SellerSetting",
    timestamps: true,
  }
);

export const SellerLinks = sequelize.define<Tables["SellerLinks"]>(
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
      type: DataTypes.STRING(75),
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Seller,
        key: "id",
      },
    },
  },
  {
    tableName: "SellerLink",
    timestamps: true,
    paranoid: true,
  }
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
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    nameAr: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Seller,
        key: "id",
      },
    },
  },
  {
    tableName: "Category",
    timestamps: true,
    paranoid: true,
  }
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
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    titleAr: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    descriptionAr: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stock: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(255),
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
    tableName: "Product",
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
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    infoAr: {
      type: DataTypes.STRING(50),
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
    tableName: "ProductInfo",
    timestamps: true,
    paranoid: true,
  }
);

export const ProductImages = sequelize.define<Tables["ProductImages"]>(
  "product-image",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    image: {
      type: DataTypes.STRING(255),
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
    tableName: "ProductImage",
    createdAt: true,
    updatedAt: false,
    paranoid: true,
  }
);

export const ProductRatings = sequelize.define<Tables["ProductRatings"]>(
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
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "ProductRating",
    timestamps: true,
    paranoid: true,
  }
);

export const ProductSizes = sequelize.define<Tables["ProductSizes"]>(
  "product-size",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    size: {
      type: DataTypes.STRING(10),
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
    tableName: "ProductSize",
    createdAt: true,
    updatedAt: false,
    paranoid: true,
  }
);

export const ProductColors = sequelize.define<Tables["ProductColors"]>(
  "product-color",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    color: {
      type: DataTypes.STRING(7),
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
    tableName: "ProductColor",
    createdAt: true,
    updatedAt: false,
    paranoid: true,
  }
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
      type: DataTypes.STRING(20),
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
  },
  {
    tableName: "Tag",
    createdAt: true,
    updatedAt: false,
  }
);

export const ProductTags = sequelize.define<Tables["ProductTags"]>(
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
  { tableName: "ProductTag", createdAt: true, updatedAt: false, paranoid: true }
);

export const Orders = sequelize.define<Tables["Orders"]>(
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
    tableName: "Order",
    timestamps: true,
  }
);
