module.exports = {
  apiURL: process.env.NODE_ENV === 'production' ?
    '' : process.env.NODE_ENV === 'preProduction' ?
    '' : ' ',
  ethBrowersUrl: process.env.NODE_ENV === 'production' ? '' : '',
  cryptoExproler: {
    btc: 'https://blockchain.info/tx/',
    ltc: 'https://live.blockcypher.com/ltc/tx/',
    bcc: 'https://blockdozer.com/insight/tx/',
    btg: 'https://explorer.bitcoingold.org/insight/tx/',
    dash: 'https://insight.dash.org/insight/tx/',
    zec: 'https://explorer.zcha.in/transactions/',
    usdt: 'https://omniexplorer.info/tx/',
    xrp: 'https://xrpcharts.ripple.com/#/transactions/',
    xmr: 'https://moneroblocks.info/tx/',
    eos: 'https://eosmonitor.io/txn/',
    bcd: 'http://explorer.btcd.io/#/TX?TX=',
  },
}
