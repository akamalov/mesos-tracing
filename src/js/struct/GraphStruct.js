var Springy = require('../vendor/springy');

export default class GraphStruct {

  loadData(trace) {
    this.trace = trace;
    // TODO: Validate
  }

  getGraphNodes() {
    var nodes = {};
    this.trace.spans.forEach(function(span) {
      nodes[span.span_id] = new Springy.Node(span.span_id, {
        label: span.message_name
      });
    });

    return nodes;
  }

  getGraphEdges() {
    var edges = [];
    var potentialEdges = {};

    // Create edges
    this.trace.spans.forEach(function(span) {
      if (span.span_parent == 0) {
        return;
      }

      var edgeID = `${span.span_parent}-${span.span_id}`;
      if (!potentialEdges[edgeID]) {
        potentialEdges[edgeID] = [span.span_parent, span.span_id];
        return;
      }

      edges.push([span.span_parent, span.span_id]);
      delete potentialEdges[edgeID];
    });

    // For edges that don't have an inbound/outbound then show them broken
    Object.keys(potentialEdges).forEach(function (edgeID) {
      var edge = potentialEdges[edgeID];
      edges.push([edge[0], edge[1], {color: '#DB323E'}]);
    });

    return edges;
  }

  getGraphData() {
    // For fast lookups
    var nodesHash = {};
    var struct = {nodes: [], edges: []};

    this.trace.spans.forEach(function(span) {
      nodesHash[span.span_id] = true;

      // The first span won't have a parent
      if (span.span_parent != 0) {
        struct.edges.push([span.span_parent, span.span_id]);
      }
    });

    struct.nodes = Object.keys(nodesHash);

    return struct;
  }

}
