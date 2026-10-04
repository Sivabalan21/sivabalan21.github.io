---
title: HealthcareAI
short: HealthcareAI
kind: "Applied AI · Full-stack product"
highlight: "Finalist among 40 teams at Columbia’s AI for Good Hackathon"
summary: An AI-assisted clinical platform covering 13 workflows, with a provider layer that can run on Groq, MedGemma, or local Ollama models.
context: Columbia AI for Good Hackathon, finalist among 40 teams
start: "2026-02"
end: "2026-02"
period: Feb 2026
stack: [Node.js, React, PostgreSQL, Redis, Groq, MedGemma, Ollama, RAG]
results:
  - Finalist among 40 teams at Columbia's AI for Good Hackathon
  - 13 clinical workflows, including medical imaging, voice-to-SOAP notes, and lab extraction
  - Same features run against cloud or fully local models
order: 1
links: []
# TODO: add { label: "GitHub", href: "..." } and { label: "Demo", href: "..." }
---

## Problem

Clinics deal with a lot of manual documentation: notes from patient visits, values copied out of lab reports, and images that need a first read. AI can help with each of these, but patient data makes it hard to just send everything to a cloud API, and running large models on cloud GPUs gets expensive fast.

## What I built

A SaaS platform with 13 clinical workflows. The AI-backed ones are:

- **Medical imaging assistance**
- **Voice-to-SOAP**, which turns a recorded visit into a structured SOAP note
- **Lab extraction**, which pulls values out of lab reports into structured data

All model calls go through one orchestration layer instead of being wired into each feature. A workflow asks for a capability, and the layer routes it to Groq for fast hosted inference, or to MedGemma and other models running locally through Ollama. That made it possible to keep features working without paid cloud GPUs and to keep patient data on the machine when needed.

The platform also uses two shared services: **RBAC access control**, so each role only sees the data and actions it should, and **multi-channel notifications**.

<!-- TODO: Architecture diagram. Show: React client → Node.js API → orchestration layer → {Groq | Ollama (MedGemma, ...)}, plus PostgreSQL, Redis, RBAC and notification services. Put the image in /public/images/ and reference it here. -->

<!-- TODO: add a "Design decisions" section with 2–3 decisions with the reasoning, e.g. why a provider abstraction instead of calling one API, what Redis is used for, how RAG is used and over what data. -->

