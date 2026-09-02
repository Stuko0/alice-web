---
title: "Ejecuta un Agente IA en Telegram: Guia del Gateway de Alice"
description: "Configura Alice Agent como bot de Telegram en 5 minutos. Guia completa con configuracion, comandos y consejos."
pubDate: "2026-09-01"
lang: "es"
tags: ["agente-ia", "telegram", "bot-telegram", "gateway", "mensajeria"]
---

Alice Agent puede ejecutarse como un bot de Telegram — dandote un asistente IA personal dentro de tu app de mensajeria favorita.

## Requisitos

- Alice Agent instalado ([instalacion rapida](https://alice-agent.stuko.dev/es/))
- Un token de bot de Telegram (crealo via [@BotFather](https://t.me/BotFather))
- Una API key de proveedor de modelos

## Configuracion

```bash
alice config set gateways.telegram true
alice config set gateways.telegram_token TU_TOKEN
alice config set model.provider openrouter
alice config set model.api_key TU_API_KEY
alice gateway
```

Listo. Envua un mensaje a tu bot y Alice responde.

## Multi-Plataforma

La misma instancia de Alice puede servir Telegram Y Discord Y Slack simultaneamente. Un solo proceso gateway, todas las plataformas.

## Consejos

- Usa `/new` para iniciar una conversacion fresca
- Usa `/skills` para explorar skills instalados
- Usa `/cron` para programar tareas recurrentes
- Alice puede enviarte resumenes diarios o reportes semanales

[Documentacion completa](https://alice-agent.stuko.dev/es/docs/)
