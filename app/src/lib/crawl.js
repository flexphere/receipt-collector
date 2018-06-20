const { Chromeless } = require('chromeless');

const url = {
  login:
    'https://www.amazon.co.jp/ap/signin?_encoding=UTF8&ignoreAuthState=1&openid.assoc_handle=jpflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.co.jp%2F%3Fref_%3Dnav_signin&switch_account=',
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

  console.log('Retrieving orders...');
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
      screentshots.push(
        await chromeless
          .goto(URL)
          .wait('.pmts_billing_address_block')
          .screenshot()
      );
    } else {
      screentshots.push(await chromeless.goto(URL).screenshot());
    }

    console.log(`Captured: ${order.id}`);
  }

  await chromeless.end();
  return screentshots;
};

module.exports = run;
