import { QueryTypes } from "sequelize";

export async function all(storeId: string) {
  return sequelize.query(
    `SELECT "C"."name", "C"."nameAr", "C"."image"
    FROM "Category" AS "C"
    WHERE "C"."storeId" = $storeId`,
    {
      type: QueryTypes.SELECT,
      raw: true,
      bind: { storeId },
    },
  );
}

export async function one(id: string) {
  return sequelize.query(
    `SELECT "C"."name", "C"."nameAr", "C"."image"
    FROM "Category" AS "C"
    WHERE "C"."id" = $id
    LIMIT 1`,
    {
      type: QueryTypes.SELECT,
      raw: true,
      plain: true,
      bind: { id },
    },
  );
}

export async function products(categoryId: string) {
  return sequelize.query(
    `SELECT "P"."id", "P"."title", "P"."description", "P"."titleAr","P"."descriptionAr", ARRAY_AGG("PI"."image") AS "images"
    FROM "Product" AS "P"
    INNER JOIN "ProductImage" AS "PI" ON "PI"."productId" = "P"."id"
    WHERE "P"."categoryId" = $categoryId
    GROUP BY "P"."id"`,
    {
      type: QueryTypes.SELECT,
      raw: true,
      bind: { categoryId },
    },
  );
}
