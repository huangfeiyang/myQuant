const redisService = require('../db/redisService');

/**
 * 
 * @param {*} exchangeName 交易所名字"Binance""
 * @param {*} coin 'btc'
 */
async function getCurrentPrice (exchangeName, coin) {
    if(coin.toLocaleLowerCase() == 'usdt'){
        return 1;
    }
    let instrumentId = coin.toLocaleLowerCase();
    let orderBookKey = 'spot_' +instrumentId +  'usdt';
    try {
        let orderBookData = await redisService.getCurrentOrderBookInLocal(exchangeName, orderBookKey);
        orderBookData = JSON.parse(orderBookData);
        let asks1 = parseFloat(orderBookData.asks[0][0]);
        let bids1 = parseFloat(orderBookData.bids[0][0]);
        let price = (asks1 + bids1) / 2;
        console.log(price);
        return price;
    }
    catch (e) {
        console.log(e);
        console.log(new Date().toLocaleString(), "ERR: return orderbook catch error:", exchange, coinType);
    }
}
exports.getCurrentPrice = getCurrentPrice;
