const klaw = require("klaw");
const through2 = require("through2");
const fs = require("fs");
const readline = require("readline");
const fse = require("fs-extra");
const path = require("path");
const onlyDirectories = through2.obj(function(item, enc, next) {
  if (item.stats.isDirectory()) this.push(item);
  next();
});

const lineReader = file => {
  return readline.createInterface({
    input: fs.createReadStream(file)
  });
};

const SrcPath = "src/";
const dirPath = __dirname;

klaw("src/components", { depthLimit: 0 })
  .pipe(onlyDirectories)
  .on("data", item => {
    // console.log("item", item.path);
    // fse.ensureFile(`${item.path}/.target`);
    const targetPath = `${item.path}/.target`;
    if (fse.pathExistsSync(targetPath)) {
      lineReader(`${item.path}/.target`).on("line", function(line) {
        const desitnation = `${dirPath}/${SrcPath}${line}/${path.basename(
          item.path
        )}`;
        console.log("Symlink from file:", item.path, "to", desitnation);
        fse.ensureSymlink(item.path, desitnation);
      });
    }
  })
  .on("end", () => {
    console.log("done setting up");
  });
