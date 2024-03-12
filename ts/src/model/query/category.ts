import { QueryTypes } from "sequelize";
import { schema } from "../../schema/index.js";

const { isUUID } = schema.validators;

export async function withProductsCount(storeId: string, desc = true) {
  const parsedId = isUUID.parse(storeId);

  return sequelize.query<{
    id: string;
    name: string;
    nameAr: string;
    image: string;
    count: number;
  }>(
    `
    SELECT "Category"."id", "name", "nameAr", "image", COUNT("Product"."id") AS "count"
    FROM "Category"
    INNER JOIN "Product" ON "Product"."categoryId" = "Category"."id"
    WHERE "Category"."sellerId" = $storeId
    GROUP BY "Category"."id"
    ORDER BY "count" ${desc ? "DESC" : "ASC"}
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      bind: {
        sellerId: parsedId,
      },
    }
  );
}
