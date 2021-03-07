let redis = require('redis');


exports.client = redis.createClient({
    port:6379,
    password:'display821',
});


