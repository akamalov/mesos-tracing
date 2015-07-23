var Dispatcher = require('flux').Dispatcher;
var _ = require('lodash');

var ActionTypes = require('../constants/ActionTypes');

var AppDispatcher = _.extend(new Dispatcher(), {

  onTracesReceived: function(traces) {
    this.dispatch({
      type: ActionTypes.REDIS_TRACES_RECEIVED,
      traces
    });
  },

  onNewTraces: function(traceID) {
    this.dispatch({
      type: ActionTypes.REDIS_NEW_TRACE,
      traceID
    });
  },

  onTraceMetaUpdate: function(meta) {
    this.dispatch({
      type: ActionTypes.REDIS_TRACE_META_RECEIVED,
      meta
    });
  },

  onTraceUpdate: function(trace) {
    this.dispatch({
      type: ActionTypes.REDIS_TRACE_RECEIVED,
      trace
    });
  }

});

module.exports = AppDispatcher;
