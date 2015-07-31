#!/usr/bin/env python

# A utility that reads in local trace JSONs and populate the trace data
# into Redis.
# Expecting the JSON format to be the same specified in receiver.cpp.

import sys
import redis
import json

class Trace:
  def __init__(self, line):
    trace = json.loads(line)
    self.id = trace["trace_id"]
    self.message_name = trace["message_name"]
    self.span_id = trace["span_id"]
    self.span_parent = trace["span_parent"]
    self.from_upid = trace["from"]
    self.to_upid = trace["to"]
    self.timestamp = trace["timestamp"]
    self.stage = trace["stage"]
    self.component = trace["component"]

r = redis.StrictRedis(host='localhost', port=6379, db=0)

while 1:
  line = sys.stdin.readline()
  if not line: break
  trace = Trace(line)
  if not r.hexists('traces', trace.id):
    r.hset('traces', trace.id, trace.time_nanos)
  else:
    time = r.hget('traces', trace.id)
    if time > trace.time_nanos:
      r.hset('traces', trace.id, trace.time_nanos)

  i = r.incr(trace.id + "-count")

  list_key = trace.id + "-" + str(i)
  r.hset(list_key, 'message_name', trace.message_name)
  r.hset(list_key, 'span_id', trace.span_id)
  r.hset(list_key, 'span_parent', trace.span_parent)
  r.hset(list_key, 'from', trace.from_upid)
  r.hset(list_key, 'to', trace.to_upid)
  r.hset(list_key, 'timestamp', trace.timestamp)
  r.hset(list_key, 'stage', trace.stage)
  r.hset(list_key, 'component', trace.component)
