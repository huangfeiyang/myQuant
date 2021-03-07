module.exports = {
    'apps':[
        {
            'name': 'binanceWs',
            'script': './crawl/binanceWs.js',
            'cwd': '.',
            'instances': 1,
            'exec_mode': 'cluster',
            'node_args': '--harmony',
            'env': {
                'coinPairs':  ['ethusdt', 'btcusdt'],
            },
        }
    ]
}