import passport from "passport";
import { localStrategy } from "./local.js";
import { bearerStrategy } from "./bearer.js";
import { model } from "../model/index.js";

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id: string, done) => {
  const { User } = model.db;
  User.findOne({
    attributes: ["id"],
    where: { id },
    limit: 1,
    plain: true,
  })
    .then((user) => {
      if (user === null) return done(null, false);
      done(null, { id: user.dataValues.id });
    })
    .catch(done);
});

passport.use(localStrategy);
passport.use(bearerStrategy);

export { passport };
