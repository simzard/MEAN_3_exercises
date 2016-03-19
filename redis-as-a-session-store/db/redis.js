
var redis = require('redis');


var PORT =  14056;
var ENDPOINT = "pub-redis-14056.us-east-1-4.2.ec2.garantiadata.com";
var PASSWORD = "test";

var client = redis.createClient(PORT, ENDPOINT, {no_ready_check: true});
client.auth(PASSWORD, function (err) {
    if (err) {
        console.log(err);
    }
});



module.exports.client = client;
module.exports.PORT = PORT;
module.exports.ENDPOINT = ENDPOINT;
module.exports.PASSWORD = PASSWORD;