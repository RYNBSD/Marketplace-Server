import SessionStore from "connect-mongo";
import { rateLimit } from "express-rate-limit";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import LimiterStore from "rate-limit-mongo";
import { ENV, KEYS, VALUES } from "../constant/index.js";

const { URI } = ENV;
const { COLLECTIONS } = KEYS.CACHE;
const { TIME } = VALUES;

export default {
  initLimiter() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return rateLimit({
      store: new LimiterStore({
        uri: URI.MONGO,
        collectionName: COLLECTIONS.RATE_LIMIT,
        user: "",
        password: "",
        expireTimeMs: 15 * 60 * 1000,
        errorHandler: console.error.bind(null, "rate-limit-mongo"),
      }),
      limit: 1000,
      windowMs: TIME.MINUTE,
    });
  },
  initSession() {
    const store = SessionStore.create({
      mongoUrl: URI.MONGO,
      collectionName: COLLECTIONS.SESSION,
    });

    return store;
  },
} as const;
