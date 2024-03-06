// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { SessionData } from "express-session";
import type { z } from "zod";
import type { schema } from "../schema/index.js";

const { session } = schema;

type Csrf = { csrf: z.infer<typeof session.Csrf> };
type User = { user: z.infer<typeof session.User> };
type Access = { access: z.infer<typeof session.Access> };

declare module "express-session" {
  interface SessionData extends Csrf, User, Access {}
}
