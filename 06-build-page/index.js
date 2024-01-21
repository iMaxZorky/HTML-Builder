const fs = require('fs');
const path = require('path');
const { readdir: readDirectory, mkdir: makeDirectory } = require('fs/promises');

const newDirectoryPath = path.join(__dirname, 'project-dist');
const compHtml = path.join(__dirname, 'components');
const stylePath = path.join(__dirname, 'styles');
const stylePathOut = path.join(__dirname, 'project-dist', 'style.css');

function copyDirectory(assets, assetsDist) {
  makeDirectory(assetsDist, { recursive: true }).then(() => {
    readDirectory(assets).then((files) => {
      files.forEach((file) => {
        let assetsChild = path.join(assets, file);
        let assetsDistChild = path.join(assetsDist, file);
        fs.stat(assetsChild, (err, stats) => {
          if (err) throw err;
          if (stats.isDirectory()) {
            copyDirectory(assetsChild, assetsDistChild);
          } else {
            fs.createReadStream(assetsChild).pipe(
              fs.createWriteStream(assetsDistChild),
            );
          }
        });
      });
    });
  });
}

function mergeStyles() {
  fs.readdir(stylePath, { withFileTypes: true }, function (err, fileNames) {
    if (err) throw err;
    const writeStream = fs.createWriteStream(stylePathOut);
    fileNames.forEach(function (fileName) {
      const fileExtension = path.parse(fileName.name).ext;
      if (fileName.isFile() === true && fileExtension === '.css') {
        const readStream = fs.createReadStream(
          path.join(stylePath, fileName.name),
        );
        readStream.on('data', (data) => writeStream.write(data));
        readStream.on('error', (error) => console.log('Error', error.message));
      }
    });
  });
}

function buildHtml(template, index) {
  let html = '';
  let templateReadStream = fs.createReadStream(template, { encoding: 'utf8' });

  templateReadStream.on('data', (chunk) => {
    html = chunk.toString();
  });

  templateReadStream.on('end', () => {
    addContent(html, index);
  });
}

function addContent(html, index) {
  let htmlObject = {};
  let count = 0;
  readDirectory(compHtml).then((files) => {
    files.forEach((file) => {
      let pathFileContainer = file.replace(path.extname(file), '');
      let pathFile = path.join(compHtml, file);
      htmlObject[pathFileContainer] = '';
      fs.createReadStream(path.join(pathFile))
        .on('data', (a) => {
          htmlObject[pathFileContainer] += a.toString();
        })
        .on('end', () => {
          count++;
          if (count >= files.length) {
            for (let i in htmlObject) {
              html = html.replace('{{' + i + '}}', htmlObject[i]);
            }
            let htmlStream = fs.createWriteStream(index, { encoding: 'utf8' });
            htmlStream.write(html);
          }
        });
    });
  });
}

fs.rm(newDirectoryPath, { recursive: true, force: true }, () => {
  makeDirectory(newDirectoryPath, { recursive: true }).then(() => {
    copyDirectory(
      path.join(__dirname, 'assets'),
      path.join(newDirectoryPath, 'assets'),
      function (err) {
        if (err) throw err;
      },
    );
    mergeStyles(path.join(newDirectoryPath, 'style.css'));
    buildHtml(
      path.join(__dirname, 'template.html'),
      path.join(newDirectoryPath, 'index.html'),
    );
  });
});
