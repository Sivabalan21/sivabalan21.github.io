---
title: E-Commerce Recommendation Platform
short: Recommendations
summary: Collaborative filtering on 75M+ Amazon reviews, with streaming order ingestion and a model served behind a REST API.
context: NYU course project
start: "2026-04"
end: "2026-05"
period: Apr – May 2026
stack: [Spark MLlib, GraphFrames, Kafka, Ray Tune, Ray Serve, Python]
results:
  - Trained on 75M+ Amazon reviews with Spark MLlib ALS
  - Re-ranked candidates with GraphFrames PageRank
  - Served as a REST API on Ray Serve, with live orders streamed through Kafka
order: 2
links: []
# TODO: add GitHub link
---

## Problem

Build a recommendation system that works end to end: train on a large dataset, keep up with new activity, and serve recommendations to other services, instead of stopping at a model in a notebook.

## What I built

**Training.** A collaborative-filtering model on 75M+ Amazon reviews using alternating least squares (ALS) in Spark MLlib. ALS factorizes the sparse user–item rating matrix into user and item vectors, and Spark distributes the work across the cluster.

**Re-ranking.** ALS only learns from co-rating patterns. I re-ranked its candidates using PageRank scores computed with GraphFrames, which adds a signal from graph structure.

<!-- TODO: say what the graph is (nodes and edges) and why PageRank helped. -->

**Streaming.** New orders arrive through Kafka, so the system sees fresh activity instead of only a static snapshot.

**Tuning and serving.** Hyperparameters were tuned with Ray Tune, and the final model is deployed as a REST API on Ray Serve.

<!-- TODO: Architecture diagram: Kafka → Spark (ALS) → GraphFrames re-rank → Ray Serve API. -->

<!-- TODO: add an "Evaluation" section with numbers: RMSE / precision@k before and after re-ranking, tuning gains from Ray Tune, serving latency or throughput. This section is much stronger with them. -->
