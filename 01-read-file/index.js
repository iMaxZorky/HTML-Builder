const fs = require('fs');
const path = require('path');
const { stdout } = process;

const stream = new fs.ReadStream(path.join(__dirname, 'text.txt'), {
  encoding: 'utf-8',
});

stream.on('data', (data) => {
  stdout.write(data);
});
