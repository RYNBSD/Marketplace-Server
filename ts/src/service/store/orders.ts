import { QueryTypes, type Transaction } from "sequelize";

export async function all(storeId: string, transaction: Transaction) {
  return sequelize.query(
    `
    SELECT "O"."id" AS "order.id", "O"."quantity" AS "order.quantity", "O"."totalPrice" AS "order.totalPrice", "O"."quantity" AS "order.quantity", "O"."status" AS "order.status",
  "P"."id" AS "product.id", "P"."title" AS "product.title", "P"."titleAr" AS "product.titleAr", "P"."description" AS "product.description",
  "P"."descriptionAr" AS "product.descriptionAr", ARRAY_AGG(DISTINCT "PI"."image") AS "product.images", "C"."storeId" AS "product.storeId"
  FROM "Order" "O"
  INNER JOIN "Product" "P" ON "P"."id" = "O"."productId"
  INNER JOIN "ProductImage" "PI" ON "PI"."productId" = "P"."id"
  INNER JOIN "Category" "C" ON "C"."id" = "P"."categoryId"
  WHERE "C"."storeId" = $storeId
  GROUP BY "O"."id", "P"."id", "C"."storeId"
  ORDER BY "O"."createdAt" DESC
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      nest: true,
      bind: { storeId },
      transaction,
    },
  );
}

export async function order(storeId: string, orderId: number, transaction: Transaction) {
  return sequelize.query(
    `
    SELECT "O"."id" AS "order.id", "O"."quantity" AS "order.quantity", "O"."totalPrice" AS "order.totalPrice", "O"."quantity" AS "order.quantity", "O"."status" AS "order.status",
  "P"."id" AS "product.id", "P"."title" AS "product.title", "P"."titleAr" AS "product.titleAr", "P"."description" AS "product.description",
  "P"."descriptionAr" AS "product.descriptionAr", ARRAY_AGG(DISTINCT "PI"."image") AS "product.images", "C"."storeId" AS "product.storeId"
  FROM "Order" "O"
  INNER JOIN "Product" "P" ON "P"."id" = "O"."productId"
  INNER JOIN "ProductImage" "PI" ON "PI"."productId" = "P"."id"
  INNER JOIN "Category" "C" ON "C"."id" = "P"."categoryId"
  WHERE "C"."storeId" = $storeId
  GROUP BY "O"."id", "P"."id", "C"."storeId"
  LIMIT 1
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      nest: true,
      plain: true,
      bind: { storeId, orderId },
      transaction,
    },
  );
}
