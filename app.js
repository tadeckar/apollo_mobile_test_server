var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });

var wsClients = [];
wss.on('connection', function connection(ws) {
    console.log('WebSocket Connection Established...');
    wsClients.push(ws);
    var data = {
        'request':'connect',
        'username':'lab',
        'password':'lab',
        'host':'172.18.194.55'
    };
    ws.send(JSON.stringify(data));
    var command = {
        'request':'command',
        'commandString':'en'
    }
    var command2 = {
        'request':'command',
        'commandString':'lab'
    }
    setTimeout(function () {
        ws.send(JSON.stringify(command));
        ws.send(JSON.stringify(command2));
    }, 2000);

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        wsClients.forEach(function(val,i,array) {
            //val.send(message);
        });
    });
});

var routes = require('./routes/index');
var websockets = require('./routes/websockets');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/websockets', websockets);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
