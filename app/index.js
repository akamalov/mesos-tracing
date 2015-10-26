var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var configuration = require('./configuration');
var TraceUtil = require('./TraceUtil');

// const redis = require('redis');
// const redisSubscriberClient = redis.createClient(
  // configuration.port, configuration.host
// );
// redisSubscriberClient.subscribe('traces.update');
// TraceUtil.setClient(
  // redis.createClient(configuration.port, configuration.host)
// );

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/', function(req, res) {
  res.sendfile('../dist/index.html');
});

app.get('/traces/:count', function(request, response) {
  var count = request.params.count;

  TraceUtil.getLatestTraces(count)
    .then(function(traces) {
      response.json(traces);
    });
});

app.get('/trace-meta/:traceID', function(request, response) {
  var traceID = request.params.traceID;

  TraceUtil.getTraceMeta(traceID)
    .then(function(meta) {
      response.json(meta);
    });
});

app.get('/trace/:traceID', function(request, response) {
  var traceID = request.params.traceID;

  TraceUtil.getTraceMeta(traceID)
    .then(TraceUtil.getTrace)
    .then(function(trace) {
      response.json(trace);
    });
});

// redisSubscriberClient.on('message', function(channel, traceID) {
  // io.sockets.emit('traces.update', traceID);
// });

// io.on('connection', function(socket) {
//
// });

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
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = http;
