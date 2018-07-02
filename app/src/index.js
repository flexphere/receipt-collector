const moment = require('moment');
const amazon = require('./lib/crawler/amazon');
const archive = require('./lib/zip');

const chromeOptions = {
  waitTimeout: 20000
  // remote: {
  //   endpointUrl:
  //     'https://5z7533s5xk.execute-api.ap-northeast-1.amazonaws.com/dev',
  //   apiKey: '4NjGoCeFf94nbT7YjfhnKnM1dqn20nO3UG0W6Du6'
  // }
};

const auth = {
  user: process.env.AMZN_USER,
  pass: process.env.AMZN_PASS
};

const main = async () => {
  try {
    const screenshots = await amazon(auth, chromeOptions);

    // const downloads = screenshots.map(url => {
    //   return download(url);
    // });

    // const files = await Promise.all(downloads);

    if (screenshots.length) {
      const timestamp = moment().format('YYYYMMDDHHmmss');
      const archive_path = `${__dirname}/downloads/`;
      const archive_name = `receipt_${timestamp}.zip`;
      console.log(`Creating archive ${archive_name}`);
      archive(`${archive_path}${archive_name}`, screenshots);
      console.log('Done.');
    }
  } catch (e) {
    console.log(e);
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
