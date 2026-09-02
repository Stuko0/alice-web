# Plan de mejora SEO: visibilidad de "Alice Agent" en Google

> **Nota:** Plan sin ejecución. Nada de lo listado abajo fue aplicado aún.

**Fecha:** 2026-09-01
**Objetivo:** Posicionar alice-agent.stuko.dev en la primera página de Google para "alice agent" y queries relacionadas, en 4-12 semanas.

---

## Diagnóstico actual (medido hoy)

### Qué funciona
- Sitio indexado en Google (GSC OK), robots.txt, sitemap, hreflang, FAQPage schema — todo verificado en vivo (commit `e802f86`).
- README de `Stuko0/alice-agent` con 30 menciones a stuko.dev, homepage del repo correcta.

###Qué NO funciona (los problemas reales)

| # | Hallazgo | Gravedad |
|---|----------|----------|
| 1 | **"alice agent" como frase genérica está dominada por marcas establecidas**: alice.org (IDE educativo de Carnegie Mellon), Wikipedia "Alice", ALICE App, ALICE Technologies, alice.softonic.com. Bing top 10 = cero resultados nuestros. | Alta — es la guerra principal |
| 2 | **"stuko" colisiona con "stucco" en español**: buscar "stuko alice agent" devuelve morteros Sika, MercadoLibre, estuco. El nombre de la marca compite con material de construcción. | Media —_queries de marca diluidas |
| 3 | **Huella de contenido mínima**: 3 páginas × 3 idiomas = 9 URLs. Sin blog, sin long-tail, sin páginas de comparación. Google no tiene con qué rankear. | Alta |
| 4 | **README roto desde el punto de vista SEO**: badge de licencia apunta a `http://10.1.200.116:3000/arquant-admin/NewAlice/...` (IP privada de Gitea — no resuelve públicamente y expone infra interna); enlaza `alice-agent.stuko.dev/en/docs/integrations/providers` que **no existe en el sitio (404)**. | Alta — el backlink más valioso apunta a un 404 |
| 5 | **Repo `alice-web` con identidad vieja**: name `lydia-web`, homepage `http://lydia-agent.stuko.dev/` (301), sin topics. | Media |
| 6 | **Repo `alice-agent` sin topics** (vía API: `topics: []`), 1 estrella. | Media — topics alimentan el grafo semántico de GitHub |
| 7 | **docs.astro mezcla idiomas**: contenido hardcodeado en español se sirve en `/en/docs/` y `/it/docs/` ("Alice Agent es una CLI multiplataforma escrita en Python..."). | Media — señal de calidad baja para Google en-en |
| 8 | Bing/DDG apenas indexan (DDG `site:` muestra solo la página docs). Anti-bot limita la medición, pero la señal es consistente: poca autoridad de dominio. | Alta — se resuelve con backlinks |

### Realidad a aceptar
"Alice" es un nombre saturado. La primera página para "alice agent" no se gana con meta tags (ya están al máximo) — se gana con **autoridad (backlinks) + profundidad de contenido (long-tail)**. La estrategia es doble:
1. **Ganar primero las queries donde SÍ podemos competir** (long-tail y de marca) → tracción inicial.
2. **Acumular autoridad para escalar hacia la cabeza genérica**.

---

## Estrategia

```
Fase 0 — Arreglos técnicos internos (hoy, ~1h)      → elimina fricción
Fase 1 — Contenido long-tail (semana 1-2)          → queries ganables
Fase 2 — Autoridad y backlinks (semana 1-6, recurrente) → el factor dominante
Fase 3 — Operación GSC/Bing (continuo)             → medir y sostener
```

---

## Fase 0 — Arreglos técnicos (hoy)

### T0.1: Metadatos del repo `alice-agent` vía API
```bash
# ghp_ token está en ~/.alice/state.db (tabla messages) — usar curl/Bearer
TOKEN=$(...) # recuperar según memoria; no imprimir
curl -s -X PATCH "https://api.github.com/repos/Stuko0/alice-agent" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description": "Alice Agent — the self-improving AI agent. CLI + desktop + 20 messaging platforms. Open source, runs anywhere.", "homepage": "https://alice-agent.stuko.dev", "topics": ["ai-agent", "llm", "cli", "telegram-bot", "ai-assistant", "open-source", "self-improving", "skills", "mcp", "python"]}' \
  -H "Accept: application/vnd.github.mercy-preview+json"
# Verificar: curl -s https://api.github.com/repos/Stuko0/alice-agent | jq .topics
```

### T0.2: Metadatos del repo `alice-web`
```bash
curl -s -X PATCH "https://api.github.com/repos/Stuko0/alice-web" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description": "Alice Agent — landing & docs (alice-agent.stuko.dev)", "homepage": "https://alice-agent.stuko.dev"}'
```
NOTA: NO renombrar el repo (`lydia-web` → `alice-web`) sin decisión explícita — cambia el remote y GitHub Pages custom domain. Dejar como decisión pendiente.

### T0.3: Arreglar enlaces rotos del README (`Stuko0/alice-agent`)
- Badge de licencia: reemplazar `https://10.1.200.116:3000/arquant-admin/NewAlice/blob/main/LICENSE` → `https://github.com/Stuko0/alice-agent/blob/main/LICENSE` (o el badge estándar `img.shields.io/badge/License-MIT`).
- `https://alice-agent.stuko.dev/en/docs/integrations/providers` → 404. Apuntar a `/en/docs/` o crear la página (Fase 1).
- Audición completa: `curl -s https://raw.githubusercontent.com/Stuko0/alice-agent/main/README.md | grep -oE 'https://alice-agent.stuko.dev[^ )"]*' | sort -u` y verificar cada URL con curl.

### T0.4: Idiomas cruzados en `docs.astro`
Archivo: `src/pages/[lang]/docs.astro` (líneas 89, 116, 130, 146, 180, 197, 199-200 aprox).
Todo texto hardcodeado en español debe salir de `public/locales/{en,it}/common.json` bajo una clave `docs.sections.*`. Hoy `/en/docs/` sirve español — mala señal para ranking en-en.

### T0.5: Sitio — corrección menor
- `public/index.html`: el redirect JS debería respetar el idioma del navegador ANTES del redirect, pero además enviar `<link rel="canonical">` ya está hecho. Verificar solo que Googlebot reciba el HTML completo (lo hace — es estático).

**Verificación Fase 0:** `npm run build` OK; los 3 idiomas de docs renderizan en su idioma; API de GitHub devuelve topics no vacíos; README sin 404s (`curl -sI` por URL).

---

## Fase 1 — Contenido long-tail (semana 1-2)

El sitio necesita URLs que capturen búsquedas donde "alice agent" SÍ es competitivo. Prioridad por dificultad ascendente:

### T1.1: Blog con content collections
- Crear `src/content/blog/` con schema frontmatter (title, description, pubDate, lang, tags, ogImage).
- `src/pages/[lang]/blog/index.astro` (lista) y `src/pages/[lang]/blog/[slug].astro` (post).
- `@astrojs/rss` para feed (dependencia nueva en `package.json`).
- Posts iniciales (EN primero, ES espejo; IT opcional):
  1. **"Alice Agent: an open-source AI agent that runs in your terminal"** — ancla de marca, captura "open source ai agent terminal".
  2. **"Self-improving AI agents: how Alice learns skills from experience"** — captura "self-improving ai agent" (término propio del README, sin competencia directa).
  3. **"Run an AI agent on Telegram: Alice gateway guide"** — captura "ai agent telegram bot" (volumen real, competencia moderada).
  4. **"Local-first AI: why your AI agent should run on your machine"** — captura "local ai agent" / "local-first ai".
  5. **"Alice Agent vs Claude Code / Codex CLI / OpenCode: an honest comparison"** — captura queries comparativas de alto intento; es el contenido que MÁS backlinks atrae.
- Cada post: schema `BlogPosting` + `BreadcrumbList` en JSON-LD, canonical propio, entra al sitemap automáticamente.

### T1.2: Páginas de integración (resuelven el 404 del README y capturan searches específicos)
- `src/pages/[lang]/docs/providers.astro` — "AI agent OpenRouter / Anthropic / OpenAI / Ollama" (la URL que el README ya enlaza: `/en/docs/integrations/providers` → decidir slug exacto y actualizar README en Fase 0.3 en el mismo commit).
- `src/pages/[lang]/docs/platforms.astro` — "AI agent Telegram Discord Slack WhatsApp" (long-tail por plataforma).

### T1.3: Comparativa y alternativas
- `src/pages/[lang]/alternatives/index.astro` — "Alice Agent alternatives & comparisons" con tabla honesta vs. los 5-6 agentes CLI del momento. Queries "X alternative" tienen alto CTR.

**Verificación Fase 1:** build OK; sitemap incluye /en/blog/ y posts; Rich Results Test sin errores; cada post servido en el idioma correcto.

---

## Fase 2 — Autoridad y backlinks (semana 1-6, recurrente)

**Sin esto, nada de lo anterior mueve la aguja para la query genérica.** Es el 70% del resultado. Acciones concretas, de menor a mayor esfuerzo:

### T2.1: Directorios y lists (día 1, ~2h, backlinks permanentes)
- **awesome lists** (PRs): `awesome-ai-agents`, `awesome-claude-code` (si aplica por compatibilidad), `awesome-telegram-bots`, `awesome-llm-tools`. Patrón: fork → add entry con una línea de descripción + link al repo → PR.
- **agentskills.io** — el README dice ser compatible con el estándar; listar la skill registry.
- **alternativeTo** — listar Alice Agent como alternativa a Claude Code/Codex (enlaza a la página de Fase 1.3).
- **GitHub topics** (hecho en T0.1) + **Pinned repos + perfil** de Stuko0 con link.
- **Google Business Profile** — no aplica (no es local), descartado.

### T2.2: Comunidades (semana 1-3)
- **Reddit**: r/LocalLLaMA (post "I built a self-improving AI agent — show"), r/selfhosted, r/automation, r/Telegram. Regla: aporte real primero, link en perfil/comentario donde sea relevante. 2-3 posts máx., no spam.
- **HN**: "Show HN: Alice Agent — self-improving AI agent with 20 messaging platforms". Momento: martes-jueves 8-10am ET.
- **Dev.to / Hashnode**: republicar el post del blog de Fase 1 (canonical crosspost: `rel=canonical` a alice-agent.stuko.dev o canonical en el export de dev.to).
- **Discord del README** (`discord.gg/Stuko`) — verificar que funciona; comunidad activa = menciones orgánicas.

### T2.3: Distribución técnica (semana 2-4)
- Publicar el comparativo de Fase 1.3 como respuesta en las decenas de threads "best CLI AI agent" que existen en Reddit/HN ya indexados — un backlink contextual por respuesta.
- Vínculo desde `stuko-portfoglio` (repo del portfolio personal) → proyecto Alice Agent con URL del sitio.

**Verificación Fase 2:** backlinks check en GSC (Enlaces) + `curl -s "https://www.mojeek.com/search?q=alice+agent"` periódico; objetivo: 15-25 dominios de referencia en 6 semanas.

---

## Fase 3 — Operación (continuo)

- **GSC**: Request Indexing para cada URL nueva de Fase 1 (dashboard-only). Monitorear "Rendimiento" → queries con impresiones; ajustar títulos de posts con CTR < 1%.
- **Bing Webmaster Tools**: importar propiedad GSC, submit sitemap.
- **IndexNow**: alta de key + ping en cada deploy (Google lo ignora; Bing/ChatGPT no).
  ```bash
  KEY=$(openssl rand -hex 16); echo "$KEY" > public/$KEY.txt
  curl -X POST https://api.indexnow.org/indexnow -H "Content-Type: application/json" \
    -d '{"host":"alice-agent.stuko.dev","key":"'$KEY'","keyLocation":"https://alice-agent.stuko.dev/'$KEY'.txt","urlList":[...]}'
  ```
- **Cadencia**: 1 post de blog cada 2 semanas mínimo; recrawl natural se acelera con frescura.

---

## Metas medibles

| Query | Hoy | 4 semanas | 12 semanas |
|---|---|---|---|
| "alice agent stuko" | Fuera de top 50 | Top 5 | #1 |
| "self-improving ai agent" | — | Top 20 | Top 10 |
| "open source ai agent terminal" | — | Top 30 | Top 15 |
| "alice agent" (genérica) | Fuera de top 100 | Top 50-70 | Top 20-30 |
| "ai agent telegram" | — | Top 30 | Top 15 |

(La genérica "alice agent" a top 3 es un horizonte de 6-12 meses y depende de backlinks; no prometer más.)

## Riesgos y limitaciones
- **Anti-bot**: Bing/DDG bloquean scraping repetido; medir progreso vía GSC (datos reales) y Mojeek, no via curl serial.
- **Competencia asimétrica**: alice.org tiene 20 años de dominio. La genérica se gana por flancos (long-tail + autoridad), no frontal.
- **Nombre "Stuko"**: colisión con estuco en español es permanente. Mitigación: siempre usar la marca completa "Alice Agent" + "stuko.dev" juntos en anchor texts de backlinks.
- **Repo rename** (lydia-web→alice-web): pendiente de decisión; riesgo bajo pero no cero.

## Orden de ejecución sugerido
Fase 0 completa hoy (1h). Fase 1.1 arranque paralelo. Fase 2.1 (directorios) el mismo día de publicar el primer post — un post sin backlinks no rankea, un backlink sin contenido no convierte.
