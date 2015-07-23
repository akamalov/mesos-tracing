var React = require('react');

var Trace = require('../components/Trace');

export default React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  render: function() {
    var {traceID} = this.context.router.getCurrentParams();

    return <Trace traceID={traceID} />;
  }

});
