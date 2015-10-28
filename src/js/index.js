var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

require('./vendor/springyui');

var ApplicationPage = require('./pages/ApplicationPage');
var IndexPage = require('./pages/IndexPage');
var TracePage = require('./pages/TracePage');
var RedisActions = require('./events/RedisActions');

var socket = io();
RedisActions.listenForTraceUpdates(socket);
RedisActions.requestTraces(300);

var routes = (
  <Route handler={IndexPage}>
    <Route path="/" handler={ApplicationPage} />
    <Route path="/trace/:traceID" handler={TracePage} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler />, document.getElementById('application'));
});

