import { QueryTypes, type Transaction } from "sequelize";

export async function categories(storeId: string, transaction: Transaction) {
  return sequelize.query(
    `
  SELECT COUNT("id") AS "categories", date_trunc('day', "createdAt")::date AS "createdAt" FROM "Category"
  WHERE "storeId" = $storeId
  GROUP BY date_trunc('day', "createdAt")::date
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      bind: { storeId },
      transaction,
    },
  );
}

export async function products(storeId: string, transaction: Transaction) {
  return sequelize.query(
    `
    SELECT COUNT("P"."id") AS "products", date_trunc('day', "P"."createdAt")::date AS "createdAt" FROM "Product" "P"
    INNER JOIN "Category" "C" ON "C"."id" = "P"."categoryId" AND "C"."storeId"  = $storeId
    GROUP BY date_trunc('day', "P"."createdAt")::date
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      bind: { storeId },
      transaction,
    },
  );
}

export async function orders(storeId: string, transaction: Transaction) {
  return sequelize.query(``, {
    type: QueryTypes.SELECT,
    raw: true,
    bind: { storeId },
    transaction,
  });
}
