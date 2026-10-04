---
title: Attention Is All You Need
paper: "Attention Is All You Need"
authors: Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin
venue: NeurIPS 2017
theme: Machine learning
summary: The Transformer. Sequence modeling with attention alone, no recurrence, so training parallelizes across the whole sequence.
order: 12
---

## The problem

Before this paper, the best sequence models for tasks like translation were recurrent networks (RNNs and LSTMs), usually with attention added on top. Recurrence has two costs:

- **It's sequential.** Step *t* needs the hidden state from step *t − 1*, so you can't parallelize across positions within a sequence. Training is slow on modern hardware.
- **Long paths.** Information between two distant tokens has to pass through every step in between.

The Transformer drops recurrence entirely and builds the model from attention.

## How it works

**Scaled dot-product attention.** Each token produces a query (Q), a key (K), and a value (V). Attention computes

`Attention(Q, K, V) = softmax(QKᵀ / √dₖ) V`

Every token's output is a weighted mix of all values, weighted by how well its query matches each key. The division by √dₖ keeps the dot products from growing with dimension, which would push softmax into regions with tiny gradients.

**Multi-head attention.** Instead of one attention over the full model dimension, the model runs several heads in parallel on smaller projections (8 heads of size 64 for a model size of 512), then concatenates them. Different heads can attend to different kinds of relationships.

**The architecture.**
- An **encoder** of 6 identical layers, each with self-attention and a position-wise feed-forward network (two linear layers with a ReLU).
- A **decoder** of 6 layers, with *masked* self-attention, so a position can't look at future tokens, plus attention over the encoder's output.
- **Residual connections and layer normalization** around every sub-layer.

**Positional encoding.** Attention by itself has no notion of order, so sinusoidal position signals are added to the input embeddings.

## Design decisions and tradeoffs

The paper compares a self-attention layer with a recurrent layer on three things:

| | Self-attention | Recurrent |
|---|---|---|
| Compute per layer | O(n² · d) | O(n · d²) |
| Sequential operations | O(1) | O(n) |
| Path between any two tokens | O(1) | O(n) |

For typical sentence lengths (n smaller than d), self-attention is cheaper *and* fully parallel. The catch is the **n²** term: compute and memory grow with the square of sequence length, which becomes the central constraint once contexts get long.

The results were strong translation quality at a fraction of the training cost of earlier models. The large model trained in 3.5 days on eight P100 GPUs.

## Connections

- In my [LLM Reasoners](/projects/llm-reasoners) project I built a decoder-only Transformer from scratch. It kept the core of this paper but swapped two pieces that later models changed: **RoPE** instead of sinusoidal positional encodings, and **SwiGLU** instead of the ReLU feed-forward layer.
- The n² memory cost is exactly what **FlashAttention** attacks. It computes the same attention in tiles with an online softmax, so the full n × n matrix never has to be written to GPU memory. My [FlashAttention-3 project](/projects/flashattention-3) and the FlashAttention-2 kernel in LLM Reasoners are both about making this one equation run fast.
- Attention is mostly matrix multiplication, which is why it maps so well onto GPU tensor cores, and why the hardware details in FlashAttention-3 (TMA, WGMMA, FP8) matter.
