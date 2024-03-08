export default {
  TIME: {
    MILLISECONDS: 1,
    SECOND: 1000,
    MINUTE: 1000 * 60,
    HOUR: 1000 * 60 * 60,
    DAY: 1000 * 60 * 60 * 24,
    WEEK: 1000 * 60 * 60 * 24 * 7,
    MONTH: 1000 * 60 * 60 * 24 * 30,
    YEAR: 1000 * 60 * 60 * 24 * 30 * 12,
  },
  LENGTH: {
    PASSWORD: 8,
    MAX: {
      IMAGE: 255,
      TAG: 20,
      USER: {
        USERNAME: 50,
        EMAIL: 100,
        PASSWORD: 72,
      },
      SELLER: {
        STORE_NAME: 20,
        LINK: 75,
      },
      CATEGORY: {
        NAME: 30,
      },
      PRODUCT: {
        TITLE: 50,
        DESCRIPTION: 1000,
        MODEL: 255,
        COMMENT: 255,
        COLOR: 7,
        SIZE: 10,
        INFO: 50,
      },
    },
    MIN: {
      REQUIRED: 1, // Usually used with zod to indicate the this field is required
    },
  },
} as const;
