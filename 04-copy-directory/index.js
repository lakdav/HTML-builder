const {
  readdir,
  readFile,
  writeFile,
  unlink,
  rm,
  mkdir,
} = require("node:fs/promises");
const { join } = require("node:path");

const createCopy = async (dir = [], copy = [`${dir}-copy`]) => {
  const createPath = (...args) => join(__dirname, ...args);
  try {
    const tree = await readdir(createPath(...dir), { withFileTypes: true });
    await mkdir(createPath(...copy), { recursive: true });
    const treeCopy = await readdir(createPath(...copy), {
      withFileTypes: true,
    });
    for (let leaf of tree) {
      if (leaf.isDirectory()) {
        const dirName = [...dir, leaf.name];
        const copyName = [...copy, leaf.name];
        createCopy(dirName, copyName);
      } else {
        const fileName = leaf.name;
        const data = await readFile(createPath(...dir, fileName));
        if (!treeCopy.includes(fileName)) {
          await writeFile(createPath(...copy, fileName), data);
        } else {
          const dataCopy = await readFile(createPath(...copy, fileName));
          if (dataCopy.toString() !== data.toString()) {
            await writeFile(createPath(...copy, fileName), data);
          }
        }
      }
    }
    for (let leaf of treeCopy) {
      if (tree.findIndex((dirent) => dirent.name === leaf.name) === -1) {
        if (leaf.isFile()) {
          await unlink(createPath(...copy, leaf.name));
        } else {
          await rm(createPath(...copy, leaf.name), {
            force: true,
            recursive: true,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
createCopy(["files"]);
