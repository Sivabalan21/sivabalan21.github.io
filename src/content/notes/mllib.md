---
title: MLlib
paper: "MLlib: Machine Learning in Apache Spark"
authors: Meng, Bradley, Yavuz, et al.
venue: JMLR 2016
theme: The Spark stack
summary: Distributed ML algorithms built on Spark, and a pipeline API that chains featurization and training over DataFrames.
order: 9
---

## The problem

Machine learning algorithms are mostly iterative: gradient descent, ALS, k-means. On MapReduce, every iteration is a job that rereads its input from disk and pays scheduling overhead. Spark's in-memory RDDs fixed the iteration cost, but Spark didn't ship a solid set of scalable algorithms until MLlib.

## What it provides

- **Algorithms**: linear models, naive Bayes, decision tree ensembles, **ALS for collaborative filtering** (explicit and implicit feedback), k-means, and PCA.
- **Primitives**: distributed linear algebra, statistics, optimization, and feature extraction, with native C++ linear algebra libraries on each worker.
- **`spark.ml` pipelines**: chain stages like tokenizer → feature hashing → logistic regression, where each stage reads input columns of a DataFrame and adds output columns. The whole workflow can then be tuned as one unit.

## Design decisions and tradeoffs

The interesting part is the systems work behind the algorithms:

- **ALS uses blocking** to cut JVM garbage-collection overhead and to use higher-level linear algebra operations.
- **Decision trees** discretize features based on the data to reduce communication, and parallelize both within and across trees.
- **Tree-structured aggregation** combines partial results in stages so the driver doesn't become the bottleneck, and **broadcast** ships large models to workers efficiently.
- **DataFrames as the exchange format** meant each algorithm only had to be written once and then exposed in every language Spark supports, instead of reimplementing types like labeled points per language.

Being part of Spark means improvements to the core engine speed up MLlib without changes to the library itself. The 1.1 release averaged about 3× faster than 1.0 across algorithms, partly from algorithm changes and partly from better communication in Spark.

The ALS benchmark used scaled copies of the **Amazon Reviews dataset**. On a 16-node cluster, MLlib was far faster than Mahout on Hadoop MapReduce, whose per-iteration scheduling overhead dominated.

## Connections

- My [recommendation project](/projects/recommendation-platform) trained Spark MLlib ALS on 75M+ Amazon reviews, the same algorithm and the same kind of data this paper benchmarks.
- Pipelines depend on [Spark SQL's](/notes/spark-sql) DataFrames and user-defined types: an ML vector is stored as a UDT built from primitive fields.
- MLlib's speedups over Mahout are the [RDD](/notes/spark-rdd) argument applied to ML: keep data in memory across iterations.
