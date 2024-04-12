import { fileURLToPath } from "url";
import path from "node:path";
import process from "node:process";

global.IS_PRODUCTION = process.env.NODE_ENV === "production";
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(__filename);
global.__root = process.cwd();

if (!IS_PRODUCTION) {
  await import("colors");
}

await import("./app.js");
