const moment = require('moment');
const amazon = require('./lib/crawler/amazon');
const archive = require('./lib/zip');
const log = require('./lib/log');

if (!process.env.AMZN_USER || !process.env.AMZN_PASS) {
  log.println('missing credentials');
  process.exit(1);
}

const CREDENTIALS = {
  user: process.env.AMZN_USER,
  pass: process.env.AMZN_PASS
};

const DL_PATH = process.env.DLPATH || '/rc';

const chromeOptions = {
  waitTimeout: 20000,
  dlpath: DL_PATH
};

const main = async () => {
  try {
    const screenshots = await amazon(CREDENTIALS, chromeOptions);
    if (!screenshots.length) throw new Error('No Orders were found.');
    log.println('Done.');
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  process.exit(0);
};

main();
