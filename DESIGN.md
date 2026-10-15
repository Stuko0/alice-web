---
version: alpha
name: Alice's Descent
description: Sistemas de diseño gótico victoriano para Alice Agent. Oscuro, teatro de naipes, ornamento controlado. La landing nunca invierte a tema claro.
colors:
  primary: "#7848a0"
  base: "#0c0a12"
  surface: "#16131f"
  overlay: "#221e30"
  text: "#d4cfc7"
  subtle: "#958da5"
  muted: "#6e687c"
  love: "#a8213a"
  rose: "#c45a6b"
  gold: "#b8864e"
  pine: "#3a8c8c"
  foam: "#4fa8a8"
  highlight-low: "#191622"
  highlight-med: "#2d2940"
  highlight-high: "#413d57"
typography:
  h1:
    fontFamily: Cinzel
    fontSize: 3.75rem
    fontWeight: 400
    lineHeight: 1.2
  h2:
    fontFamily: Cinzel
    fontSize: 2rem
    fontWeight: 400
    lineHeight: 1.25
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.625
  label-caps:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.15em"
rounded:
  sm: 4px
  md: 8px
  lg: 16px
  pill: 9999px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  section: 96px
components:
  button-primary:
    backgroundColor: "{colors.rose}"
    textColor: "{colors.base}"
    rounded: "{rounded.pill}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.foam}"
    textColor: "{colors.base}"
    rounded: "{rounded.pill}"
    padding: 12px
  card-alice:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 32px
  card-alice-hover:
    backgroundColor: "{colors.overlay}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 32px
  pill-badge:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.subtle}"
    rounded: "{rounded.pill}"
    padding: 6px
  input-text:
    backgroundColor: "{colors.base}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 12px
---

## Overview

Alice's Descent es el sistema de diseño de la landing de Alice Agent
(`alice-agent.stuko.dev`), inspirado en la dirección de arte de
Alice: Madness Returns cruzada con la variante Heartless: teatro victoriano,
naipes del palo, terciopelo oscuro y filigrana dorada. La fuente canónica de
los valores es `src/styles/global.css` (bloque `@theme` de Tailwind v4) y este
documento la codifica para agentes y revisores.

Principios rectores:

1. **Oscuro por defecto, claro opcional.** El sitio vive en `base #0c0a12`
   con `color-scheme: dark` por defecto; el switcher de la navegacion cambia
   `html[data-theme]` a la variante clara (pergamino, ver Colors) y la
   persiste en `localStorage['theme']`. La primera visita respeta
   `prefers-color-scheme`. El cambio aplica al instante porque todas las
   utilidades consumen `var(--color-rpm-*)` y el flip desactiva transiciones
   (clase `theme-switching`, 120 ms). Ninguna seccion invierte la paleta por
   su cuenta: el tema es una decision global.
2. **Ornamento con presupuesto.** Naipes (`suit-spade/heart/diamond/club`),
   patrones de tela, viñetas y orbes de luz son decoracion de fondo, nunca
   ruido sobre el texto. Cada seccion puede usar una capa de textura y una de
   luz; no mas.
3. **Una sola familia de interaccion.** El violeta iris (`primary`) mueve toda
   la accion: botones, enlaces activos, foco. El carmesi `love` es identidad y
   estado destructivo; el oro `gold` es anillo de foco y detalles; los teals
   son acentos menores de palo.
4. **Datos reales, nada hardcodeado.** version, estrellas y catalogos se
   obtienen de la API de GitHub o de `public/api/*.json` en build time. La
   landing no muestra numeros inventados (regla del producto, verificable en
   `src/lib/releases.ts`).
5. **Movimiento motivado y opcional.** Toda animacion comunica jerarquia,
   entrada o feedback, y debe degradar bajo `prefers-reduced-motion` (hoy
   pendiente: ver `design/PROPOSALS.md`).

## Colors

La paleta se define como tokens `--color-rpm-*` y se consumen como
`text-rpm-*`, `bg-rpm-*`, `border-rpm-*` de Tailwind v4.

- **primary / iris `#7848a0`:** acento de interaccion para enlaces hover y
  bordes de foco. No es un fondo de CTA: sobre el, el texto oscuro da
  3.03:1 (falla AA) y el crema 4.22:1 (tambien falla), por eso los botones
  primarios usan rose con texto oscuro (4.58:1) y hover foam (6.88:1).
- **foam `#4fa8a8`:** hover del primario y estados OK; contraste alto sobre
  oscuro, por eso sustituye al iris al pasar el cursor.
- **love `#a8213a` (carmesi sangre):** latido de marca: corazones, badges del
  hero, `::selection`. Nunca como color de texto corrido sobre surface.
- **rose `#c45a6b`:** variante clara del carmesi para acentos grandes.
- **gold `#b8864e` (dorado deslustrado):** anillos de foco, filigrana,
  divisores con brillo. Nunca color primario de UI (se ve anaranjado sobre
  oscuro).
- **pine `#3a8c8c` / foam `#4fa8a8`:** palos espada y diamante; acentos
  menores.
- **text `#d4cfc7` (crema), subtle `#958da5`, muted `#6e687c`:** la escalera
  de texto. Cuerpo siempre `text`; `subtle` para apoyo y `muted` solo para
  meta-informacion decorativa.
- **surface / overlay / highlight-\*:** elevacion progresiva de paneles.

Modo claro (`html[data-theme='light']`, variante Heartless): base pergamino
`#ede7db`, surface `#ffffff`, texto `#1a1714`, subtle `#5c4a44`, love
carmesi `#8b0000`, rose `#a3182b`, iris `#6b3fa0`, gold `#8a6114`, pine
`#2a6a6a`, foam `#0b5c5c`, highlights `#e7dfd1 / #c9b99c / #9a8760`.
Todos los pares de texto sobre base/surface pasan WCAG AA (medido en build:
0 fallos en 4 paginas x 2 temas). Los paneles marcados `.terminal-dark`
(exhibiciones de terminal, bloque de instalacion) y los `<pre>` redeclaran la
paleta oscura dentro de su alcance: la terminal permanece oscura en ambos
temas.

Reglas: un solo acento de accion por vista; los cuatro palos se ciclan por
indice (`♠ ♥ ♦ ♣`) y nunca se re-mapean; los `color-mix()` al 8-40% crean las
variantes de fondo/borde de cada palo (`bg-suit-*`, `border-suit-*`).

## Typography

- **Cinzel (serif display)** solo para titulares `h1`/`h2`/`h3` y marcas de
  seccion, nunca por debajo de 20px: a ese tamano sacrifica legibilidad.
- **Inter** para todo lo demas: cuerpo, etiquetas, codigos, botones.
- Escala real del sitio: `h1` hero `3.75rem` (`text-5xl`, `sm:text-6xl`),
  `h2` de seccion `2rem-3rem` (`text-3xl/4xl`), cuerpo `1rem`
  (`text-sm` en tarjetas densas), etiquetas caps `0.75rem` con tracking
  `0.15em-0.3em`.
- Titulares con `text-balance` (`text-wrap: balance`) para evitar viudas;
  parrafos de apoyo maximo ~65ch en bloques centrados (`max-w-2xl`).
- El em-dash no es un recurso tipografico del sistema: separadores y guiones
  usan `-` o los divisores `.divider-ornate`.

## Layout & Spacing

- Contenedor maestro `max-w-7xl px-6` (1280px); heroes `max-w-4xl`;
  lectura larga `max-w-3xl`.
- Ritmo vertical por seccion `py-24` (96px) en TODAS las vistas (canon
  verificado en build: la home pasa de 80/96/112 mezclados a 96 uniforme);
  heroes `py-28` (112px) con borde inferior; cabecera de seccion
  `mb-12` (48px) y CTA tras parrafo `mt-8` (32px). Grillas `gap-6` o
  `gap-10`; tarjetas con contenido `p-8 pt-14` (el watermark ocupa la
  banda superior).
- Secciones son `<section class="relative overflow-hidden">` con capas
  hermanas: `.fabric-pattern` (rejilla al 2.5%), `.section-vignette`
  (viñeta radial) y opcional `.glow-orb` teñido con el color del palo.
- Responsive: grillas de 3 columnas colapsan a 2 (`sm:grid-cols-2`) y luego a
  1; los fondos decorativos absolutos se ocultan en movil
  (`hidden md:block`).
- Navegacion fija de 64px (`pt-16` en `main`); una sola linea en desktop.

## Elevation & Depth

No hay sombras negras planas. La elevacion se construye con:

- `.card-alice`: borde `highlight-med` + gradiente 135deg surface→base.
  Hover: lift de -4px, borde dorado al 50%, brillo `0 8px 40px -12px` dorado
  con mezcla carmesi, y un `::before` de gradiente radial al 10% de opacidad.
- Viñeta (`section-vignette`) que oscurece los bordes hacia el base.
- Orbes `.glow-orb` de 350-400px con `blur(100px)` a 3-4% de opacidad: luz
  ambiental, no decoracion llamativa.
- `.glass` (surface al 72% + `backdrop-filter: blur(12px)`) para superficies
  flotantes.
- `.noise` (SVG feTurbulence al 4%) sobre `body` como grano de terciopelo.

## Shapes

Sistema de radios documentado y seguido en todo el sitio:

- **CTAs y badges: pill (`9999px`).** Todos los botones primarios y pills de
  estado son completamente redondeados.
- **Tarjetas: `lg` (1rem).** `.card-alice`, paneles, bloques de codigo.
- **Controles y elementos pequeños: `md` (8px).** Iconos de marca, chips.
- Inclinacion sutil de tarjetas: `.card-tilt-left` / `.card-tilt-right`
  (+/-0.8deg) que se enderezan al hover. Es el gesto "carta fisica" del
  sistema; se aplica alternando por indice, nunca dos seguidas iguales.

## Components

- **`button-primary`** (CTA): fondo `rose`, texto `base`, pill, padding
  12px. Hover `button-primary-hover` (fondo `foam`). Ambos estados pasan
  WCAG AA medido (4.58:1 y 6.88:1); es la unica accion alta-emphasis de una
  vista. El iris queda para enlaces y anillos, no para fondos con texto.
- **`pill-badge`**: superficie con borde suit al 30%, texto `subtle`, pill.
  Lleva un suit Unicode como icono (no iconografia externa, no emojis).
- **`card-alice`** (+ variante hover): contenedor base de tarjetas, stats,
  faq (`details/summary`), deep dives. Marca de agua `.suit-watermark` al 3%
  y esquinas `.suit-corner`.
- **`input-text`**: fondo `base`, texto `border highlight-med`, foco con
  anillo `gold`.
- **`theme-toggle`**: boton pill 36x36 en la navegacion (sol/luna lucide);
  alterna `html[data-theme]`, persiste en `localStorage` y actualiza el meta
  `theme-color`. Borde `highlight-med`, hover iris.
- **Divisores**: `.divider-ornate` (linea 1px con degradado a transparente) y
  `.divider-ornate-glow` (con degradado dorado). Encabezados ornamentales
  `.header-ornate` (suit + linea + suit + linea + suit, centrado).
- **`Stats`**: tarjeta stat con contador animado; el valor llega de prop
  (obtenido en build time de la API de GitHub), nunca se escribe en la
  plantilla.

## Do's and Don'ts

- DO ciclar los palos por indice (`♠ ♥ ♦ ♣`) con su clase de color
  correspondiente; DO mantener un unico acento de accion (rose para
  acciones, iris para enlaces/foco) en toda la vista.
- DO verificar cualquier combinacion nueva de texto sobre fondo en LOS DOS
  temas (el modo claro invierte luminancias: lo que pasa en oscuro puede
  fallar en claro y viceversa); los eyebrow badges usan borde/tinte del palo
  con texto del tema para garantizar AA en ambos.
- DO reservar Cinzel para titulares >= 20px y usar Inter para el resto.
- DO traer toda metrica de un endpoint o archivo de datos en build time
  (`releases.ts`, `public/api/*.json`); la landing no puede mostrar un
  numero que nadia pudo verificar.
- DO ocultar decoracion absoluta en movil y verificar sin scroll horizontal
  en 375px.
- DON'T invertir ninguna seccion a tema claro, ni meter una paleta
  warm/cream: el contrato del sitio es oscuro-unico.
- DON'T usar `gold` como color primario de UI ni `pine`/`foam` como color de
  texto de parrafos; son acentos de palo.
- DON'T escribir emojis en UI, copy, README ni codigo: los naipes Unicode y
  los iconos lucide-react son la iconografia oficial.
- DON'T anidar variantes de componente: `button-primary-hover` es hermano de
  `button-primary`, no su hijo.
- DON'T animar propiedades de layout (width/top/height) ni dejar animaciones
  infinitas sin guarda `prefers-reduced-motion`.
