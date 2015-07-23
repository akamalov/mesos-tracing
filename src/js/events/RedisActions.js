var qwest = require('qwest');

var AppDispatcher = require('./AppDispatcher');

var RedisActions = {

  requestTraces: function(n) {
    qwest.get(`/traces/${n}`)
      .then(function(traces) {
        AppDispatcher.onTracesReceived(traces);
      });
  },

  listenForTraceUpdates: function(socket) {
    socket.on('traces.update', function(traceID) {
      AppDispatcher.onNewTraces(traceID);
    });
  },

  requestTraceMeta: function(traceID) {
    qwest.get(`/trace-meta/${traceID}`)
      .then(function(meta) {
        AppDispatcher.onTraceMetaUpdate(meta);
      });
  },

  requestFullTrace: function(traceID) {
    qwest.get(`/trace/${traceID}`)
      .then(function(trace) {
        AppDispatcher.onTraceUpdate(trace);
      });
  }

};

module.exports = RedisActions;
