
var TraceUtil = {
  setClient: function(client) {
    this.client = client;
  },

  getTimestamp: function(traceID) {
    return new Promise(function(resolve, reject) {
      this.client.hget(['traces', traceID], (err, timestamp) => {
        if (err) {
          return reject(err);
        }

        resolve(timestamp);
      });
    }.bind(this));
  },

  getTraceCount: function(traceID) {
    return new Promise(function(resolve, reject) {
      this.client.get(`${traceID}-count`, function(err, count) {
        if (err) {
          return reject(err);
        }

        resolve(count);
      });
    }.bind(this));
  },

  getTraceMeta: function(traceID) {
    var meta = {traceID};

    return this.getTimestamp(traceID)
      .then(function(timestamp) {
        meta.timestamp = timestamp / 1000000000;
        return Promise.resolve(traceID);
      })
      .then(this.getTraceCount.bind(this))
      .then(function(count) {
        meta.spanCount = count;
        return Promise.resolve(meta);
      });
  }
};

module.exports = TraceUtil;
