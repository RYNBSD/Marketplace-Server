import { fileURLToPath } from "url";
import path from "node:path";
import process from "node:process";
import db from "./src/config/db.js";

global.IS_PRODUCTION = process.env.NODE_ENV === "production";
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(__filename);
global.__root = process.cwd();

if (!IS_PRODUCTION) {
  await import("colors");
}

await db.connect();
const { default: app } = await import("./app.js");

app.listen(process.env.PORT, async () => {
  await db.init();
  if (!IS_PRODUCTION) console.log("Starting".bgGreen.white);
});
