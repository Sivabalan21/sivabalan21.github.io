---
title: Building LLM Reasoners
short: LLM Reasoners
summary: A Transformer language model built from scratch, a FlashAttention-2 kernel in Triton, and RL fine-tuning of a 1.5B math model with GRPO.
context: NYU coursework
start: "2026-01"
end: "2026-03"
period: Jan – Mar 2026
stack: [Python, PyTorch, Triton, torch.compile, Slurm, A100]
results:
  - ≤1.45 validation cross-entropy on TinyStories with a from-scratch Transformer
  - FlashAttention-2 forward and backward pass in Triton (BF16)
  - ≥30% accuracy on Countdown after SFT and GRPO on Qwen2.5-Math-1.5B
order: 4
links: []
# TODO: add GitHub link if the course allows sharing code
---

## Problem

Build the full stack of a reasoning-capable LLM from the bottom up, without relying on library implementations of the core pieces.

## What I built

**Language model from scratch.** A byte-pair encoding tokenizer, a Transformer with RoPE positional embeddings and SwiGLU feed-forward layers, and AdamW with a cosine learning-rate schedule. Trained on TinyStories to ≤1.45 validation cross-entropy.

**FlashAttention-2 in Triton.** The forward and backward pass in BF16. The kernel tiles queries, keys and values through on-chip memory and uses an online softmax, so the full attention matrix is never written to GPU memory.

**Reasoning fine-tuning.** Using that kernel, I fine-tuned Qwen2.5-Math-1.5B with supervised fine-tuning and then GRPO, a reinforcement learning method that scores groups of sampled answers against each other instead of training a separate value model. The result reached ≥30% accuracy on the Countdown reasoning benchmark.

Training ran on A100 and RTX 4090 GPUs through Slurm, with torch.compile and GPU profiling to find bottlenecks.

<!-- TODO: training curves, kernel speed vs. PyTorch attention, Countdown accuracy before/after GRPO. -->

