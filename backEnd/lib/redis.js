var redis = require('redis');
var config = require('../config/default');
var client = redis.createClient(config.redis.port, config.redis.host, {password: config.redis.secret, db: 1});
client.on("error", function (err) {
    console.log("Error " + err);
});
module.exports = client;