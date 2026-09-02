---
title: "Alice Agent: Un Agente IA Open-Source en Tu Terminal"
description: "Alice Agent es un agente IA que se ejecuta localmente, persiste memoria entre sesiones y soporta mas de 20 plataformas de mensajeria."
pubDate: "2026-09-01"
lang: "es"
tags: ["agente-ia", "open-source", "terminal", "cli", "local-first"]
---

Alice Agent es un agente IA open-source disenado para ejecutarse en tu maquina — no en la nube de otro. Se conecta a cualquier proveedor de modelos (OpenRouter, Anthropic, OpenAI, Ollama local), recuerda contexto entre sesiones y se extiende con skills.

## Por Que Importa Local-First

La mayoria de asistentes IA envian tus datos a servidores remotos. Alice Agent se ejecuta completamente en tu hardware. Tu codigo, tus conversaciones, tu memoria — nada sale de tu maquina a menos que elijas un proveedor externo.

## Que Puede Hacer Alice

- **Memoria persistente**: Hechos, preferencias y contexto del proyecto sobreviven entre sesiones
- **Mas de 20 plataformas**: Telegram, Discord, Slack, WhatsApp, Signal y mas — todo desde un solo proceso gateway
- **Tareas programadas**: Cron jobs que ejecutan prompts, scripts o skills autonomamente
- **Subagentes**: Lanza workers aislados para tareas paralelas
- **Sistema de skills**: Memoria procedural reutilizable que mejora con el uso

## Como Empezar

```bash
curl -fsSL https://alice-agent.stuko.dev/install.sh | bash
```

Eso es todo. Alice detecta tu SO, instala dependencias y te lleva a una conversacion. Configura tu proveedor con `alice setup` y listo.

## Open Source, Licencia MIT

Alice Agent es gratuito para usar, modificar y auto-hospedar. El codigo esta en [GitHub](https://github.com/Stuko0/alice-agent).
