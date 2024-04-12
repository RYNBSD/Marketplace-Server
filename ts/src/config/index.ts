import { upload } from "./upload.js";
import db from "./db.js";
import tmp from "./tmp.js";
import app from "./app.js";
import swagger from "./swagger.js";
import * as options from "./options.js";

export const config = { upload, db, tmp, app, swagger, options } as const;
