import { QueryTypes, type Transaction } from "sequelize";

export async function users(transaction: Transaction) {
  return sequelize.query(
    `
  SELECT COUNT("id") AS "users", date_trunc('day', "createdAt")::date AS "createdAt" FROM "User"
  GROUP BY date_trunc('day', "createdAt")::date
  ORDER BY date_trunc('day', "createdAt")::date DESC
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
  ORDER BY date_trunc('day', "createdAt")::date DESC
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      transaction,
    },
  );
}

export async function orders(transaction: Transaction) {
  return sequelize.query(
    `
  SELECT COUNT("id") AS "orders", date_trunc('day', "createdAt")::date AS "createdAt" FROM "Order"
  GROUP BY date_trunc('day', "createdAt")::date
  ORDER BY date_trunc('day', "createdAt")::date DESC
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      transaction,
    },
  );
}

export async function products(transaction: Transaction) {
  return sequelize.query(
    `
    SELECT COUNT("id") AS "products", date_trunc('day', "createdAt")::date AS "createdAt" FROM "Product"
    GROUP BY date_trunc('day', "createdAt")::date
    ORDER BY date_trunc('day', "createdAt")::date DESC
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      transaction,
    },
  );
}

export async function categories(transaction: Transaction) {
  return sequelize.query(
    `
    SELECT COUNT("id") AS "categories", date_trunc('day', "createdAt")::date AS "createdAt" FROM "Category"
    GROUP BY date_trunc('day', "createdAt")::date
    ORDER BY date_trunc('day', "createdAt")::date DESC
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      transaction,
    },
  );
}
