import api from "./api/index.js";
import security from "./security/index.js";
import * as fn from "./fn.js";

export const middleware = { api, security, fn } as const;
