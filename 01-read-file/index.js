const { createReadStream } = require("node:fs");
const { pipeline } = require("node:stream/promises");
const { join } = require("node:path");
const { stdout } = require("node:process");

async function readFile(file) {
  const path = join(__dirname, file);
  try {
    await pipeline(createReadStream(path, { encoding: "utf-8" }), stdout);
  } catch (error) {
    console.log(error);
  }
}
readFile("text.txt");
