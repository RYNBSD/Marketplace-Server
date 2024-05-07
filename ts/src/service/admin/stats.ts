import { QueryTypes, type Transaction } from "sequelize";

export async function users(transaction: Transaction) {
  return sequelize.query(
    `
  SELECT COUNT("id") AS "users", "createdAt" FROM "User"
  GROUP BY "createdAt"
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      transaction,
    },
  );
}

export async function stores(transaction: Transaction) {
  return sequelize.query(
    `
  SELECT COUNT("id") AS "stores", "createdAt" FROM "Store"
  GROUP BY "createdAt"
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      transaction,
    },
  );
}
