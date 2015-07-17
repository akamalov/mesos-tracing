var Dispatcher = require('flux').Dispatcher;
var _ = require('lodash');

var ActionTypes = require('../constants/ActionTypes');

var AppDispatcher = _.extend(new Dispatcher(), {

  onTraceUpdate: function(traceID) {
    this.dispatch({
      type: ActionTypes.REDIS_TRACE_RECEIVED,
      traceID
    });
  },

  onTraceMetaUpdate: function(meta) {
    this.dispatch({
      type: ActionTypes.REDIS_TRACE_META_RECEIVED,
      meta
    });
  }

});

module.exports = AppDispatcher;
