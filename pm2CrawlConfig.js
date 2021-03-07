module.exports = {
    'apps':[
        {
            'name': 'binanceWs',
            'script': './crawl/binanceWs.js',
            'args': {
                'coinPairs':['ethusdt', 'btcusdt',],
            },
            'exec_mode': 'cluster',
        }
    ]
}