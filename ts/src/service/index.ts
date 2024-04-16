import * as store from "./store.js";
import * as product from "./product.js";
import * as category from "./category.js";

export const service = { store, category, product } as const;
