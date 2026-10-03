---
title: FlashAttention-3 on H100 GPUs
short: FlashAttention-3
summary: Eight CUTLASS 3.x attention kernels that isolate what each H100 feature is actually worth, plus FP8 inference with block quantization.
context: NYU course project
start: "2026-03"
end: "2026-04"
period: Mar – Apr 2026
stack: [CUDA, CUTLASS 3.x, Triton, H100, FP8]
results:
  - 8 kernels benchmarked, one hardware feature changed at a time
  - 2× inference throughput with FP8
  - 2.6× lower numerical error with block quantization
order: 3
links: []
# TODO: add GitHub and report links
---

## Problem

FlashAttention-3 is fast on H100 because it combines several Hopper-specific features at once: TMA for asynchronous memory movement, WGMMA for warpgroup-level tensor core instructions, warp specialization to overlap data movement with compute, and FP8. When all of them are on, it's hard to tell how much each one contributes.

## Approach

I wrote 8 kernels in CUTLASS 3.x, each adding or removing one optimization, and benchmarked them under the same conditions. That turns "FA3 is fast" into a breakdown of where the speedup comes from and which techniques give the most for the effort.

- **TMA:** the Tensor Memory Accelerator copies tiles between global and shared memory asynchronously, so threads don't spend instructions on address calculation and loads.
- **WGMMA:** Hopper's warpgroup matrix multiply issues larger tensor core operations across a group of four warps and can read operands directly from shared memory.
- **Warp specialization:** producer warps load data while consumer warps compute, so memory and math overlap.
- **FP8:** halves the bytes per element compared with FP16 and doubles tensor core throughput, at the cost of precision.

<!-- TODO: table of the 8 kernels and what each one enables, plus the benchmark chart (TFLOPs or latency vs. sequence length). -->

## FP8 and accuracy

FP8 gave about a 2× throughput improvement for inference. The cost is precision: with a single scale for a whole tensor, outliers force a large scale and small values lose resolution. Block quantization gives each block its own scale, which cut numerical error by 2.6×.

To check that this held up on a real model and not just on kernel-level error, I ran Qwen2.5-7B on GSM8K and MATH.

<!-- TODO: state the baselines explicitly: 2× throughput vs. which configuration (BF16? FA2?), and 2.6× lower error vs. per-tensor FP8? Also add sequence lengths, head dim, and batch size. -->

