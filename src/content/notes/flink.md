---
title: Apache Flink
paper: "Apache Flink: Stream and Batch Processing in a Single Engine"
authors: Carbone, Katsifodimos, Ewen, Markl, Haridi, Tzoumas
venue: IEEE Data Engineering Bulletin 2015
theme: Logs and streams
summary: A streaming dataflow engine where batch is just a bounded stream, with exactly-once state from asynchronous barrier snapshots.
order: 11
---

## The problem

Batch and streaming were handled by different systems with different APIs. The "lambda architecture" ran both: a fast streaming path for approximate results and a batch path for correct results later. That meant writing business logic twice, running two systems, and still mishandling time, since data was cut into hourly or daily files regardless of when events happened.

Flink's position is that streaming is the general case and batch is a stream that ends.

## How it works

- Every program, batch or streaming, compiles to a **dataflow graph** of stateful operators connected by streams, executed by one runtime. A JobManager coordinates and TaskManagers do the work.
- Data moves between operators as **pipelined** streams with backpressure, or as **blocking** streams that materialize fully, for stages that need to be isolated.
- Records are packed into **buffers** sent when full or after a timeout. The timeout directly trades latency for throughput: about 20 ms p99 latency at 1.5M events/s, versus over 80M events/s at about 50 ms.

## Fault tolerance: asynchronous barrier snapshots

Flink provides **exactly-once state updates** without pausing the job:

1. The coordinator injects **checkpoint barriers** into the sources. Barriers flow through the stream with the data.
2. An operator with several inputs waits until a barrier has arrived on all of them (**alignment**), then saves its state, such as window contents, to durable storage, and forwards the barrier.
3. When every operator has saved its state, that's a consistent global snapshot.

On failure, every operator restores from the last snapshot and the sources **rewind** to the matching positions. That's why it needs replayable sources like Kafka. Because the graph is a DAG and alignment is used, in-flight records don't need to be saved, only operator state.

## Time and windows

- **Event time** (when it happened) vs. **processing time** (when the machine saw it).
- **Watermarks** carry progress through the stream: "no events earlier than t are still coming". An operator with several inputs forwards the minimum.
- Windows are defined by an **assigner**, an optional **trigger** (when to emit), and an optional **evictor** (what to keep), which covers sliding, session, count, and custom windows.

## Design decisions and tradeoffs

For bounded data, Flink still adds batch-specific machinery: a cost-based optimizer for DataSet programs, blocking operators that spill to disk, memory management on serialized binary data to avoid JVM garbage collection, and recovery by replaying from the last materialized stream instead of snapshotting. One runtime doesn't mean ignoring what batch makes possible.

## Connections

- The opposite design choice from [Spark Streaming](/notes/spark-streaming): continuous record-at-a-time processing with snapshots, instead of tiny batch jobs with lineage. Flink gives lower latency, while D-Streams get recovery and straggler handling almost for free from the batch model.
- Exactly-once here rests on [Kafka's](/notes/kafka) replayable, offset-addressed log.
- Barrier snapshots follow the same idea as Chandy–Lamport snapshots, simplified because the dataflow is a DAG.
