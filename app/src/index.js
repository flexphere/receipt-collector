const moment = require('moment');
const crawl = require('./lib/crawl');
const archive = require('./lib/zip');

const auth = {
  user: process.env.AMZN_USER,
  pass: process.env.AMZN_PASS
};

const main = async () => {
  try {
    const screenshots = await crawl(auth);
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const archive_path = `${__dirname}/downloads/`;
    const archive_name = `receipt_${timestamp}.zip`;

    console.log(`Creating archive ${archive_name}`);
    archive(`${archive_path}${archive_name}`, screenshots);
    console.log('Done.');
  } catch (e) {
    console.log(e);
  }
};
main();
