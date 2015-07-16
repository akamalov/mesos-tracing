var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

var socket = io();
var Application = require('./pages/Application');
var RedisActions = require('./events/RedisActions');

RedisActions.listenForTraceUpdates(socket);

var routes = (
  <Route name="app" path="/" handler={Application} />
);

Router.run(routes, function (Handler, state) {
  React.render(
    <Handler state={state} />, document.getElementById('application')
  );
});

