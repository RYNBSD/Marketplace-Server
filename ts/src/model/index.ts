import * as db from "./db.js";
import * as fn from "./fn.js";
import query from "./query/index.js";

export const model = { db, fn, query } as const;
