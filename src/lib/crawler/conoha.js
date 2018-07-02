const log = require('../log');
const { Chromeless } = require('chromeless');

const url = {
  login: 'https://www.conoha.jp/login/',
  list: 'https://manage.conoha.jp/Billing/Log/'
};

module.exports = async (auth, options) => {
  log.println(`Crawling Conoha`);
  const chromeless = new Chromeless();

  console.log(auth);

  // Login -----------------------
  const link = await chromeless
    .goto(url.login)
    .wait('input[name="email"]')
    .type(auth.user, 'input[name="email"]')
    .type(auth.pass, 'input[name="password"]')
    .click('button[name="submit"]')
    .wait('body')
    .goto(url.list)
    .evaluate(() => {
      let url = (document.querySelector('.items__btn').onclick + '').match(
        /'(.*)'/
      )[1];

      return new Promise(function(resolve, reject) {
        try {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.responseType = 'arraybuffer';
          xhr.onload = function() {
            var arrayBuffer = this.response;
            resolve(arrayBuffer);
          };
          xhr.send();
        } catch (e) {
          reject(e);
        }
      });
    });

  console.log(link);

  // const screenshot = await chromeless
  // .goto('https://www.google.com')
  // .type('chromeless', 'input[name="q"]')
  // .press(13)
  // .wait('#resultStats')
  // .screenshot();

  await chromeless.end();
};
