---
title: Bigtable
paper: "Bigtable: A Distributed Storage System for Structured Data"
authors: Chang, Dean, Ghemawat, et al.
venue: OSDI 2006
theme: Storage and coordination
summary: A sparse, sorted, distributed map built from an immutable on-disk format, a write-ahead log, and an external lock service.
order: 2
---

## The problem

Google needed one storage system for very different workloads: web pages, satellite imagery, analytics clicks, per-user search history. Some were batch jobs reading terabytes. Some served users and needed low latency. A full relational database across thousands of commodity machines wasn't practical, and a plain key/value store was too limiting.

## The data model

Bigtable is a sparse, distributed, persistent, multi-dimensional **sorted map**:

`(row: string, column: string, timestamp: int64) → bytes`

- Rows are kept in **lexicographic order** and split into ranges called **tablets**, the unit of distribution and load balancing. Choosing the row key is how you control locality. Webtable stores `maps.google.com` as `com.google.maps` so pages from the same domain sit next to each other.
- Columns are grouped into **column families**, which carry access control and compression settings.
- Each cell keeps multiple **timestamped versions**, with garbage collection by "keep the last n" or "keep the last 7 days".
- Writes to a **single row are atomic**. There are no transactions across rows.

## How a tablet server works

- **Writes** go to a commit log in GFS, then into an in-memory sorted buffer, the **memtable**.
- When the memtable grows too large, it's frozen and written out as an **SSTable**: an immutable, sorted file of blocks with an index. This is a *minor compaction*.
- **Reads** merge the memtable with the stack of SSTables. Because both are sorted, the merge is cheap.
- **Merging compactions** periodically combine SSTables so reads don't have to touch too many files. A *major compaction* rewrites everything into one SSTable and finally drops deleted data.

## Design decisions and tradeoffs

**Coordination lives in Chubby.** A Paxos-replicated lock service ensures there's one master, stores where the root tablet is, and tracks live tablet servers through exclusive locks on files. The tradeoff is a hard dependency: if Chubby is unavailable, Bigtable is unavailable.

**Clients don't go through the master.** Tablet locations sit in a three-level hierarchy (Chubby file → root tablet → METADATA tablets), and clients cache them. The master only handles assignment and schema, so it stays lightly loaded.

**Immutability simplifies everything.** Since SSTables never change, reads need no locks on files, deletion becomes garbage collection of old SSTables, and a tablet split just lets both children share the parent's files.

**Performance refinements:**
- Locality groups split column families into separate SSTables, so reading page metadata doesn't drag page contents along.
- Bloom filters skip SSTables that can't contain a row/column.
- One shared commit log per server keeps writes sequential, at the cost of more complex recovery. They solved that by sorting the log by tablet before replaying it.

The paper's own most important lesson is about simplicity. Their tablet-server membership protocol went through several complex redesigns before they replaced it with a simpler one that depended only on widely used Chubby features.

## Connections

- Memtable + immutable sorted files + compaction is the log-structured merge tree, the same shape used by most modern write-heavy stores.
- The coordination split mirrors [ZooKeeper](/notes/zookeeper): keep the critical, small, consistent state in a separate replicated service and keep the data path out of it.
- Row-key design for locality is the same instinct as designing a compound index around how the data is actually queried.
