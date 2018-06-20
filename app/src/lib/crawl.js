const os = require('os');
const { Chromeless } = require('chromeless');

const url = {
  login:
    'https://www.amazon.co.jp/ap/signin?openid.assoc_handle=jpflex&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.mode=checkid_setup&openid.ns=http://specs.openid.net/auth/2.0',
  list:
    'https://www.amazon.co.jp/gp/css/order-history?orderFilter=last30&startIndex=__START_INDEX__',
  detail: {
    default:
      'https://www.amazon.co.jp/gp/css/summary/print.html/ref=oh_aui_pi_o06_?ie=UTF8&orderID=__ORDERID__',
    digital:
      'https://www.amazon.co.jp/gp/digital/your-account/order-summary.html/ref=oh_aui_ajax_dpi?ie=UTF8&orderID=__ORDERID__&print=1'
  }
};

const chromeless = new Chromeless();

const login = async auth => {
  console.log('Logging in to Amazon');
  await chromeless
    .goto(url.login)
    .type(auth.user, 'input[name="email"]')
    .click('#continue')
    .wait('#signInSubmit')
    .type(auth.pass, 'input[name="password"]')
    .click('#signInSubmit')
    .wait('body');
};

const listOrders = async () => {
  let page_url,
    page_orders,
    page_num = 1,
    startIndex = 0,
    orders = [];

  console.log('Searching for orders...');
  do {
    page_url = url.list.replace('__START_INDEX__', startIndex);

    console.log(`page:${page_num}`);

    page_orders = await chromeless.goto(page_url).evaluate(() => {
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
    page_num += 1;
  } while (page_orders.length);

  console.log(`${orders.length} orders found.`);

  return orders;
};

const screenShot = async orders => {
  let files = [];

  for (order of orders) {
    let TPL = order.digital ? url.detail.digital : url.detail.default;
    let URL = TPL.replace('__ORDERID__', order.id);

    if (order.digital) {
      await chromeless.goto(URL).wait('.pmts_billing_address_block');
    } else {
      await chromeless.goto(URL);
    }

    files.push(
      await chromeless
        .evaluate(() => {
          document.body.style.cssText += `
            font-family: 'Noto Sans Japanese' !important;
            font-style: normal;
            font-weight: 100;
          `;
        })
        .screenshot('body', {
          filePath: os.tmpdir() + `/${order.id}.png`
        })
    );

    console.log(`Captured: ${order.id}`);
  }

  return files;
};

module.exports = async auth => {
  try {
    await login(auth);
    const orders = await listOrders();
    const files = await screenShot(orders);
    await chromeless.end();
    return files;
  } catch (e) {
    console.log(e);
  }
};
