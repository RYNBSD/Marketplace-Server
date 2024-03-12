import { QueryTypes } from "sequelize";
import { schema } from "../schema/index.js";

const { isUUID } = schema.validators;

export async function tableIndex(table: string, id: string) {
  const parsedId = isUUID.parse(id);

  const index = await sequelize.query<{ row_number: number }>(
    `
      SELECT row_number FROM (
        SELECT ROW_NUMBER() OVER() AS row_number, id FROM "$table"
      )
      WHERE id=$id
      LIMIT 1
    `,
    {
      type: QueryTypes.SELECT,
      plain: true,
      raw: true,
      bind: {
        table,
        id: parsedId,
      },
    }
  );

  return index?.row_number ?? 0;
}
