export default {
  HTTP: {
    HEADERS: {
      CSRF: "X-CSRF-Token",
      JWT: "X-JWT-Token",
      ACCESS_TOKEN: "Access-Token",
      METHOD_OVERRIDE: "X-HTTP-Method-Override",
    },
  },
  COOKIE: {
    JWT: "authorization",
  },
  GLOBAL: {
    PUBLIC: "public",
    UPLOAD: "upload",
    IMAGE: "image",
  },
  ERROR: {
    HANDLERS: ["controller", "middleware", "socket", "server"]
  }
} as const;
