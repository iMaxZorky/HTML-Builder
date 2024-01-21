const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const textFile = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Даров! Вводи скорее свой текст, будем его записывать\n');

stdin.on('data', (data) => {
  if (data.toString().trim() == 'exit') {
    stdout.write('Покедава!');
    process.exit();
  } else {
    textFile.write(data);
  }
});

process.on('SIGINT', () => {
  stdout.write('Покедава!');
  process.exit();
});
