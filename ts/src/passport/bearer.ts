import { Strategy as BearerStrategy } from "passport-http-bearer";
import { util } from "../util/index.js";
import { APIError } from "../error/index.js";
import { StatusCodes } from "http-status-codes";
import { model } from "../model/index.js";
import { schema } from "../schema/index.js";

export const bearerStrategy = new BearerStrategy((token, done) => {
  const { verify } = util.jwt;
  const userId = verify(token) as string | null;
  if (userId === null)
    return done(APIError.passport(StatusCodes.BAD_REQUEST, "Invalid token"));

  const { isUUID } = schema.validators;
  const parsedId = isUUID.safeParse(userId);
  if (!parsedId.success)
    return done(
      APIError.passport(StatusCodes.BAD_REQUEST, parsedId.error.message)
    );

  const { User } = model.db;
  User.findOne({
    attributes: ["id", "username", "image"],
    where: { id: parsedId.data },
    limit: 1,
    plain: true,
  })
    .then((user) => {
      if (user === null)
        return done(APIError.passport(StatusCodes.NOT_FOUND, "User not found"));
      return done(null, user.dataValues);
    })
    .catch(done);
});
