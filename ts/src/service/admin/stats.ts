import { QueryTypes, type Transaction } from "sequelize";

export async function users(transaction: Transaction) {
  return sequelize.query(
    `
  SELECT COUNT("id") AS "users", date_trunc('day', "createdAt")::date AS "createdAt" FROM "User"
  GROUP BY date_trunc('day', "createdAt")::date
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
  SELECT COUNT("id") AS "stores", date_trunc('day', "createdAt")::date AS "createdAt" FROM "Store"
  GROUP BY date_trunc('day', "createdAt")::date
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      transaction,
    },
  );
}
