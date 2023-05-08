const { readdir, readFile, writeFile, unlink } = require("node:fs/promises");
const { mkdir } = require("node:fs/promises");
const { join } = require("node:path");

const copy = async (dir, path = [`${dir}-copy`]) => {
  const createPath = (...args) => join(__dirname, ...args);
  try {
    const tree = await readdir(createPath(dir));
    await mkdir(createPath(...path), { recursive: true });
    const treeCopy = await readdir(createPath(...path));
    for (file of tree) {
      const data = await readFile(createPath(dir, file));
      if (!treeCopy.includes(file)) {
        await writeFile(createPath(...path, file), data);
      } else {
        const dataCopy = await readFile(createPath(...path, file));
        if (dataCopy.toString() !== data.toString()) {
          await writeFile(createPath(...path, file), data);
        }
      }
    }
    for (c of treeCopy) {
      if (!tree.includes(c)) {
        await unlink(createPath(...path, file));
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
copy("files");
