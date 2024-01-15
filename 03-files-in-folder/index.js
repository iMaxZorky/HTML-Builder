const fs = require("fs");
const path = require("path");


fs.readdir(path.join(__dirname, "secret-folder"), { withFileTypes: true }, (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      if (file.isFile()) {
        const filePath = path.join(__dirname, "secret-folder", file.name);
        const fileName = path.parse((__dirname, file.name)).name;
        const extension = path.extname(filePath).replace('.', '');
        fs.stat(filePath, (err, stats) => {
          console.log(`${fileName} - ${extension} - ${(stats.size / 1024).toFixed(3)}kb`)
        })
      }
    })
  }
})