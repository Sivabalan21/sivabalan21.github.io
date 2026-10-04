---
title: Kafka
paper: "Kafka: a Distributed Messaging System for Log Processing"
authors: Kreps, Narkhede, Rao
venue: NetDB 2011
theme: Logs and streams
summary: A partitioned, append-only log on disk, where consumers pull and track their own position.
order: 5
---

## The problem

LinkedIn generated huge volumes of log data, such as page views, clicks, and service metrics, and it was no longer only for offline analytics. Search relevance, recommendations, and newsfeeds needed it within seconds.

Traditional message queues didn't fit. They had per-message acknowledgement and delivery state, weak support for partitioning across machines, and performance that dropped when messages piled up for slow, offline consumers. Log aggregators like Scribe and Flume were built for offline loading, not real-time consumers.

## The model

- A **topic** is split into **partitions**, spread across **brokers**.
- Producers append to a partition, chosen randomly or by a partitioning key.
- Consumers **pull** from brokers at whatever rate they can sustain.
- A **consumer group** shares a topic, with each partition read by exactly one consumer in the group. Different groups each get the full stream independently.

## How a partition works

- A partition is a **logical log**, stored as segment files of about 1 GB. Producers only ever append to the last segment.
- A message has **no ID**. It's addressed by its byte **offset** in the log. That removes the need for a random-access index, apart from a small in-memory list of segment start offsets.
- **No application-level cache.** Kafka relies on the OS page cache. Reads and writes are sequential, so read-ahead and write-behind work well, data isn't buffered twice, and the cache stays warm across broker restarts.
- **sendfile** moves bytes from file to socket without copying through user space.

## Design decisions and tradeoffs

**Stateless brokers.** The broker doesn't track who consumed what. Consumers keep their own offset, stored in ZooKeeper in this paper. Since the broker can't know when everyone is done with a message, it deletes by **time-based retention**, typically 7 days.

That leads to the feature traditional queues don't have: a consumer can **rewind** and reprocess. If a consumer had a bug, or crashed before flushing to its own store, it replays from an earlier offset.

**The partition is the unit of parallelism.** One partition goes to one consumer per group, so consumers never coordinate on individual messages. Rebalancing only happens when brokers or consumers join or leave, and is coordinated through ZooKeeper's ephemeral nodes and watches. You over-partition topics so load spreads evenly.

**Delivery is at-least-once.** After a crash, a consumer may see messages again from its last committed offset. Ordering is guaranteed only within a partition. Deduplication is the application's job. Exactly-once would have needed two-phase commit, which they chose not to pay for.

**Throughput over durability, at the time.** Producers didn't wait for acknowledgements, and there was no replication yet, so a dead broker's unconsumed messages were unavailable. In their tests a single producer reached about 400k messages/s with batches of 50, and each message cost 9 bytes of overhead versus 144 in ActiveMQ.

## Connections

- An append-only log addressed by offset is the same structure as the commit logs in [Bigtable](/notes/bigtable) and [ZooKeeper](/notes/zookeeper), exposed as the product instead of hidden inside it.
- Replayable sources like Kafka are what make exactly-once state possible in [Flink](/notes/flink): on failure, rewind the source to the offset stored in the snapshot.
- I've used Kafka for event-driven services at work and to stream orders in my [recommendation project](/projects/recommendation-platform). The at-least-once guarantee is why idempotent consumers matter in practice.
