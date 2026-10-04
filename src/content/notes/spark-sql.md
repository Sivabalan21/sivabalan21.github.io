---
title: Spark SQL
paper: "Spark SQL: Relational Data Processing in Spark"
authors: Armbrust, Xin, Lian, et al.
venue: SIGMOD 2015
theme: The Spark stack
summary: DataFrames that capture queries as expression trees, and Catalyst, an optimizer written as pattern-matching rules over those trees.
order: 7
---

## The problem

RDD transformations take arbitrary functions, which the engine can't look inside. So Spark couldn't do relational optimizations like reading only the needed columns, pushing filters into storage, or choosing join strategies. Shark, which ran Hive on Spark, had optimizations but only worked on Hive tables, could only be called with SQL strings, and inherited an optimizer built for MapReduce.

Real pipelines need both: relational queries for ETL and aggregation, and procedural code for ML, graphs, and custom parsing.

## DataFrames

A DataFrame is a distributed collection of rows **with a schema**. The key difference from RDDs is that expressions like `users("age") < 21` aren't Scala functions. They build an **abstract syntax tree**, so the engine can see what the query does.

DataFrames are lazy, like RDDs: each one is a logical plan, and optimization happens across the whole plan when an output operation runs. They can be built from Hive tables, external sources, or existing RDDs of native objects, with schema inferred by reflection, and you can drop back to RDDs at any point. Cached DataFrames are stored in a compressed columnar format instead of as JVM objects.

## Catalyst

Catalyst represents everything as **immutable trees** and transforms them with **rules**, written as ordinary Scala pattern matching:

```scala
tree.transform {
  case Add(Literal(c1), Literal(c2)) => Literal(c1 + c2)
}
```

Rules are grouped into batches and run until the tree stops changing. A query passes through four phases:

1. **Analysis**: resolve table and column names against the catalog and assign types.
2. **Logical optimization**: constant folding, predicate pushdown, projection pruning, null propagation, and more.
3. **Physical planning**: generate candidate physical plans and pick one with a cost model. At the time, cost was mainly used to choose broadcast joins for small tables.
4. **Code generation**: compile expressions into JVM bytecode with Scala quasiquotes, avoiding the virtual calls and branching of interpreting a tree for every row.

## Design decisions and tradeoffs

**A general-purpose language instead of an optimizer DSL.** Earlier extensible optimizers needed their own rule language and compiler. Plain Scala made rules short (the analyzer was about 1,000 lines and logical optimization about 800) and easy for outside contributors to add.

**Extension points.** Data sources can implement increasingly capable interfaces, from a full scan, to a scan with column pruning, to a scan that also takes filters, so Spark can push work down into Parquet or a JDBC database. User-defined types map to built-in types, which is how MLlib's vector type works.

**Results.** Competitive with Impala on the AMPLab benchmark, a DataFrame aggregation 12× faster than the same logic in the Python RDD API, and 2× faster than separate SQL and Spark jobs on a mixed pipeline, because the stages get pipelined instead of written out in between.

## Connections

- Column pruning, predicate pushdown, and partition pruning carry over directly from [Hive](/notes/hive).
- The general lesson, *don't move or decode data you won't use*, is the same idea behind field projection and early filtering in a database query.
- [MLlib's](/notes/mllib) pipeline API exchanges DataFrames between stages.
