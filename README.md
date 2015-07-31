
This repository is a web server / visualization that visualizes traces in Mesos.
This is built upon the traces work done here http://github.com/tnachen/mesos/tree/libprocess_trace

###To start mesos with trace enabled
Grab the source tree and build mesos, then start mesos-master and mesos-slave with LIBPROCESS_TRACE_ENABLED=1 env variable.

###To ingest local data into redis:

This assumes all the tracing data is installed into a local redis instance.

```shell
$ tail -f -c +1 <path> | python -u populate_trace_db.py
```

###Install

npm install

###To start services

Start the redis server (default localhost on port 6379)

npm run serve

Access traces at `http://<ip>:<port>`
