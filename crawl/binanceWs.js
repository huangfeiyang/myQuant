const WebSocket = require('ws');
const CronJob = require('cron').CronJob;
const constInfo = require('../util/constInfo');
const redisService = require('../db/redisService');
let lockReconnect_spot = false;


new CronJob('0 0 */1 * * *', function () {
    console.log(new Date().toLocaleString(), 'binance orderbook restart~');
    createWebSocket_spot();
}, null, true);

async function createWebsocket_spot () {
    try{
        let ws = new WebSocket('wss://stream.binance.com:9443/stream');
        ws.onopen = async function () {
            console.log(new Date().toLocaleString(), 'Binance spot ws is running!');
            let values = [];
            let coinPairs = constInfo.coinPair.coinPairs;
            console.log(coinPairs);
            for (let coinPair of coinPairs) {
                let value = coinPair + '@depth20@100ms';
                values.push(value);
            }
            let subInfo = {
                "method": "SUBSCRIBE",
                "params": values,
                "id": 1,
            }
            ws.send(JSON.stringify(subInfo));
        }
        ws.onmessage = async function (data) {
            if(data && data.data){
                let info = JSON.parse(data.data);
                // console.log(info);
                let str = info.stream;
                if(info.stream && info.data){
                    // console.log(info.data.asks, info.data.bids);
                    let instrumentId = str.substring(0, str.indexOf('@')).toLocaleUpperCase();
                    // console.log(instrumentId);
                    let bookInfo = info.data;
                    let timestamp = Date.now();
                    let asks = bookInfo.asks;
                    let bids = bookInfo.bids;
                    let orderBook = {
                        instrumentId,
                        timestamp,
                        asks,
                        bids,
                    }
                    let orderBookKey = 'spot' + '_' + instrumentId;
                    await redisService.setCurrentOrderBookInLocal('Binance', orderBookKey, JSON.stringify(orderBook));
                }
            }
        }
        ws.onclose = function (e) {
            lockReconnect_spot = false;
            console.log(e,'onclose');
            reconnect_spot();
        }
        ws.onerror = function (e) {
            lockReconnect_spot = false;
            console.log(e, 'onerror');
            reconnect_spot();
        }
    }
    catch (e) {
        lockReconnect_spot = false;
        console.log(e);
        reconnect_spot();
    }
}

function reconnect_spot() {
    if(lockReconnect_spot) return;
    lockReconnect_spot = true;
    setTimeout(() => {
        lockReconnect_spot = false;
        try{
            createWebsocket_spot();
        }
        catch (e) {
            console.log(new Date().toLocaleString(), 'Binance spot caught err!');
        }
    }, 3000);
}
createWebsocket_spot();