import { QueryTypes } from "sequelize";

export async function all(userId: string) {
  return sequelize.query(
    `
    SELECT "O"."id" AS "order.id", "O"."quantity" AS "order.quantity",
    "O"."totalPrice" AS "order.totalPrice", "O"."status" AS "order.status",
    "P"."id" AS "product.id", "P"."title" AS "product.title",
    "P"."titleAr" AS "product.titleAr", "P"."description" AS "product.description", 
    "P"."descriptionAr" AS "product.descriptionAr",
    ARRAY_AGG(DISTINCT "PI"."image") AS "product.images"
    FROM "Order" "O"
    INNER JOIN "Product" "P" ON "P"."id" = "O"."productId"
    INNER JOIN "ProductImage" "PI" ON "PI"."productId" = "P"."id"
    WHERE "O"."userId" = $userId
    GROUP BY "O"."id", "P"."id"
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      nest: true,
      bind: { userId },
    },
  );
}

export async function one(id: number, userId: string) {
  return sequelize.query(
    `
    SELECT "O"."id" AS "order.id", "O"."quantity" AS "order.quantity",
    "O"."totalPrice" AS "order.totalPrice", "O"."status" AS "order.status",
    "P"."id" AS "product.id", "P"."title" AS "product.title",
    "P"."titleAr" AS "product.titleAr", "P"."description" AS "product.description", 
    "P"."descriptionAr" AS "product.descriptionAr",
    ARRAY_AGG(DISTINCT "PI"."image") AS "product.images"
    FROM "Order" "O"
    INNER JOIN "Product" "P" ON "P"."id" = "O"."productId"
    INNER JOIN "ProductImage" "PI" ON "PI"."productId" = "P"."id"
    WHERE "O"."id" = $id AND "O"."userId" = $userId
    GROUP BY "O"."id", "P"."id"
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      plain: true,
      nest: true,
      bind: { id, userId },
    },
  );
}
