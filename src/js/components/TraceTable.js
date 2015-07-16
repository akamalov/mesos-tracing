var React = require('react');

var EventTypes = require('../constants/EventTypes');
var RedisStore = require('../stores/RedisStore');

export default React.createClass({

  getInitialState: function() {
    return {
      traceList: []
    };
  },

  componentDidMount: function() {
    RedisStore.on(EventTypes.TRACE_UPDATED, this.onTraceReceived);
  },

  onTraceReceived: function() {
    this.setState({traceList: RedisStore.getTraces()});
  },

  getTableRows: function() {
    var list = this.state.traceList;

    return list.map(function(traceID) {
      return (
        <tr>
          <td>{traceID}</td>
        </tr>
      );
    });
  },

  render: function() {

    return (
      <table>
        <tbody>{this.getTableRows()}</tbody>
      </table>
    );
  }

});
