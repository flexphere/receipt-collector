const log = require('../log');
const os = require('os');
const { Chromeless } = require('chromeless');

const url = {
  login:
    'https://www.amazon.co.jp/ap/signin?openid.assoc_handle=jpflex&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.mode=checkid_setup&openid.ns=http://specs.openid.net/auth/2.0',
  list:
    'https://www.amazon.co.jp/gp/css/order-history?orderFilter=last30&startIndex=__START_INDEX__',
  detail_default:
    'https://www.amazon.co.jp/gp/css/summary/print.html/ref=oh_aui_pi_o06_?ie=UTF8&orderID=__ORDERID__',
  detail_digital:
    'https://www.amazon.co.jp/gp/digital/your-account/order-summary.html/ref=oh_aui_ajax_dpi?ie=UTF8&orderID=__ORDERID__&print=1'
};

module.exports = async (auth, options) => {
  log.println(`Crawling Amazon`);
  const chromeless = new Chromeless(options);

  // Login -----------------------
  await chromeless
    .goto(url.login)
    .type(auth.user, 'input[name="email"]')
    .click('#continue')
    .wait('#signInSubmit')
    .type(auth.pass, 'input[name="password"]')
    .click('#signInSubmit')
    .wait('body');

  // listOrders -----------------------
  let page_url,
    page_orders,
    startIndex = 0,
    orders = [];

  do {
    page_url = url.list.replace('__START_INDEX__', startIndex);
    log.debugln(`Loading Page: ${page_url}`);

    page_orders = await chromeless
      .goto(page_url)
      .wait('#yourOrdersContent')
      .evaluate(() => {
        const orderID = [].map.call(
          document.querySelectorAll('.actions .value'),
          el => {
            return {
              id: el.innerText,
              digital: el.innerText[0] == 'D'
            };
          }
        );
        return orderID;
      });

    orders = orders.concat(page_orders);
    startIndex += 10;
  } while (page_orders.length);
  log.println(`${orders.length} orders found.`);

  // screenShot -----------------------
  let screenshots = [];

  for (order of orders) {
    let tpl = order.digital ? url.detail_digital : url.detail_default;
    let page = tpl.replace('__ORDERID__', order.id);

    if (order.digital) {
      await chromeless.goto(page).wait('.pmts_payment_method_block');
    } else {
      await chromeless.goto(page);
    }

    screenshots.push(
      await chromeless.screenshot('body', {
        filePath: options.dlpath + `/${order.id}.png`
      })
    );

    log.println(`Captured: ${order.id}`);
  }

  await chromeless.end();
  return screenshots;
};
