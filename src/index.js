const moment = require('moment');
const amazon = require('./lib/crawler/amazon');
const archive = require('./lib/zip');

const chromeOptions = {
  waitTimeout: 20000
};

if (!process.env.AMZN_USER || !process.env.AMZN_PASS) {
  console.log('missing credentials');
  process.exit();
}

const auth = {
  user: process.env.AMZN_USER,
  pass: process.env.AMZN_PASS
};

const main = async () => {
  try {
    const screenshots = await amazon(auth, chromeOptions);

    if (screenshots.length) {
      const timestamp = moment().format('YYYYMMDDHHmmss');
      const archive_path = `/rc/`;
      const archive_name = `receipt_${timestamp}.zip`;
      console.log(`Creating archive ${archive_name}`);
      archive(`${archive_path}${archive_name}`, screenshots);
      console.log('Done.');
    } else {
      console.log('No Orders were found.');
    }
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

const download = url => {
  const os = require('os');
  const fs = require('fs');
  const request = require('request');

  const options = { method: 'GET', url: url, encoding: null };
  const filename = os.tmpdir() + '/' + url.split('/').pop();

  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        fs.writeFileSync(filename, body, 'binary');
        resolve(filename);
      } else {
        reject(err);
      }
    });
  });
};

main();
