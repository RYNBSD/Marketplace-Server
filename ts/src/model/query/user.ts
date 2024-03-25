import { QueryTypes } from "sequelize";
import { schema } from "../../schema/index.js";
import { ENUM, VALUES } from "../../constant/index.js";

const { LENGTH } = VALUES;
const { ORDER_STATUS } = ENUM;
const { isUUID } = schema.validators;

export async function order(orderId: string) {
  const parsedId = isUUID.parse(orderId);

  return sequelize.query(``, {
    type: QueryTypes.SELECT,
    raw: false,
    bind: {
      parsedId,
    },
  });
}

type OrderFilter = (typeof ORDER_STATUS)[number];

export async function orders(userId: string, filter: OrderFilter | "all" = "all", offset = 0) {
  const parsedId = isUUID.parse(userId);

  return sequelize.query(
    `
    SELECT
      "Order"."quantity" AS "order.quantity",
      "Order"."totalPrice" AS "order.price",
      "Order"."status" AS "order.status",
      "Product"."title" AS "product.title",
      "Product"."titleAr" AS "product.titleAr",
      "Product"."price" AS "product.price",
      "Product"."discount" AS "product.discount",
      "Product"."description" AS "product.description",
      "Product"."descriptionAr" AS "product.descriptionAr",
      "ProductImage"."image" AS "product.image"
    FROM "Order"
    INNER JOIN "Product" ON "Product"."id" = "Order"."productId"
    INNER JOIN "ProductImage" ON "ProductImage"."productId" = "Product"."id"
    INNER JOIN "User" ON "User"."id" = "Order"."userId"
    WHERE "User"."id" = $id ${filter !== "all" ? 'AND "Order"."status" = $filter' : ""}
    LIMIT $limit OFFSET $offset
  `,
    {
      type: QueryTypes.SELECT,
      raw: true,
      bind: {
        id: parsedId,
        filter: filter === "all" ? "" : filter,
        limit: LENGTH.LIMIT,
        offset,
      },
    },
  );
}
