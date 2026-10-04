---
title: ZooKeeper
paper: "ZooKeeper: Wait-free coordination for Internet-scale systems"
authors: Hunt, Konar, Junqueira, Reed
venue: Yahoo!, 2010
theme: Storage and coordination
summary: A small, replicated tree of data nodes with ordering guarantees and watches, on which clients build their own locks, leader election, and membership.
order: 3
---

## The problem

Distributed applications keep needing the same things: configuration, group membership, leader election, locks. Building a separate service for each is wasteful. Chubby offers locks, but locks are blocking, so a slow or failed client can hold everyone else up.

ZooKeeper's answer is to provide primitives *for building* coordination, not the coordination itself.

## The model

- Data is a tree of **znodes**, addressed like file paths (`/app1/p_1`). Each znode holds a small amount of data plus a version number.
- **Regular** znodes live until deleted. **Ephemeral** znodes disappear when the client's session ends, which is how you detect that a process died.
- The **sequential** flag appends a monotonically increasing counter to the name.
- **Watches** are one-time notifications that something changed, so clients can cache instead of polling.
- Updates can be **conditional on a version**, giving compare-and-set behavior.

There are no lock or open/close operations in the API. Every call is wait-free.

## Guarantees

1. **Linearizable writes**: all updates are totally ordered.
2. **FIFO client order**: one client's requests run in the order it sent them, even when sent asynchronously.

Reads are served by whichever server the client is connected to and **may be stale**. If you need the latest value, call `sync` first.

## How it works

Writes are forwarded to a leader, turned into **idempotent transactions**, and broadcast with **Zab**, an atomic broadcast protocol that needs a majority. With 2f + 1 servers it tolerates f failures. Every server keeps the full tree in memory, with a write-ahead log and periodic snapshots. Snapshots are "fuzzy", taken without locking, which is safe because replaying idempotent transactions in order lands on the correct state anyway.

## Design decisions and tradeoffs

**Reads scale, writes don't.** Local reads mean read throughput grows as you add servers: 460k ops/s with 13 servers at 100% reads. Write throughput *falls* with more servers, because every write goes through broadcast and a disk log. That's the right trade for coordination data, which is read far more than written.

**Recipes instead of features.** The lock recipe shows the style: each client creates an `EPHEMERAL|SEQUENTIAL` node, and the lowest number holds the lock. Each client watches only the node just before its own. When a lock is released, exactly one client wakes up, avoiding the herd effect where everyone rushes at once. A crashed client's node disappears automatically.

**The ready-znode pattern.** A new leader deletes `ready`, updates the configuration, then recreates `ready`. Because of FIFO ordering and watch ordering, anyone who sees `ready` also sees the full configuration.

## Connections

- [Kafka](/notes/kafka) in this paper uses ZooKeeper for broker and consumer membership, partition ownership, and consumer offsets, using exactly these ephemeral nodes and watches.
- Same idea as Chubby in [Bigtable](/notes/bigtable): keep small, critical state in a consistent service and keep bulk data out of it.
- Idempotent operations replayed in order is the same trick [Flink](/notes/flink) and [Spark Streaming](/notes/spark-streaming) rely on for recovery.
