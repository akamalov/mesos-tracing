var AppDispatcher = require('./AppDispatcher');

var RedisActions = {

  listenForTraceUpdates: function (socket) {
    socket.on('traces.update', function(traceID) {
      AppDispatcher.onTraceUpdate(traceID);
    });
  }

};

module.exports = RedisActions;
