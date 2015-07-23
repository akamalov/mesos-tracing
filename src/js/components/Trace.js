var React = require('react');

var EventTypes = require('../constants/EventTypes');
var RedisStore = require('../stores/RedisStore');
var GraphStruct = require('../struct/GraphStruct');
var Springy = require('../vendor/springy');

export default React.createClass({

  getDefaultProps: function() {
    return {
      traceID: null
    };
  },

  getInitialState: function() {
    return {
      graphStruct: new GraphStruct()
    };
  },

  componentDidMount: function() {
    RedisStore.on(EventTypes.TRACE_UPDATED, this.onTraceReceived);
    RedisStore.requestTrace(this.props.traceID);
  },

  onTraceReceived: function(trace) {
    if (trace.traceID !== this.props.traceID) {
      return;
    }

    this.state.graphStruct.loadData(trace);
    var json = this.state.graphStruct.getGraphData();

    var graph = new Springy.Graph();
    graph.loadJSON(json);

    $(this.refs.canvas.getDOMNode()).springy({graph});
  },

  render: function() {
    return (
      <canvas ref="canvas" width={window.innerWidth} height={window.innerHeight} />
    );
  }

});
