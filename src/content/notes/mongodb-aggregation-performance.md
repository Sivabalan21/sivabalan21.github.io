---
title: MongoDB aggregation performance
paper: "Notes from optimizing a production batch pipeline"
authors: Siva Balan
venue: Ezee.ai, 2022–2025
theme: Databases in practice
summary: How aggregation pipelines actually execute, where they get slow, and the techniques that took a production batch pipeline from 180 minutes to 20.
order: 0
---

## Why this note exists

At Ezee.ai, a batch pipeline in the Performance Management Platform took about **180 minutes** per run and had been a known problem for over two years. After the rework it ran in **about 20**. These notes cover how aggregation performance works and the techniques behind that change. I've written them generally, because the schema belongs to the product.

What the rework combined: understanding the end-to-end processing flow, finding the bottlenecks, tuning the aggregations, improving compound indexes, projecting away unneeded fields, adding Redis caching, switching to bulk writes, redesigning parts of the pipeline, and measuring the result.

The main lesson: the fix wasn't one clever query. It was understanding the whole processing flow first, then removing work at every layer.

## How an aggregation runs

An aggregation is a pipeline of stages (`$match`, `$project`, `$group`, `$lookup`, `$sort`, and so on). Each stage takes documents in and passes documents out.

What matters for performance:

- **Only the start of the pipeline can use indexes.** A leading `$match` or `$sort` can use an index. Once a stage reshapes documents, for example with `$group` or `$unwind`, everything after it works on in-memory results.
- **Every stage pays for every document it receives.** Fewer documents, and smaller documents, entering each stage is most of the game.
- **Some stages have memory limits.** Blocking stages like `$group` and `$sort` have a per-stage memory limit (100 MB). Past that they either fail or spill to disk with `allowDiskUse`, which works but is slow.

## Read the plan first

`explain("executionStats")` tells you what actually happened:

- `COLLSCAN` vs `IXSCAN`: did it scan the whole collection or use an index?
- `totalDocsExamined` vs `nReturned`: if the query examines far more documents than it returns, the filtering isn't happening in the index.
- `totalKeysExamined`: how much of the index was walked.
- An in-memory `SORT` stage: the sort couldn't use an index.

Measuring before changing anything is what turns guessing into engineering.

## The techniques

**Filter early, on indexed fields.** Put `$match` first so the index does the filtering and later stages see only the documents they need.

**Design compound indexes around the query, not the schema.** A useful rule for field order is equality, sort, range (ESR): fields matched exactly first, then fields you sort on, then range conditions. The wrong order can turn an index scan into a much larger one, or force an in-memory sort.

**Project early.** Documents in collection-heavy systems carry many fields that a given computation never reads. Dropping them with `$project` right after `$match` shrinks every later stage. If the index contains every field the query needs, MongoDB can answer from the index alone (a covered query) without fetching documents.

**Be careful with `$lookup` and `$unwind`.** `$lookup` runs once per input document. Without an index on the joined collection's `foreignField`, each of those runs scans the collection. `$unwind` multiplies documents, so unwinding before filtering can blow up the work for every later stage.

**Cache what doesn't change per run.** Reference data that the pipeline looks up again and again doesn't need to come from the database each time. Redis caching removed repeated round trips. The tradeoff is invalidation: cache only data whose staleness you can reason about.

**Write in bulk.** Updating results one document at a time costs a network round trip per document. `bulkWrite` batches them, and `ordered: false` lets the server keep going past individual failures instead of stopping at the first one.

**Redesign the flow, not just the queries.** Part of the work was changing the processing pipeline itself, not only individual queries, so that its steps matched how the data was actually accessed and the pipeline did less work overall.

## Tradeoffs

- Every index speeds up some reads and slows down every write to that collection, and it costs memory. Add indexes for real access patterns, not hypothetical ones.
- Caching adds a second source of truth.
- Bulk writes with `ordered: false` need you to handle partial failures explicitly.

## Connections

- "Don't move data you won't use" is the same idea behind projection pruning in [Spark SQL](/notes/spark-sql) and column pruning in [Hive](/notes/hive).
- Choosing a compound index around access patterns is the same instinct as choosing a [Bigtable](/notes/bigtable) row key.
- The full story of the rework is on the [Experience](/experience#pipeline) page.
