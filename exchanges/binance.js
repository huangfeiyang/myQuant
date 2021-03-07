const axios = require('axios');
const util = require('../util/util');
// const config = require('');

//定义axios请求对象
let client = axios.create({
    baseURL:'https://api.binance.com',
    timeout:10000,
    headers:{
        'Content-Type':'application/json',
    }
});

function getAccessHeaders(exchangeconfig){
    let headers = {
        'X-MBX-APIKEY':exchangeconfig.apiKey,
    }
    return headers;
}

function getSign(str, secret) {
    return util.sha256WithHex(str, secret);
}

exports.getAllCapitalConfig = async function (exchangeconfig) {
    let method = 'GET';
    let ts = new Date.now();
    let signKey = 'recvWindow=5000' + '&timestamp=' + ts;
    let signature = getSign(signKey, exchangeConfig.secret);
    let headers = getAccessHeaders(exchangeConfig);
    let path = '/sapi/v1/capital/config/getall?' + signKey + '&signature=' + signature;
    let info = await client.get(path, {
        method,
        headers
    });
    if (info && info.data) {
        return info.data;
    }
}