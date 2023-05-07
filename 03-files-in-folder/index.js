const { readdir, stat } = require("node:fs/promises");
const { join, parse, extname } = require("node:path");

const filesInFolder = async (dirName, pathTo = [dirName]) => {
  const path = [...pathTo];
  const createPath = (...path) => join(__dirname, ...path);
  try {
    const files = await readdir(createPath(...path), { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        filesInFolder(file.name, [...path, file.name]);
      } else {
        const st = await stat(createPath(...path, file.name));
        const { name, ext } = parse(file.name);
        console.log(
          `${name} - ${ext.replace(/^\./, "")} - ${parseFloat(
            st.size / 1024
          ).toFixed(3)}kb`
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};
filesInFolder("secret-folder");
