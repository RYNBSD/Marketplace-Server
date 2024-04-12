import api from "./api/index.js";
import security from "./security/index.js";

export const controller = { api, security } as const;
