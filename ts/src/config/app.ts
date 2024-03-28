import type session from "express-session";
import SessionStore from "connect-mongodb-session";
import RateLimit from "express-rate-limit";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import LimiterStore from "rate-limit-mongo";
import { ENV, KEYS, VALUES } from "../constant/index.js";
import { cookieOptions } from "./options.js";

const { MONGO } = ENV;
const { COLLECTIONS } = KEYS.DB;
const { TIME } = VALUES;

export default {
  initLimiter() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return RateLimit({
      store: new LimiterStore({
        uri: MONGO.URI,
        collectionName: COLLECTIONS.RATE_LIMIT,
        user: "",
        password: "",
        expireTimeMs: 15 * 60 * 1000,
        errorHandler: console.error.bind(null, "rate-limit-mongo"),
      }),
      limit: 100,
      windowMs: TIME.MINUTE,
    });
  },
  initSession(s: typeof session) {
    const MongoStore = SessionStore(s);

    const store = new MongoStore({
      uri: MONGO.URI,
      collection: COLLECTIONS.SESSION,
      expires: cookieOptions.maxAge,
    });

    store.on("error", (error) => {
      throw error;
    });

    return { sessionStore: store };
  },
} as const;
