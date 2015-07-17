var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../events/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var EventTypes = require('../constants/EventTypes');
var RedisActions = require('../events/RedisActions');

var traces = {};

var RedisStore = _.extend({}, EventEmitter.prototype, {

  onTraceReceived: function(traceID) {
    if (traceID in traces) {
      return;
    }

    traces[traceID] = {traceID};
    RedisActions.requestTraceData(traceID);
  },

  getTraces: function() {
    return traces;
  },

  onTraceMetaReceived: function(meta) {
    _.extend(traces[meta.traceID], meta);
    this.emit(EventTypes.TRACE_META_UPDATED);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    switch (payload.type) {
      case ActionTypes.REDIS_TRACE_RECEIVED:
        RedisStore.onTraceReceived(payload.traceID);
        break;
      case ActionTypes.REDIS_TRACE_META_RECEIVED:
        RedisStore.onTraceMetaReceived(payload.meta);
        break;
    }

    return true;
  })

});

module.exports = RedisStore;
