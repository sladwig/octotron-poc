const klaw = require("klaw");
const through2 = require("through2");
const fs = require("fs-extra");

const onlyDirectories = through2.obj(function(item, enc, next) {
  if (item.stats.isDirectory()) this.push(item);
  next();
});

klaw("src/components", { depthLimit: 0 })
  .pipe(onlyDirectories)
  .on("data", item => {
    console.log("item", item);
    fs.ensureFile(`${item.path}/.target`);
  })
  .on("end", () => {
    console.log("done setting up");
  });
