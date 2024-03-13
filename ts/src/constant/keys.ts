export default {
  HTTP: {
    HEADERS: {
      CSRF: "X-CSRF-Token",
      JWT: "X-JWT-Token",
      ACCESS_TOKEN: "Access-Token",
      METHOD_OVERRIDE: "X-HTTP-Method-Override",
      RESPONSE_TIME: "X-Response-Time",
      NO_COMPRESSION: "No-Compression",
    },
  },
  COOKIE: {
    JWT: "authorization",
  },
  GLOBAL: {
    PUBLIC: "public",
    UPLOAD: "upload",
  },
  UPLOAD: {
    IMAGE: "image",
    IMAGES: "images",
    VIDEOS: "videos",
  },
  ERROR: {
    HANDLERS: ["controller", "middleware", "socket", "server", "passport"],
  },
  DB: {
    CASCADE: "CASCADE",
    TABLES: {
      USER: {
        TABLE: "User",
        SETTING: "UserSetting",
      },
      SELLER: {
        TABLE: "Store",
        SETTING: "StoreSetting",
        LINK: "StoreLink",
        VIEWER: "StoreViewer",
      },
      CATEGORY: {
        TABLE: "Category",
        VIEWER: "CategoryViewer",
      },
      PRODUCT: {
        TABLE: "Product",
        INFO: "ProductInfo",
        IMAGE: "ProductImage",
        RATING: "ProductRating",
        SIZE: "ProductSize",
        COLOR: "ProductColor",
        VIEWER: "ProductViewer",
        TAG: "ProductTag",
      },
      TAG: "Tag",
      ORDER: "Order",
      RESPONSE_TIME: "ResponseTime",
      SERVER_ERROR: "ServerError",
    },
    // MODELS: {
    //   USER: "user",
    //   USER_SETTING: "user-setting",
    //   SELLER: "seller",
    //   SELLER_SETTING: "seller-setting",
    //   SELLER_LINK: "",
    // }
  },
  REQUEST: {
    PARAMS: {
      ID: {
        USER: "userId",
        STORE: "storeId",
        CATEGORY: "categoryId",
        PRODUCT: "productId",
        ORDER: "orderId",
        CUSTOMER: "customerId",
      },
    },
  },
} as const;
