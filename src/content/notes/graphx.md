---
title: GraphX
paper: "GraphX: Graph Processing in a Distributed Dataflow Framework"
authors: Gonzalez, Xin, Dave, Crankshaw, Franklin, Stoica
venue: OSDI 2014
theme: The Spark stack
summary: Graph computation expressed as joins and group-bys over vertex and edge collections, with graph-specific tricks recast as database optimizations.
order: 10
---

## The problem

Specialized graph systems like Pregel and PowerGraph were fast at iterative algorithms like PageRank, but a real pipeline also needs to build the graph, clean data, join with other tables, and analyze results. That meant moving data between a graph system and a general dataflow system, and graph systems usually relied on checkpoints for fault tolerance, which users often turned off.

GraphX asks whether a general dataflow system can match specialized graph systems if it borrows their optimizations.

## The model

A property graph is two collections:

- **Vertices**: `(id, property)`
- **Edges**: `(srcId, dstId, property)`

The **triplets view** joins each edge with the properties of both endpoints. Most graph algorithms then fit one pattern, `mrTriplets`: map over triplets to produce messages, then group by destination vertex to combine them. PageRank is: send weighted rank along each edge, sum at each vertex, repeat. In dataflow terms it's a join followed by a group-by.

## How it gets fast

Classic database techniques, applied to graphs:

- **Vertex-cut partitioning.** Edges are partitioned across machines, and vertices are copied to wherever their edges are. A **routing table** records which edge partitions need which vertices. Natural graphs have a few very high-degree vertices, and splitting by edges spreads that load better.
- **Indexes** inside edge partitions allow scans of only the active edges.
- **Incremental view maintenance.** Later iterations often change only a few vertices, so only those are re-sent to the edge partitions.
- **Automatic join elimination.** GraphX inspects the user's function bytecode. If it only reads the source vertex, as in PageRank, a three-way join becomes a two-way join. On the Twitter graph this cut data transferred in half.

## Design decisions and tradeoffs

Being built on Spark means **lineage-based fault tolerance** with almost no overhead, plus the rest of Spark for everything before and after the graph step. The cost is some raw speed: a C++, shared-memory system like GraphLab can still be faster on pure graph workloads. GraphX's argument is that being within reach of specialized systems, while running the whole pipeline in one engine, wins overall.

## Connections

- My [recommendation project](/projects/recommendation-platform) re-ranked ALS candidates using PageRank from GraphFrames, a graph library on Spark DataFrames that follows the same idea of graphs as tables.
- Join elimination is the same instinct as [Catalyst's](/notes/spark-sql) projection pruning: don't move data the computation never reads.
- Vertex-cut is a placement decision, like choosing [Bigtable](/notes/bigtable) row keys or [Kafka](/notes/kafka) partition keys: where data lives determines how much has to move.
