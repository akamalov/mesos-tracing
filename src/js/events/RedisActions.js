var qwest = require('qwest');

var AppDispatcher = require('./AppDispatcher');

var RedisActions = {

  listenForTraceUpdates: function(socket) {
    socket.on('traces.update', function(traceID) {
      AppDispatcher.onTraceUpdate(traceID);
    });
  },

  requestTraceData: function(traceID) {
    qwest.get(`/trace-meta/${traceID}`)
      .then(function(meta) {
        AppDispatcher.onTraceMetaUpdate(meta);
      });
  }

};

module.exports = RedisActions;
