import { QueryTypes } from "sequelize";

export async function all(storeId: string) {
  return sequelize.query(
    `
    SELECT "P"."id", "P"."title", "P"."description", "P"."titleAr","P"."descriptionAr", ARRAY_AGG("PI"."image") AS "images"
    FROM "Product" AS "P"
    INNER JOIN "ProductImage" AS "PI" ON "PI"."productId" = "P"."id"
    INNER JOIN "Category" AS "C" ON "C"."id" = "P"."categoryId"
    WHERE "C"."storeId" = $storeId
    GROUP BY "P"."id"
  `,
    {
      type: QueryTypes.SELECT,
      bind: { storeId },
      raw: true,
    },
  );
}

export async function one(id: string) {
  return sequelize.query(
    `SELECT "P"."id" AS "product.id", "P"."title" AS "product.title", "P"."titleAr" AS "product.titleAr",
  "P"."description" AS "product.description", "P"."descriptionAr" AS "product.descriptionAr",
  "P"."quality" AS "product.quality", "P"."stock" AS "product.stock", "P"."model" AS "product.model",
  "P"."price" AS "product.price", "P"."discount" AS "product.discount",
  ARRAY_AGG("PI"."image") AS "product.images", ARRAY_AGG("PIn"."info") AS "product.infos", ARRAY_AGG("PIn"."infoAr") AS "product.infosAr",
  ARRAY_AGG("PC"."color") AS "product.colors", ARRAY_AGG("PS"."size") AS "product.sizes", ARRAY_AGG("T"."tag") AS "product.tags",
  "C"."id" AS "category.id", "C"."name" AS "category.name", "C"."nameAr" AS "category.nameAr", "C"."image" AS "category.image"
  FROM "Product" AS "P"
  INNER JOIN "Category" AS "C" ON "C"."id" = "P"."categoryId"
  INNER JOIN "ProductImage" AS "PI" ON "PI"."productId" = "P"."id"
  LEFT JOIN "ProductTag" AS "PT" ON "PT"."productId" = "P"."id"
  LEFT JOIN "ProductColor" AS "PC" ON "PC"."productId" = "P"."id"
  LEFT JOIN "ProductSize" AS "PS" ON "PS"."productId" = "P"."id"
  LEFT JOIN "ProductInfo" AS "PIn" ON "PIn"."productId" = "P"."id"
  INNER JOIN "Tag" AS "T" ON "T"."id" = "PT"."tagId"
  WHERE "P"."id" = $id
  GROUP BY "P"."id", "C"."id"
  LIMIT 1`,
    {
      type: QueryTypes.SELECT,
      bind: { id },
      raw: true,
      nest: true,
      plain: true,
    },
  );
}

export async function viewers(productId: string) {
  return sequelize.query(
    `SELECT "U"."id", "U"."username", "U"."image", COUNT("U"."id") AS "views"
  FROM "User" AS "U"
  INNER JOIN "ProductViewer" AS "PV" ON "PV"."userId" = "U"."id"
  WHERE "PV"."productId" = $productId
  GROUP BY "U"."id"`,
    { type: QueryTypes.SELECT, bind: { productId }, raw: true },
  );
}

export async function orders() {}
