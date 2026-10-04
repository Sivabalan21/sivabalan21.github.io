---
title: Spark Streaming
paper: "Discretized Streams: Fault-Tolerant Streaming Computation at Scale"
authors: Zaharia, Das, Li, Hunter, Shenker, Stoica
venue: SOSP 2013
theme: Logs and streams
summary: Treat a stream as a series of very small, deterministic batch jobs, so batch-style recovery and straggler handling come for free.
order: 8
---

## The problem

Streaming systems at the time were built from long-running operators, each holding mutable state and processing records one at a time. At hundreds of nodes, failures and slow nodes are normal, and those systems handled them poorly:

- **Replication** runs two copies of everything, doubling hardware.
- **Upstream backup** buffers sent data and replays it into a fresh node after a failure, but one node rebuilds all the state serially, which is slow.
- Neither handles **stragglers**. A slow node is either treated as failed or slows down its replica too.

## The idea

A **D-Stream** chops the input into small time intervals, for example every second. Each interval's data is stored as an RDD and processed by a short, deterministic batch job, and the results, including any state like running counts, are themselves RDDs.

Because each step is a deterministic function of its inputs, there's no need for synchronization protocols between replicas. The lineage graph says exactly how to recompute anything.

## How recovery works

- **Parallel recovery.** When a node fails, its lost RDD partitions, across both operators and time steps, are recomputed **in parallel on many other nodes**. Each node does a small piece, so recovery is much faster than one replacement node replaying everything.
- **Stragglers** are handled with speculative execution, as in batch jobs.
- State RDDs are **checkpointed** periodically so lineage doesn't grow without bound. Since RDDs are immutable, this doesn't block processing.

## Design decisions and tradeoffs

**Latency has a floor.** End-to-end latency is tied to the interval size, around 0.5–2 seconds in the paper. That's not suitable for millisecond-level needs, but the authors argue it's enough for applications like trend detection or log monitoring, which run on human timescales.

**Windows as incremental reduces.** `reduceByWindow` over a sliding window can add the newest interval and, if the function is invertible, subtract the interval that left the window, rather than recomputing the whole window.

**One model for batch and streaming.** Because a D-Stream is just RDDs, you can join a stream with a historical dataset or run ad hoc queries over stream state, using the same engine.

The paper reports over 60 million records per second on 100 nodes at sub-second latency, with recovery from faults and stragglers in under a second.

## Connections

- Built directly on [RDD lineage](/notes/spark-rdd). The same determinism that makes batch recovery cheap makes streaming recovery cheap.
- [Flink](/notes/flink) takes the opposite approach: true record-at-a-time streaming, with distributed snapshots for consistency. Micro-batches versus continuous dataflow with checkpoints is the central tradeoff between the two systems.
- [Kafka](/notes/kafka) is the natural input. A replayable source is what makes reprocessing possible.
