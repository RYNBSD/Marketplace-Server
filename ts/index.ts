import { fileURLToPath } from "url";
import path from "node:path";
import process from "node:process";
import { existsSync } from "node:fs";
import db from "./src/config/db.js";
import { mkdirSync, rmSync } from "fs";

global.IS_PRODUCTION = process.env.NODE_ENV === "production";
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(__filename);
global.__root = process.cwd();

if (!IS_PRODUCTION) {
  await import("colors");
}

const PUBLIC = "public";
const PUBLIC_PATH = path.join(__root, PUBLIC);
if (existsSync(PUBLIC_PATH)) {
  if (!IS_PRODUCTION) rmSync(PUBLIC_PATH, { recursive: true, force: true });
  mkdirSync(PUBLIC_PATH);
}

const UPLOAD = "upload";
const UPLOAD_PATH = path.join(__root, PUBLIC, UPLOAD);
if (existsSync(UPLOAD_PATH)) mkdirSync(UPLOAD_PATH);

const IMAGE = "image";
const IMAGE_PATH = path.join(__root, PUBLIC, UPLOAD, IMAGE);
if (existsSync(IMAGE_PATH)) mkdirSync(IMAGE_PATH);

const MODEL = "model";
const MODEL_PATH = path.join(__root, PUBLIC, UPLOAD, MODEL);
if (existsSync(MODEL_PATH)) mkdirSync(MODEL_PATH);

await db.connect();
const { default: app } = await import("./app.js");
await db.init();

app.listen(process.env.PORT, async () => {
  if (!IS_PRODUCTION) console.log("Starting".bgGreen.white);
});
