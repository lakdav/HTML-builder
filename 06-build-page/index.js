const {
  readdir,
  readFile,
  writeFile,
  mkdir,
  unlink,
} = require("node:fs/promises");
const { join, parse } = require("node:path");
class Builder {
  constructor() {
    this.destination = "project-dist";
    this.template = "template.html";
    this.components = "components";
    this.dist();
    this.htmlBuilder();
    this.cssBunndler();
    this.copyAssets();
  }
  async dist() {
    try {
      await mkdir(this.path(this.destination), { recursive: true });
    } catch (error) {
      console.log(error);
    }
  }
  path(...args) {
    return join(__dirname, ...args);
  }
  async htmlBuilder() {
    try {
      let template = await readFile(this.path(this.template), {
        encoding: "utf-8",
      });
      const components = (await readdir(this.path(this.components))).filter(
        (component) => component.endsWith(".html")
      );
      for (let file of components) {
        const content = await readFile(
          this.path(this.components, file),
          "utf-8"
        );
        const reg = new RegExp(`{{${parse(file).name}}}`);
        template = template.replace(reg, content);
      }
      await writeFile(this.path(this.destination, "index.html"), template);
    } catch (error) {
      console.log(error);
    }
  }
  async cssBunndler() {
    const files = (await readdir(this.path("styles"))).filter((file) =>
      file.endsWith(`.css`)
    );
    let content = "";
    for (let file of files) {
      const css = await readFile(this.path("styles", file));
      content += css;
    }
    await writeFile(this.path(this.destination, `style.css`), content);
  }

  async copyAssets(
    source = ["assets"],
    destination = [this.destination, ...source]
  ) {
    try {
      const tree = await readdir(this.path(...source), { withFileTypes: true });
      await mkdir(this.path(...destination), {
        recursive: true,
      });
      const treeCopy = await readdir(this.path(...destination), {
        withFileTypes: true,
      });

      for (let leaf of tree) {
        if (leaf.isDirectory()) {
          const DirName = leaf.name;
          const newDir = [...source, DirName];
          this.copyAssets(newDir);
        } else {
          const fileName = leaf.name;
          const data = await readFile(this.path(...source, fileName));
          if (!treeCopy.includes(fileName)) {
            await writeFile(this.path(...destination, fileName), data);
          } else {
            const dataCopy = await readFile(this.path(...source, fileName));
            if (dataCopy.toString() !== data.toString()) {
              await writeFile(this.path(...destination, fileName), data);
            }
          }
        }
      }
      for (let leaf of treeCopy) {
        if (tree.findIndex((dirent) => dirent.name === leaf.name) === -1) {
          if (leaf.isFile()) {
            await unlink(this.path(...destination, leaf.name));
          } else {
            // await rmdir(this.path(...destination, leaf.name));
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
new Builder();
