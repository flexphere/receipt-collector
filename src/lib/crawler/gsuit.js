const log = require('../log');
const { Chromeless } = require('chromeless');

const ua =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36';

const url = {
  login: 'https://accounts.google.com/Login?hl=ja',
  admin: 'https://admin.google.com',
  billing:
    'https://admin.google.com/AdminHome#DomainSettings/subtab=subscriptions&notab=1'
};

module.exports = async (auth, options) => {
  log.println(`Crawling G-Suit`);
  const chromeless = new Chromeless(options);
  await chromeless.clearCache();
  await chromeless.clearCookies();
  await chromeless.setUserAgent(ua);

  console.log(auth);

  // Login -----------------------
  const link = await chromeless
    .goto(url.login)
    .type(auth.user, 'input[name="identifier"]')
    .click('#identifierNext')
    .focus('input[name="password"]')
    .type(auth.pass, 'input[name="password"]')
    .click('#passwordNext')
    .wait('body')
    .goto(url.billing)
    .wait('div[aria-live="polite"]')
    .click('.cbarPushButton img')
    .click('.singleSubscriptionWidgetHeaderOverflowMenuItem')
    .wait('div[aria-live="polite"]')
    // .click('.b3-dropdown-menu-image-container svg')
    .wait('iframe', 30000)
    .evaluate(function() {
      var el = document.querySelector(
        'div.b3id-embedded-landing-page.b3-embedded-landing-page > div.b3-page-content.b3-embedded-landing-page-content > div.b3-plp-summary-cards > div:nth-child(1) > div > div.b3id-action-bar.b3-action-bar.b3-plp-action-bar > div > a'
      );
      return el.innerHTML;
    });
  console.log(link);

  // document.querySelectorAll("")
  // .evaluate(() => {
  //   return document.querySelector(
  //     '.gwt-Label.singleSubscriptionWidgetHeaderOverflowMenuItem'
  //   ).innerHTML;
  // });

  // .evaluate(() => {
  //   let url = 'http://www.ankhdavis.com';

  //   return new Promise(function(resolve, reject) {
  //     var xhr = new XMLHttpRequest();
  //     xhr.open('GET', url, true);
  //     xhr.responseType = 'arraybuffer';

  //     xhr.onload = function() {
  //       resolve(this.response);
  //     };

  //     xhr.onerror = function() {
  //       reject(xhr.responseText);
  //     };
  //     xhr.send();
  //   });
  // });

  await chromeless.wait(300000);

  await chromeless.end();

  return [link];
};
