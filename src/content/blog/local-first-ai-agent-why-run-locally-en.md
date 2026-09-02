---
title: "Local-First AI: Why Your AI Agent Should Run on Your Machine"
description: "Cloud AI agents have a fundamental problem: your data leaves your control. Local-first AI keeps everything on your hardware."
pubDate: "2026-09-01"
lang: "en"
tags: ["local-first", "ai-agent", "privacy", "self-hosted", "open-source"]
---

The AI agent landscape is split between two approaches: cloud-hosted and local-first. Here is why local-first matters — and how Alice Agent makes it practical.

## The Cloud Problem

When you use a cloud AI agent, your conversations, code, and data flow through someone else's servers. Even with privacy policies, you are trusting a third party with potentially sensitive information.

## The Local-First Advantage

A local-first AI agent runs on your hardware. Your data never leaves your machine unless you explicitly choose to send it to a model provider. Alice Agent takes this further:

- **Model flexibility**: Use OpenAI, Anthropic, or run entirely local with Ollama/llama.cpp
- **Persistent local memory**: All context stays on your disk
- **No subscription**: Open source, MIT licensed, free forever
- **No vendor lock-in**: Switch providers with one command

## When Local-First Makes Sense

- You work with sensitive code or data
- You want to use AI without sending proprietary information to cloud providers
- You are building on infrastructure you control
- You want predictable costs (no per-token billing surprises)

## The Hybrid Approach

Alice Agent supports a hybrid model: run the agent locally, but connect to cloud models when needed. Your data stays local; only the prompts and responses travel to the provider. You control what leaves your machine.

## Getting Started

```bash
curl -fsSL https://alice-agent.stuko.dev/install.sh | bash
alice setup
```

[Learn more about Alice Agent](https://alice-agent.stuko.dev/en/)
