---
title: "Self-Improving AI Agents: How Alice Learns Skills From Experience"
description: "Alice Agent creates and improves skills automatically after complex tasks. Heres how the self-improvement loop works."
pubDate: "2026-09-01"
lang: "en"
tags: ["ai-agent", "self-improving", "skills", "memory", "local-first"]
---

Most AI agents are stateless — they forget everything between conversations. Alice Agent has a built-in learning loop that makes it genuinely self-improving.

## The Learning Loop

After completing a complex task, Alice can automatically create a **skill** — a reusable chunk of procedural memory. Skills capture patterns: how to deploy to a specific platform, how to format code reviews, how to interact with an API.

```bash
# Alice creates skills automatically, or you can install them:
alice skills install github-code-review
alice skills install starrocks-data-exploration
```

## How Skills Improve

Skills are not static. When Alice uses a skill and encounters a better approach, it patches the skill in place. This means the skill gets more effective every time it is used — a genuine improvement loop.

## Memory Across Sessions

Alice stores facts, preferences, and project context in persistent memory. When you start a new session, Alice already knows your preferred coding style, project architecture decisions, previous conversations and outcomes, and custom configurations.

## The Curator

A background process tracks skill usage and auto-archives stale ones. You never lose skills — archives go to `~/.alice/skills/.archive/` and are restorable. Pinned skills are protected from deletion.

## Why This Matters

A self-improving agent gets more valuable over time. Instead of re-explaining context every session, Alice builds on what it already knows. The more you use it, the better it gets.

[Get started with Alice Agent](https://alice-agent.stuko.dev/en/)
