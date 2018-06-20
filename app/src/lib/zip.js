const fs = require('fs');
const archiver = require('archiver');

const run = (filename, files) => {
  const output = fs.createWriteStream(filename);
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      console.warn(err);
    } else {
      throw err;
    }
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  for (file of files) {
    archive.file(file, { name: file.split('/').pop() });
  }

  archive.finalize();
};

module.exports = run;
