var express = require('express');
var router = express.Router();

var expressWs = require('express-ws')(router);

router.get('/', function (req, res, next) {
    res.send("It works.");
});

router.ws('/', function(ws, req) {
    ws.on('message', function(msg) {
        console.log(msg);
    });
    console.log('socket', req.testing);
});

module.exports = router;
