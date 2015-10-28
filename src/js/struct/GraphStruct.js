
export default class GraphStruct {

  loadData(trace) {
    this.trace = trace;
    // TODO: Validate
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
