const os = require('os');
const { Chromeless } = require('chromeless');

const url = {
  login:
    'https://www.amazon.co.jp/ap/signin?openid.assoc_handle=jpflex&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.mode=checkid_setup&openid.ns=http://specs.openid.net/auth/2.0',
  list: 'https://www.amazon.co.jp/gp/css/order-history?orderFilter=last30',
  detail: {
    default:
      'https://www.amazon.co.jp/gp/css/summary/print.html/ref=oh_aui_pi_o06_?ie=UTF8&orderID=__ORDERID__',
    digital:
      'https://www.amazon.co.jp/gp/digital/your-account/order-summary.html/ref=oh_aui_ajax_dpi?ie=UTF8&orderID=__ORDERID__&print=1'
  }
};

const run = async auth => {
  const chromeless = new Chromeless();

  // Login to Amazon.co.jp
  console.log('Logging in to Amazon');
  await chromeless
    .goto(url.login)
    .type(auth.user, 'input[name="email"]')
    .click('#continue')
    .wait('#signInSubmit')
    .type(auth.pass, 'input[name="password"]')
    .click('#signInSubmit')
    .wait('body');

  console.log('Searching for orders...');
  // Get OrderID of each purchase
  let orders = await chromeless.goto(url.list).evaluate(() => {
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
  console.log(`${orders.length} orders found.`);

  // Take Screenshot of receipts
  let screentshots = [];
  for (order of orders) {
    let TPL = order.digital ? url.detail.digital : url.detail.default;

    let URL = TPL.replace('__ORDERID__', order.id);

    if (order.digital) {
      await chromeless.goto(URL).wait('.pmts_billing_address_block');
    } else {
      await chromeless.goto(URL);
    }

    screentshots.push(
      await chromeless.screenshot('body', {
        filePath: os.tmpdir() + `/${order.id}.png`
      })
    );

    console.log(`Captured: ${order.id}`);
  }

  await chromeless.end();
  return screentshots;
};

module.exports = run;
