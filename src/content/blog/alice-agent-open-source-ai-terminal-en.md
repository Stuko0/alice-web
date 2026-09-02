---
title: "Alice Agent: An Open-Source AI Agent That Runs in Your Terminal"
description: "Alice Agent is a self-improving AI agent that runs locally, persists memory across sessions, and supports 20+ messaging platforms."
pubDate: "2026-09-01"
lang: "en"
tags: ["ai-agent", "open-source", "terminal", "cli", "local-first"]
---

Alice Agent is an open-source AI agent designed to run on your machine — not in someone else's cloud. It connects to any model provider (OpenRouter, Anthropic, OpenAI, local Ollama), remembers context across sessions, and can be extended with skills.

## Why Local-First Matters

Most AI assistants send your data to remote servers. Alice Agent runs entirely on your hardware. Your code, your conversations, your memory — nothing leaves your machine unless you choose an external model provider.

## What Alice Can Do

- **Persistent memory**: Facts, preferences, and project context survive across sessions
- **20+ messaging platforms**: Telegram, Discord, Slack, WhatsApp, Signal, and more — all from a single gateway process
- **Scheduled tasks**: Cron jobs that run prompts, scripts, or skills autonomously
- **Subagents**: Spawn isolated workers for parallel tasks
- **Skills system**: Reusable procedural memory that improves with use

## Getting Started

```bash
curl -fsSL https://alice-agent.stuko.dev/install.sh | bash
```

That's it. Alice detects your OS, installs dependencies, and drops you into a conversation. Configure your model provider with `alice setup` and you're ready.

## Open Source, MIT Licensed

Alice Agent is free to use, modify, and self-host. The code is on [GitHub](https://github.com/Stuko0/alice-agent).
