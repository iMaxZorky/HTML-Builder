const fs = require('fs');
const path = require('path');

const writeableStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist/bundle.css'),
);
const styles = path.join(__dirname, 'styles');

fs.readdir(styles, { withFileTypes: true }, function (err, fNames) {
  if (err) throw err;

  fNames.forEach((el) => {
    const extension = path.parse(el.name).ext;

    if (extension === '.css' && el.isFile() === true) {
      const readableStream = fs.createReadStream(path.join(styles, el.name));

      readableStream.on('data', (data) => {
        writeableStream.write(data);
      });
    }
  });
});