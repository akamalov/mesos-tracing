var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../events/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var EventTypes = require('../constants/EventTypes');
var RedisActions = require('../events/RedisActions');

var traces = {};

var RedisStore = _.extend({}, EventEmitter.prototype, {

  onTracesReceived: function(newTraces) {
    newTraces.forEach(function(trace) {
      traces[trace.traceID] = trace;
    });

    this.emit(EventTypes.TRACES_RECEIVED);
  },

  getTraces: function() {
    return traces;
  },

  requestTrace: function(traceID) {
    if (!traces[traceID]) {
      return;
    }

    RedisActions.requestFullTrace(traceID);
  },

  onNewTrace: function(traceID) {
    if (traceID in traces) {
      return;
    }

    traces[traceID] = {traceID};
    RedisActions.requestTraceMeta(traceID);
  },

  onTraceMetaReceived: function(meta) {
    _.extend(traces[meta.traceID], meta);
    this.emit(EventTypes.TRACE_META_UPDATED);
  },

  onTraceReceived: function(trace) {
    _.extend(traces[trace.traceID], trace);
    this.emit(EventTypes.TRACE_UPDATED, trace);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    switch (payload.type) {
      case ActionTypes.REDIS_TRACES_RECEIVED:
        RedisStore.onTracesReceived(payload.traces);
        break;
      case ActionTypes.REDIS_NEW_TRACE:
        RedisStore.onNewTrace(payload.traceID);
        break;
      case ActionTypes.REDIS_TRACE_META_RECEIVED:
        RedisStore.onTraceMetaReceived(payload.meta);
        break;
      case ActionTypes.REDIS_TRACE_RECEIVED:
        RedisStore.onTraceReceived(payload.trace);
        break;
    }

    return true;
  })

});

module.exports = RedisStore;
