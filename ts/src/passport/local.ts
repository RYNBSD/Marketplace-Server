import { Strategy as LocalStrategy } from "passport-local";
import { model } from "../model/index.js";
import { util } from "../util/index.js";
import { APIError } from "../error/index.js";
import { StatusCodes } from "http-status-codes";

export const localStrategy = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  (email, password, done) => {
    const { User } = model.db;

    User.findOne({
      attributes: ["id", "password", "image", "username"],
      where: { email },
      limit: 1,
      plain: true,
    })
      .then((user) => {
        if (user === null)
          return done(
            APIError.passport(StatusCodes.NOT_FOUND, "User not found")
          );

        const { compare } = util.bcrypt;
        if (!compare(password, user.dataValues.password))
          return done(
            APIError.passport(StatusCodes.UNAUTHORIZED, "Invalid password")
          );

        return done(null, user);
      })
      .catch(done);
  }
);
