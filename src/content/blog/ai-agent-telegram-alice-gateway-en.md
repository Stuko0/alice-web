---
title: "Run an AI Agent on Telegram: Alice Agent Gateway Guide"
description: "Set up Alice Agent as a Telegram bot in 5 minutes. Full gateway guide with configuration, commands, and tips."
pubDate: "2026-09-01"
lang: "en"
tags: ["ai-agent", "telegram", "telegram-bot", "gateway", "messaging"]
---

Alice Agent can run as a Telegram bot — giving you a personal AI assistant right inside your favorite messaging app. Here is how to set it up.

## Prerequisites

- Alice Agent installed ([quick install](https://alice-agent.stuko.dev/en/))
- A Telegram bot token (create one via [@BotFather](https://t.me/BotFather))
- A model provider API key

## Setup

```bash
# 1. Create your bot with BotFather and copy the token
# 2. Configure Alice
alice config set gateways.telegram true
alice config set gateways.telegram_token YOUR_BOT_TOKEN
alice config set model.provider openrouter
alice config set model.api_key YOUR_API_KEY

# 3. Start the gateway
alice gateway
```

That is it. Send a message to your bot and Alice responds.

## What You Can Do

- **Chat naturally**: Ask questions, delegate tasks, get code reviews
- **Send files**: Alice can read and process documents, images, and code
- **Background tasks**: Alice keeps working even after you close the chat
- **Memory**: Alice remembers your preferences and past conversations

## Multi-Platform

The same Alice instance can serve Telegram AND Discord AND Slack simultaneously. One gateway process, all platforms:

```bash
alice config set gateways.discord true
alice config set gateways.discord_token YOUR_DISCORD_TOKEN
alice gateway
```

## Tips

- Use `/new` to start a fresh conversation
- Use `/skills` to browse installed skills
- Use `/cron` to schedule recurring tasks
- Alice can send you daily briefings, weekly reports, or custom notifications

[Full documentation](https://alice-agent.stuko.dev/en/docs/)
