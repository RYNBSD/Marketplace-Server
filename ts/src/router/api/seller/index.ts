import { Router } from "express";

const [{ category }, { product }] = await Promise.all([
  import("./category.js"),
  import("./product.js"),
]);

export const seller = Router();

seller.put("/");

seller.delete("/")

seller.use("/", category, product);
