import { DataTypes } from "sequelize";
import type { Tables } from "../types/index.js";
import { ENUM, VALUES } from "../constant/index.js";

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
      type: DataTypes.STRING(MAX.SELLER.LINK),
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

export const SellerViewers = sequelize.define<Tables["SellerViewers"]>(
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
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Seller,
        key: "id",
      },
    },
  },
  { tableName: "SellerViewer", createdAt: true, updatedAt: false }
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

export const CategoryViewers = sequelize.define<Tables["CategoryViewers"]>(
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
  { tableName: "CategoryViewer", createdAt: true, updatedAt: false }
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
      type: DataTypes.STRING(MAX.PRODUCT.COMMENT),
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
      type: DataTypes.STRING(MAX.PRODUCT.SIZE),
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
    tableName: "ProductColor",
    createdAt: true,
    updatedAt: false,
    paranoid: true,
  }
);

export const ProductViewers = sequelize.define<Tables["ProductViewers"]>(
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
  { tableName: "ProductViewer", createdAt: true, updatedAt: false }
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
