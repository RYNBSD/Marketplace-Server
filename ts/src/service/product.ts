import { QueryTypes, type Transaction } from "sequelize";

export async function all(storeId: string, transaction: Transaction) {
  return sequelize.query(
    `
    SELECT "P"."id", "P"."title", "P"."titleAr",
    ARRAY_AGG(DISTINCT "PI"."image") AS "images", COUNT("PV"."id") as "views", COUNT("O"."id") AS "orders"
    FROM "Product" "P"
    INNER JOIN "ProductImage" "PI" ON "PI"."productId" = "P"."id"
    INNER JOIN "Category" "C" ON "C"."id" = "P"."categoryId"
    LEFT JOIN "ProductViewer" "PV" ON "PV"."productId" = "P"."id"
    LEFT JOIN "Order" "O" ON "O"."productId" = "P"."id"
    WHERE "P"."deletedAt" IS NULL AND "PI"."deletedAt" IS NULL AND "C"."deletedAt" IS NULL AND
    "C"."storeId" = $storeId
    GROUP BY "P"."id"
    ORDER BY "P"."createdAt" DESC
  `,
    {
      type: QueryTypes.SELECT,
      bind: { storeId: storeId },
      raw: true,
      transaction,
    },
  );
}

export async function one(id: string, transaction: Transaction) {
  return sequelize.query(
    `SELECT "P"."id" AS "product.id", "P"."title" AS "product.title", "P"."titleAr" AS "product.titleAr",
    "P"."description" AS "product.description", "P"."descriptionAr" AS "product.descriptionAr",
    "P"."quality" AS "product.quality", "P"."stock" AS "product.stock", "P"."model" AS "product.model",
    "P"."price" AS "product.price", "P"."discount" AS "product.discount",
    ARRAY_AGG(DISTINCT "PI"."image") AS "product.images", ARRAY_AGG(DISTINCT "PIn"."info") AS "product.infos", ARRAY_AGG(DISTINCT "PIn"."infoAr") AS "product.infosAr",
    ARRAY_AGG(DISTINCT "PC"."color") AS "product.colors", ARRAY_AGG(DISTINCT "PS"."size") AS "product.sizes", ARRAY_AGG(DISTINCT "T"."tag") AS "product.tags",
    "C"."id" AS "category.id", "C"."name" AS "category.name", "C"."nameAr" AS "category.nameAr", "C"."image" AS "category.image"
    FROM "Product" AS "P"
    INNER JOIN "Category" AS "C" ON "C"."id" = "P"."categoryId"
    INNER JOIN "ProductImage" AS "PI" ON "PI"."productId" = "P"."id"
    LEFT JOIN "ProductTag" AS "PT" ON "PT"."productId" = "P"."id"
    LEFT JOIN "ProductColor" AS "PC" ON "PC"."productId" = "P"."id"
    LEFT JOIN "ProductSize" AS "PS" ON "PS"."productId" = "P"."id"
    LEFT JOIN "ProductInfo" AS "PIn" ON "PIn"."productId" = "P"."id"
    LEFT JOIN "Tag" AS "T" ON "T"."id" = "PT"."tagId"
    WHERE "P"."id" = $id AND "P"."deletedAt" IS NULL AND "C"."deletedAt" IS NULL
    AND "PI"."deletedAt" IS NULL AND "PT"."deletedAt" IS NULL AND "PC"."deletedAt" IS NULL  AND "PS"."deletedAt" IS NULL
    AND "PIn"."deletedAt" IS NULL
    GROUP BY "P"."id", "C"."id"
    LIMIT 1`,
    {
      type: QueryTypes.SELECT,
      bind: { id },
      raw: true,
      nest: true,
      plain: true,
      transaction,
    },
  );
}

export async function viewers(productId: string, transaction: Transaction) {
  return sequelize.query(
    `SELECT "U"."id", "U"."username", "U"."image", COUNT("U"."id") AS "views"
    FROM "User" AS "U"
    INNER JOIN "ProductViewer" AS "PV" ON "PV"."userId" = "U"."id"
    WHERE "PV"."productId" = $productId AND "U"."deletedAt" IS NULL
    GROUP BY "U"."id"`,
    { type: QueryTypes.SELECT, bind: { productId }, raw: true, transaction },
  );
}

export async function orders() {}
