let myRedis = require('../db/myredis');

exports.setCurrentOrderBookInLocal = async function (exchangeName, orderBookKey, orderBookStr) {
    let key = 'current_orderBook_' + exchangeName;
    return new Promise((resolve, reject) => {
        myRedis.client.hset(key, orderBookKey, orderBookStr, (err) => {
            if(err){
                return reject(err);
            }
            return resolve(null);
        })
    })
}

exports.getCurrentOrderBookInLocal = async function (exchangeName, orderBookKey) {
    let key = 'current_orderBook_' + exchangeName;
    return new Promise((resolve, reject) => {
        myRedis.client.hget(key, orderBookKey, (err, data) => {
            if(err) {
                return reject(err);
            }
            return resolve(data);
        })
    })
}