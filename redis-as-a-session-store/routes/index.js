var express = require('express');
var router = express.Router();

var client = require('../db/redis').client;

/* GET home page. */

function getValuesArray(callback) {
    var vs = [];

    client.keys("*", function (err, keys) {
        if (err) {
            throw err;
        }
        console.log("in client.keys()...");
        if (keys) {
            keys.forEach(function (key, i) {
                client.get(key, function (err, value) {
                    value = JSON.parse(value);
                    vs.push(value);
                    console.log("Added: " + value.user.name);
                    if (i == keys.length - 1)
                        callback(vs);
                });
            });
        } else {
            callback(vs);
        }

    });
};

router.get('/', function (req, res, next) {

    getValuesArray(function (values) {
        if (req.session)
            currentSession = req.session;
        res.render('index', {sessions: values, currentSession: req.session});
    });

});

router.get('/session/set/:name/:email', function (req, res) {
    var user = {name: req.params.name, email: req.params.email};
    req.session.user = user;
    res.send('session written to Redis successfully: ' + JSON.stringify(user));
});

router.get('/session/get/', function (req, res) {
    if (req.session.user)
        res.send('Session value stored in Redis: ' + JSON.stringify(req.session.user));
    else
        res.send("No session value stored in Redis");
});


module.exports = router;
