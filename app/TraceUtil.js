
var TraceUtil = {

  bindFunctions: function() {
    Object.keys(TraceUtil).forEach(function (key) {
      if (typeof TraceUtil[key] === 'function') {
        TraceUtil[key] = TraceUtil[key].bind(this);
      }
    }, this);
  },

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

  getLatestTraces: function(requestedCount) {
    return new Promise(function(resolve, reject) {
      this.client.hgetall('traces', function(err, allTraces) {
        if (err) {
          console.log('Redis hgetall traces failed: ' + err);
          return reject(err);
        }

        var requestedTraces = Object.keys(allTraces);
        requestedCount = Math.min(requestedTraces.length, requestedCount);
        if (requestedCount < requestedTraces.length) {
          requestedTraces = requestedTraces.slice(requestedTraces.length - requestedCount);
        }

        var traces = [];

        requestedTraces.forEach(function(traceID) {
          traces.push({
            traceID,
            timestamp: allTraces[traceID] / 1000000000
          });
        });

        var completedTraces = 0;
        var traceHandler = function() {
          completedTraces++;

          if (completedTraces === parseInt(requestedCount)) {
            resolve(traces);
          }
        };

        traces.forEach(function(trace) {
          this.getSpanCount(trace.traceID)
            .then(function(count) {
              trace.spanCount = count;
              return Promise.resolve(trace);
            })
            .then(traceHandler);
        }, this);
      }.bind(this));
    }.bind(this));
  },

  getSpanCount: function(traceID) {
    return new Promise(function(resolve, reject) {
      this.client.get(`${traceID}-count`, function(err, count) {
        if (err) {
           console.log('Redis get ' + traceID + '-count failed: ' + err);
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
      .then(this.getSpanCount)
      .then(function(count) {
        meta.spanCount = count;
        return Promise.resolve(meta);
      });
  },

  getSpan: function(spanID) {
    return new Promise(function(resolve, reject) {
      this.client.hgetall(spanID, function(err, span) {
        if (err) {
          console.log('Redis get ' + spanID + ' failed: ' + err);
          return reject(err);
        }

        resolve(span);
      });
    }.bind(this));
  },

  getSpans: function(trace) {
    return new Promise(function(resolve) {
      var spanList = [];
      var spanHandler = function(span) {
        spanList.push(span);

        if (spanList.length === parseInt(trace.spanCount)) {
          trace.spans = spanList;
          resolve(trace);
        }
      };

      for (let i = 1; i <= trace.spanCount; i++) {
        this.getSpan(`${trace.traceID}-${i}`)
          .then(spanHandler);
      }
    }.bind(this));
  },

  getTrace: function(traceMeta) {
    var trace = traceMeta;

    return this.getSpans(trace);
  }

};

TraceUtil.bindFunctions();

module.exports = TraceUtil;
