import { QueryTypes, type Transaction } from "sequelize";

export async function all(storeId: string, transaction: Transaction) {
  return sequelize.query(
    `
    SELECT "C"."id", "C"."name", "C"."nameAr", "C"."image",
    COUNT("P"."id") AS "products", COUNT("CV"."id") AS "views"
    FROM "Category" "C"
    LEFT JOIN "CategoryViewer" "CV" ON "CV"."categoryId" = "C"."id"
    LEFT JOIN "Product" "P" ON "P"."categoryId" = "C"."id" AND "P"."deletedAt" IS NULL
    WHERE "C"."storeId" = $storeId AND "C"."deletedAt" IS NULL
    GROUP BY "C"."id"
    ORDER BY "C"."createdAt" DESC
    `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      bind: { storeId },
      transaction,
    },
  );
}

export async function one(id: string, transaction: Transaction) {
  return sequelize.query(
    `
    SELECT "C"."id", "C"."name", "C"."nameAr", "C"."image",
    COUNT("P"."id") AS "products", COUNT("CV"."id") AS "views"
    FROM "Category" "C"
    LEFT JOIN "CategoryViewer" "CV" ON "CV"."categoryId" = "C"."id"
    LEFT JOIN "Product" "P" ON "P"."categoryId" = "C"."id" AND "P"."deletedAt" IS NULL
    WHERE "C"."id" = $id AND "C"."deletedAt" IS NULL
    GROUP BY "C"."id"
    LIMIT 1
    `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      plain: true,
      bind: { id },
      transaction,
    },
  );
}

export async function products(categoryId: string, transaction: Transaction) {
  return sequelize.query(
    `
    SELECT "P"."id", "P"."title", "P"."titleAr",
    ARRAY_AGG(DISTINCT "PI"."image") AS "images", COUNT("PV"."id") as "views", COUNT("O"."id") AS "orders"
    FROM "Product" "P"
    INNER JOIN "ProductImage" "PI" ON "PI"."productId" = "P"."id"
    LEFT JOIN "ProductViewer" "PV" ON "PV"."productId" = "P"."id"
    LEFT JOIN "Order" "O" ON "O"."productId" = "P"."id"
    WHERE "P"."deletedAt" IS NULL AND "PI"."deletedAt" IS NULL AND "P"."categoryId" = $categoryId
    GROUP BY "P"."id"
    ORDER BY "P"."createdAt" DESC
    `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      bind: { categoryId },
      transaction,
    },
  );
}
