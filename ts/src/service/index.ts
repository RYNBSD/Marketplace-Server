// import * as store from "./store.js";
import admin from "./admin/index.js";
import store from "./store/index.js";
import * as product from "./product.js";
import * as category from "./category.js";
import * as order from "./order/index.js";

export const service = { store, category, product, order, admin } as const;
