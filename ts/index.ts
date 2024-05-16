import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import db from "./src/config/db.js";

global.IS_PRODUCTION = process.env.NODE_ENV === "production";
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(__filename);
global.__root = process.cwd();

// TODO: rollback dev options (after 27)

const PUBLIC = "public";
const PUBLIC_PATH = path.join(__root, PUBLIC);

if (!IS_PRODUCTION) {
  await import("colors");
  // if (existsSync(PUBLIC_PATH)) rmSync(PUBLIC_PATH, { recursive: true, force: true });
}

if (!existsSync(PUBLIC_PATH)) {
  mkdirSync(PUBLIC_PATH);
}

const UPLOAD = "upload";
const UPLOAD_PATH = path.join(PUBLIC_PATH, UPLOAD);
if (!existsSync(UPLOAD_PATH)) mkdirSync(UPLOAD_PATH);

const IMAGE = "image";
const IMAGE_PATH = path.join(UPLOAD_PATH, IMAGE);
if (!existsSync(IMAGE_PATH)) mkdirSync(IMAGE_PATH);

const MODEL = "model";
const MODEL_PATH = path.join(UPLOAD_PATH, MODEL);
if (!existsSync(MODEL_PATH)) mkdirSync(MODEL_PATH);

await db.connect();
const { default: app } = await import("./app.js");
// await db.init();
await sequelize.sync();

// https
//   .createServer(
//     {
//       key: readFileSync(path.join(__root, "certificate", "server.key")),
//       cert: readFileSync(path.join(__root, "certificate", "server.cert")),
//     },
//     app,
//   )
//   .listen(process.env.PORT, async () => {
//     if (!IS_PRODUCTION) console.log("Starting".bgGreen.white);
//   });

app.listen(process.env.PORT, async () => {
  if (!IS_PRODUCTION) console.log("Starting".bgGreen.white);
});
