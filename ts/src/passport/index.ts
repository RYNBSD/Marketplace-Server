import passport from "passport";
import { localStrategy } from "./local.js";
import { bearerStrategy } from "./bearer.js";
import { model } from "../model/index.js";
import { schema } from "../schema/index.js";

const { isUUID } = schema.validators;

passport.serializeUser((user, done) => done(null, user.dataValues.id));

passport.deserializeUser((id: string, done) => {
  const userId = isUUID.safeParse(id);
  if (!userId.success) return done(null, false);

  const { User } = model.db;
  User.findOne({
    where: { id: userId.data },
    limit: 1,
    plain: true,
  })
    .then((user) => {
      if (user === null) return done(null, false);
      done(null, user);
    })
    .catch(done);
});

passport.use(localStrategy);
passport.use(bearerStrategy);

export { passport };
