const WebSocket = require('ws');
const CronJob = require('cron').CronJob;
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
            let coinPairs = JSON.parse(process.args.coinPairs);
            let arr = [];
            for(index in coinPairs){
                let value = index + '@depth20@100ms';
                arr.push(value);
            }
            let subInfo = {
                'method':'SUBSCRIBE',
                'params':arr,
                'id':1,
            }
            ws.send(JSON.stringify(subInfo), (err) => {
                console.log(err);
            });
        }
        ws.onmessage = async function (data) {
            if(data && data.data){
                let info = JSON.parse(data.data);
                // console.log(info);
                if(info && info.data){
                    console.log(info.data.asks, info.data.bids);
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