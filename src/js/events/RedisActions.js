var _ = require('lodash');
var qwest = require('qwest');

var AppDispatcher = require('./AppDispatcher');
var tableData = require('json!../fixtures/table-data.json');
var singleTrace = require('json!../fixtures/single-trace.json');

var useFixtures = false;

var RedisActions = {

  requestTraces: function(n) {
    if (useFixtures) {
      AppDispatcher.onTracesReceived(tableData);
      return;
    }

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
    if (useFixtures) {
      var trace = _.clone(singleTrace);
      trace.traceID = traceID;
      AppDispatcher.onTraceUpdate(trace);
      return;
    }

    qwest.get(`/trace/${traceID}`)
      .then(function(trace) {
        AppDispatcher.onTraceUpdate(trace);
      });
  }

};

module.exports = RedisActions;
