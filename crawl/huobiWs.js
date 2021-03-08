const WebSocket = require('ws');
const constInfo = require('../util/constInfo.js');
const redisService = require('../db/redisService');
const CronJob = require('../db/redisService');
const pako = require('pako');
let lockReconnect_spot = false;

async function createWebSocket_spot () {
    try{
        let ws = new WebSocket('wss://api.hadax.com/ws');
        ws.onopen = async function(){
            console.log(new Date().toLocaleString(), 'Huobi spot ws is running!');
            let coinPairs = constInfo.coinPair.coinPairs;
            for(coinPair in coinPairs){
                let value = 'market.' + coinPair + '.depth.step2';
                let subInfo = {
                    "sub": value,
                    "id": "2"
                };
                ws.send(JSON.stringify(subInfo));
            }
        }
        ws.onmessage = async function (data) {
            let info = JSON.parse(pako.inflate(data.data, {
                to: 'string'
            }));
            if(info.ping) {
                let res = info.ping;
                let pong = {
                    pong : res,
                };
                ws.send(JSON.stringify(pong));
            }
            if(info && info.tick){
                lockReconnect_spot = false;
                let instrumentId = info.ch.split('.')[1];
                let balanceType = 'spot';
                let bookInfo = info.tick;
                let timestamp = bookInfo.ts;
                let asks = bookInfo.asks.slice(0, 40);
                let bids = bookInfo.bids.slice(0, 40);
                let orderBook = {
                    instrumentId,
                    timestamp,
                    asks,
                    bids,
                }
                let orderBookKey = balanceType + '_' + instrumentId;
                await redisService.setCurrentOrderBookInLocal('Huobi', orderBookKey, JSON.stringify(orderBook));
            }
        }
        ws.onclose = function (e) {
            console.log(e);
            lockReconnect_spot = false;
            reconnect_spot();
        }
        ws.onerror = function (e) {
            console.log(e);
            lockReconnect_spot = false;
            reconnect_spot();
        }
    }
    catch (e) {
        console.log(e);
        lockReconnect_spot = false;
        reconnect_spot();
    }
}
function reconnect_spot() {
    if (lockReconnect_spot) return;
    setTimeout(function () {
        lockReconnect_spot = false;
        try {
            creatWebsocket_spot();
        } catch(e) {
            console.log(new Date().toLocaleString(), 'huobi websocket spot catch error');
        }
    }, 30000);
}

createWebSocket_spot()