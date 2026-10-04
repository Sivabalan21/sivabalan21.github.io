---
title: MapReduce
paper: "MapReduce: Simplified Data Processing on Large Clusters"
authors: Dean, Ghemawat
venue: OSDI 2004
theme: Batch processing
summary: A restricted programming model that lets the framework handle parallelism, data movement, and failures for you.
order: 1
---

## The problem

Google had hundreds of computations over huge inputs: building inverted indexes, counting URL accesses, summarizing crawled pages. Each one was simple on its own. The hard part was everything around it: splitting the input across thousands of machines, moving intermediate data, and surviving machines that failed halfway through. That surrounding code buried the actual logic.

## How it works

You write two functions. `map` takes one input record and emits intermediate key/value pairs. `reduce` gets one key and all the values for it, and produces the output.

The framework handles the rest:

1. It splits the input into M pieces of roughly 16–64 MB and starts a master plus many workers.
2. Map workers read their split, run `map`, and write output to **local disk**, partitioned into R regions with something like `hash(key) mod R`.
3. Reduce workers pull their region from every map worker, **sort by key** so equal keys sit together, and call `reduce` once per key.
4. Each reduce task writes one output file.

The shuffle between map and reduce, all-to-all over the network, is where most of the cost sits.

## Design decisions and tradeoffs

**Re-execution as fault tolerance.** The master pings workers. If one dies, its tasks are rescheduled elsewhere. Even *completed* map tasks rerun, because their output lived on the dead machine's local disk. Completed reduce output is already in GFS, so it survives. This only works because map and reduce are expected to be deterministic and side-effect free.

**Atomic commits.** Tasks write to temporary files, and the result is committed with an atomic rename. If two copies of a task run, only one result lands.

**Locality.** Network bandwidth was the scarce resource, so the master schedules map tasks on or near a machine holding a replica of the input block. In large jobs, most input is read from local disk.

**Backup tasks for stragglers.** Near the end of a job, the master launches duplicate copies of the remaining tasks and takes whichever finishes first. Turning this off made their sort benchmark take 44% longer.

**Combiners.** When `reduce` is associative and commutative, as in word count, partial aggregation runs on the map side so far less data crosses the network.

The cost of all this is the restriction itself. Anything iterative becomes a chain of jobs, and every job writes its full output to the distributed file system before the next one can read it.

## Connections

- That write-everything-to-disk cost is exactly what [Spark's RDDs](/notes/spark-rdd) were built to remove.
- [Hive](/notes/hive) compiles SQL into DAGs of MapReduce jobs, because writing raw `map` and `reduce` for every count or average was too slow for analysts.
- Backup tasks show up again in RDDs and [Spark Streaming](/notes/spark-streaming) as speculative execution.
