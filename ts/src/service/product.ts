import { QueryTypes } from "sequelize";

export async function all(categoryId: string) {
  return sequelize.query<{
    id: string;
    title: string;
    description: string;
    titleAr: string;
    descriptionAr: string;
    images: string[];
  }>(
    `
  SELECT "P"."id", "P"."title", "P"."description", "P"."titleAr","P"."descriptionAr", ARRAY_AGG("PI"."image") AS "images"
  FROM "Product" as "P"
  INNER JOIN "ProductImage" as "PI" ON "PI"."productId" = "P"."id"
  WHERE "P"."categoryId" = $categoryId
  GROUP BY "P"."id"
  `,
    {
      type: QueryTypes.SELECT,
      bind: { categoryId },
      raw: true,
      nest: true,
    },
  );
}
