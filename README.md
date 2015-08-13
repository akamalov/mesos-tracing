
This repository is a web server / visualization that visualizes traces in Mesos.
This is built upon the traces work done here http://github.com/tnachen/mesos/tree/libprocess_trace

## Running Mesos

**Mesos must be started with trace enabled**

Grab the source tree and build mesos, then start mesos-master and mesos-slave with LIBPROCESS_TRACE_ENABLED=1 env variable.

## Log parsing

Once mesos is started with Trace Enabled it will begin logging the traces to a file. Use the `populate_trace_db.py` python script to read the log and write the traces to Redis.

**Start redis** in the following manner:

```
$ redis-server --notify-keyspace-events KE
```

**Start the log parser**

This assumes all the tracing data is installed into a local redis instance.

```shell
$ tail -f -c +1 <path> | python -u populate_trace_db.py
```

## Run the UI

### Install

`$ npm install`

### Configure

Copy the configuration file in `app/configuration.template.js` to `app/configuration.js`. And edit this file to match the host and port to Redis.

### To start services

`$ npm run serve`

Access the UI at `http://localhost:4200`
