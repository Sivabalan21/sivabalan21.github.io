---
title: Behavioural Analysis of Ransomwares
short: Ransomware
kind: "Systems · Windows kernel"
highlight: "A kernel minifilter that blocks encryption-like writes before they reach the file system"
summary: A Windows minifilter driver in C++ that watches file-system I/O in the kernel, spots encryption-like changes with fuzzy hashing and entropy, and blocks malicious writes in real time.
context: Amrita B.Tech project
period: Aug – Nov 2021
stack: [C++, Windows Kernel, Filter Manager]
results:
  - Real-time detection at the file-system I/O layer, inside the kernel
  - Malicious write requests blocked before they reached the file system
  - Deployed through custom INF manifests (load-order group, altitude, instance flags)
order: 5
links: []
---

## Problem

Ransomware does its damage through ordinary file operations: it opens your files, writes encrypted bytes over them, and closes them. By the time a user-mode scanner notices, many files can already be gone. I wanted to detect that behaviour where it actually happens, in the file-system I/O path, and stop it before the writes landed.

## What I built

A **Windows minifilter driver** in C++. Minifilters plug into the **Filter Manager**, which sits between applications and the file system and lets a driver see I/O requests as they pass through.

The driver registers callbacks on two operations:

- **`IRP_MJ_WRITE`**, with a pre-operation and a post-operation callback around each write
- **`IRP_MJ_CLOSE`**, when a file handle is closed

## How detection works

The idea is to compare a file before and after it's written, and look for the signature of encryption:

- **Before the write**, compute a **fuzzy hash** of the content. Unlike a normal hash, a fuzzy hash tells you how *similar* two pieces of data are, so an ordinary edit still looks similar to the original.
- **After the write**, calculate the **Shannon entropy** of the result. Encrypted data looks close to random, so its entropy is unusually high.
- A file that suddenly stops resembling its old self *and* jumps to high entropy looks like encryption, not editing.

When the pipeline flags that pattern, the driver **blocks the malicious write requests in the kernel**, before they reach the file system.

<!-- TODO (optional): add detection thresholds, the fuzzy hashing library used, and how you tested it against samples, if you have those details. -->

## Deployment

Kernel drivers are installed differently from normal programs. I configured and deployed the driver with **custom INF manifests**, setting the:

- **load-order group**, which decides when the driver loads
- **altitude**, which decides where the minifilter sits in the filter stack relative to other filters, such as antivirus
- **instance flags**, which control how the filter attaches to volumes

This project is about as far from web development as I've gone: kernel callbacks, I/O request packets, and getting a driver to load in the right place in the stack.
