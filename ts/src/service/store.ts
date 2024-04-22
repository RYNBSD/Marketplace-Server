import { QueryTypes } from "sequelize";

export async function all() {
  return sequelize.query(``, {
    type: QueryTypes.SELECT,
    raw: true,
    bind: {},
  });
}

// export async function one(id: string) {
//   return sequelize.query(``, {
//     type: QueryTypes.SELECT,
//     raw: true,
//     bind: {},
//   });
// }
