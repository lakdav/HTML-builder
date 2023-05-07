const { stdin, stdout } = require("node:process");
const { open, unlink } = require("node:fs/promises");
const { join } = require("node:path");
const { pipeline } = require("node:stream/promises");
const text = (str) => {
  stdout.write(
    `\t\t\t${new Date().toLocaleDateString()}/${new Date().toLocaleTimeString()}. ${str}
            ====================================================================\n`
  );
};
const exitHandler = () => {
  text("BYE");
  process.exit();
};
const writeFile = async () => {
  const path = join(__dirname, "text.txt");
  try {
    await open(path, "r");
    unlink(path);
  } catch (error) {}
  const fileHandler = await open(path, "w");
  const stream = fileHandler.createWriteStream();
  try {
    text("HELLO");
    stdin.on("data", (data) => {
      if (data.toString("utf-8").trim() === "exit") {
        exitHandler();
      }
    });
    await pipeline(stdin, stream);
  } catch (error) {
    console.log(error);
  }
};
writeFile();
process.on("SIGINT", exitHandler);
