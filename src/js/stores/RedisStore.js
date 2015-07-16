var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../events/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var EventTypes = require('../constants/EventTypes');

var updatedTracesList = [];

var RedisStore = _.extend({}, EventEmitter.prototype, {

  onTraceReceived: function(traceID) {
    updatedTracesList.push(traceID);

    this.emit(EventTypes.TRACE_UPDATED);
  },

  getTraces: function() {
    return updatedTracesList;
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    switch (payload.type) {
      case ActionTypes.REDIS_TRACE_RECEIVED:
        RedisStore.onTraceReceived(payload.traceID);
        break;
    }

    return true;
  })

});

module.exports = RedisStore;
