const fs = require("fs/promises");
const path = require("path");

const jsonFile = "user.json";
const jsonPath = path.join(process.cwd(), "__test__", jsonFile);

/**
 *
 * @param {Object[]} users
 */
async function write(...users) {
  await fs.rm(jsonPath, { force: true });
  await fs.writeFile(jsonPath, JSON.stringify(users, null, 2));
}

async function read() {
  const content = await fs.readFile(jsonPath);
  const isContent = content.length > 0;
  let parse = [];

  if (isContent) {
    try {
      parse = JSON.parse(content.toString());
    } catch (error) {
      parse = [];
    }
  }

  return parse;
}

/**
 *
 * @param {Object[]} users
 */
async function append(...users) {
  const parse = await read();
  parse.concat(users);
  await fs.writeFile(jsonPath, JSON.stringify(parse, null, 2));
}

/**
 *
 * @param {string} id
 * @returns {Object}
 */
async function readById(id) {
  const parse = await read();
  for (const p of parse) {
    if (p.id === id) return p;
  }
}

async function update(id, key, value) {
  const parse = await read();
  for (const p of parse) {
    if (p.id === id) {
      p[key] = value;
      break;
    }
  }

  await fs.writeFile(jsonPath, JSON.stringify(parse, null, 2));
}

async function remove(id) {
  const parse = await read();
  const filtered = parse.filter((p) => p.id !== id);
  await fs.writeFile(jsonPath, JSON.stringify(filtered, null, 2));
}

module.exports = {
  write,
  read,
  append,
  readById,
  update,
  remove,
};
