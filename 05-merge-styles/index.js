const { readdir, readFile, writeFile } = require("node:fs/promises");
const { join } = require("node:path");

const createBunndle = async (source, destination, ext) => {
  const createPath = (...filePath) => join(__dirname, ...filePath);
  const files = (await readdir(createPath(source))).filter((file) =>
    file.endsWith(`.${ext}`)
  );
  let content = "";
  for (let file of files) {
    const css = await readFile(createPath(source, file));
    content += css;
  }
  await writeFile(createPath(destination, `bundle.${ext}`), content);
};
createBunndle("styles", "project-dist", "css");
