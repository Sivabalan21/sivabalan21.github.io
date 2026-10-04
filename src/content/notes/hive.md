---
title: Hive
paper: "Hive – A Petabyte Scale Data Warehouse Using Hadoop"
authors: Thusoo, Sen Sarma, Jain, et al.
venue: ICDE 2010
theme: Batch processing
summary: SQL-like queries compiled into DAGs of MapReduce jobs over files in HDFS, with a catalog that gives those files a schema.
order: 4
---

## The problem

Facebook's data went from 15 TB to 700 TB, and the commercial warehouse couldn't keep up: some daily jobs took more than a day. Hadoop could process the data, but analysts had to write MapReduce programs just to get counts or averages. Hive brings tables, columns, partitions, and a subset of SQL to data that's really just files in HDFS.

## How it works

- **Metastore.** A catalog of tables, columns, types, partitions, and file locations. It's kept in a regular relational database (MySQL at Facebook), not in HDFS, because the compiler needs it with low latency. Mappers and reducers never call it. Everything they need is baked into the plan.
- **Storage mapping.** A table is a directory, a partition is a subdirectory (`ds=2009-01-01/hr=12`), and a bucket is a file.
- **SerDe.** A pluggable serializer/deserializer lets Hive read existing data in its original format without converting it. LazySerDe deserializes a column only if the query actually uses it.
- **Compiler.** HiveQL is parsed into an AST, checked against the Metastore, turned into an operator DAG, optimized by rules, and split into MapReduce and HDFS tasks.

## Optimizations

- **Column pruning**: only read the columns the query needs.
- **Predicate pushdown**: filter as early as possible.
- **Partition pruning**: a filter on the partition column skips whole directories.
- **Map-side joins**: replicate a small table to every mapper and skip the shuffle.
- **Skew handling**: a two-stage GROUP BY, where data is first spread randomly for partial aggregation and then aggregated by key. This stops a few hot keys from overloading a few reducers.
- **Hash-based partial aggregation in mappers**, to shrink what gets shuffled.

## Design decisions and tradeoffs

**No INSERT INTO, UPDATE, or DELETE.** Writes are `INSERT OVERWRITE` of a table or partition. That sounds limiting, but most data arrived as daily or hourly loads into new partitions anyway, and it meant Hive didn't need complex locking between readers and writers.

**Multi-table insert.** One scan of the input can feed several aggregations into different tables, so the expensive join runs once.

**The cost.** Every query becomes one or more MapReduce jobs, with intermediate results written to HDFS between them. Fine for batch reporting, slow for interactive questions.

## Connections

- Partition pruning and column pruning are the same "don't read what you don't need" idea as Catalyst's projection pruning and pushdown in [Spark SQL](/notes/spark-sql).
- Shark, the predecessor to Spark SQL, was Hive running on Spark. Spark SQL still uses Hive's data model and can read the Hive catalog.
- The skew problem is the general version of what happens with [MapReduce](/notes/mapreduce) reducers when a few keys dominate the data.
