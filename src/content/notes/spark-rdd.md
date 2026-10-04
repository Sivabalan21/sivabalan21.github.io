---
title: Spark and RDDs
paper: "Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing"
authors: Zaharia, Chowdhury, Das, et al.
venue: NSDI 2012
theme: The Spark stack
summary: Immutable, partitioned datasets that remember how they were built, so lost data is recomputed instead of replicated.
order: 6
---

## The problem

MapReduce-style systems had no way to keep data in memory between jobs. Two kinds of workloads suffered:

- **Iterative algorithms** like PageRank, k-means, and logistic regression, which reread the same data on every iteration.
- **Interactive analysis**, where you run many queries over the same subset of data.

In both, the only way to reuse data between steps was to write it to a distributed file system: replication, disk I/O, and serialization on every step. Specialized systems like Pregel kept data in memory, but each only for its own pattern.

The hard part was fault tolerance. Distributed shared memory supports fine-grained updates, but recovering it means checkpointing or logging every update across the cluster, which is expensive.

## The idea

An **RDD** is a read-only, partitioned collection of records. You can only create one from stable storage or by applying a **coarse-grained transformation** (`map`, `filter`, `join`, and so on) to other RDDs.

Because transformations apply the same function to many records, Spark doesn't log the data. It logs the **lineage**: the graph of transformations that produced each RDD. If a partition is lost, Spark recomputes just that partition from its parents, in parallel, without rolling back the whole program.

Other pieces:
- **Lazy evaluation.** Transformations only build the lineage graph. Actions like `count` or `save` trigger execution.
- **`persist`.** You choose what to keep in memory (or spill to disk) for reuse.
- **Partitioning control.** You can hash-partition two datasets the same way so a later join doesn't need a shuffle.

## Narrow and wide dependencies

- **Narrow**: each parent partition feeds at most one child partition (`map`, `filter`). These can be pipelined on one machine, and recovering a lost partition touches only its parent.
- **Wide**: a child partition needs data from many parent partitions (`groupByKey`, most `join`s). These need a shuffle, and losing a partition can mean recomputing from many parents.

The scheduler groups pipelinable narrow transformations into **stages** and cuts stage boundaries at shuffles, which works much like MapReduce's map/reduce split, generalized to arbitrary DAGs.

## Design decisions and tradeoffs

**Restriction buys cheap fault tolerance.** RDDs are a bad fit for fine-grained, asynchronous updates to shared state, such as a web crawler's storage. That's the price. In exchange, recovery is cheap and no snapshot of the whole program is needed.

**Immutability enables backup tasks.** Two copies of a straggling task can't interfere with each other, so speculative execution works as it does in MapReduce.

**Long lineage needs checkpoints.** For iterative jobs whose lineage grows without bound, Spark lets you checkpoint some RDDs to stable storage. Since RDDs are immutable, that happens in the background without pausing anything.

The paper reports up to 20× speedups over Hadoop on iterative applications.

## Connections

- This is the fix for the write-everything-to-disk cost of chained [MapReduce](/notes/mapreduce) jobs.
- [Spark SQL](/notes/spark-sql), [Spark Streaming](/notes/spark-streaming), [MLlib](/notes/mllib), and [GraphX](/notes/graphx) are all built on this one abstraction.
- Lineage-based recovery is a different answer to the same question [Flink](/notes/flink) answers with distributed snapshots.
