const fs = require('fs/promises');
const path = require('path');

const newDirectory = path.join(__dirname, 'files-copy');

fs.rm(newDirectory, { recursive: true, force: true }).finally(function () {
  fs.mkdir(newDirectory, { recursive: true });

  const directory = path.join(__dirname, 'files');
  fs.readdir(directory, { withFileTypes: true }).then((elements) => {
    elements.forEach((el) => {
      if (el.isFile()) {
        const pathToCopy = path.join(newDirectory, el.name);
        const pathToFile = path.join(directory, el.name);

        fs.copyFile(pathToFile, pathToCopy);
      }
    });
  });
});
