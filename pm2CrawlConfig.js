module.exports = {
    'apps':[
        {
            'name': 'binanceWs',
            'script': './crawl/binanceWs.js',
            'env': {
                'coinPairs':['ethusdt', 'btcusdt',],
            },
            'exec_mode': 'cluster',
        }
    ]
}