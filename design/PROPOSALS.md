# Propuestas de diseño y animación: Alice Agent

Análisis UI/UX de la landing `alice-web` y propuestas priorizadas, con la sección
de 3D y animación que pidió el usuario. Todo está basado en el código real del
repo (rutas y líneas referenciadas al momento de escribir). El sistema de diseño
formal está en `DESIGN.md`; este documento es el plan de evolución.

Modo de lectura: rediseño de preservación. La estética Alice Madness Returns ya
existe y es buena; el trabajo es reforzarla, no reemplazarla.

---

## 1. Estado actual

### Lo que funciona bien

- **Identidad coherente y distintiva.** `src/styles/global.css` define la
  paleta Alice's Descent (tokens `--color-rpm-*`), Cinzel para display e Inter
  para cuerpo, naipes Unicode como sistema iconográfico, texturas
  (`.fabric-pattern`, `.noise`), viñetas y orbes de luz. Ninguna otra página
  genérica se confunde con esta.
- **Arquitectura de rendimiento correcta.** Astro islands: solo la navegación
  (`client:load`) y los componentes interactivos hidratan; el resto es HTML
  estático. Las imágenes llevan `width/height` y `loading="lazy"`.
- **Movimiento con vista de escena:** view-transitions de Astro con
  fade+blur (`global.css`), revelado por scroll con framer-motion
  (`ScrollReveal.tsx`) y contadores animados en `Stats.astro`.
- **Sin listeners de scroll crudos:** no hay `window.addEventListener('scroll')`
  en todo `src/` (verificado con grep). El movimiento va por framer-motion.

### Problemas concretos (verificables)

1. **Cero soporte de `prefers-reduced-motion` en todo el repo** (grep:
   0 coincidencias de `prefers-reduced-motion|useReducedMotion|matchMedia`).
   Los contadores, el tilt de tarjetas, el carrusel y las revelaciones se
   animan siempre. Es un fallo WCAG 2.1 (2.3.3) y de comodidad vestibular.
2. **Contraste del CTA primario (corregido en este pase).** `bg-rpm-iris` con
   `text-rpm-base` medía 3.03:1, bajo AA. Se migró a `bg-rpm-rose` (4.58:1) en
   las 13 instancias de CTA; hover `bg-rpm-foam` mide 6.88:1.
3. **Quedan enlaces y ghost-buttons en `text-rpm-iris` sobre surface: 2.74:1**
   (bajo AA). Afecta botones secundarios (`DesktopDownload.astro`,
   `Navigation.tsx`). Corrección propuesta en la sección 2.
4. **Fondo de botón sin estado de foco visible propio**: el anillo de foco usa
   `gold`, bien, pero no está documentado en el DESIGN.md hasta este pase.
5. **Hero con arte estático.** `hero-art.svg` e `HeroIllustration.astro` no se
   mueven; el único "wow" del primer viewport es el terminal
   (`HeroTerminal.astro`). La competencia (hermes-agent.nousresearch.com)
   tiene motion en el primer viewport.
6. **Las secciones son visualmente planas entre sí**: casi todas repiten el
   patrón "hero centrado + grilla de tarjetas". Falta variedad de familias de
   layout (bento, split, banda a ancho completo).
7. **`Roadmap.astro` y `UseCases.astro` acumulan texto largo en listas**:
   lectura densa poco escaneable en móvil.

---

## 2. Propuestas priorizadas (sin 3D)

### Alto impacto, bajo esfuerzo

| # | Qué | Por qué | Cómo verificarlo |
|---|-----|---------|------------------|
| 1 | Guardas `prefers-reduced-motion` globales: en `global.css` (`@media (prefers-reduced-motion: reduce) { *, ::before, ::after { animation-duration: .01ms !important; transition-duration: .01ms !important } }`) y `useReducedMotion()` en `Stats.astro`, `ScrollReveal.tsx`, `RotatingCard.tsx` | WCAG 2.3.3 + usuarios vestibulares | `npx playwright` con `emulateMedia({reducedMotion:'reduce'})`: ningún texto debe cambiar tras 300 ms |
| 2 | Subir contraste de texto iris sobre surface (2.74:1 → `rose` 4.24:1 o crema `subtle` 5.6:1) en botones secundarios y links activos | AA para texto pequeño | calcular ratios en el test de contraste; linter `@google/design.md` |
| 3 | `og:image` por idioma y por tipo de página (hoy una sola para todo) | CTR en compartir | Rich Results + compartir en Slack/X por idioma |
| 4 | Estado vacío y de carga explícitos en `SkillsCatalog.tsx` y `BlueprintsGrid.tsx` (ya tienen datos, pero si el fetch falla se ve una grilla vacía sin mensaje) | UX de error | servir `public/api/skills.json` como 500 y observar la página |

### Impacto alto, esfuerzo medio

| # | Qué | Por qué | Verificación |
|---|-----|---------|--------------|
| 5 | Reacomodo de familias de layout: convertir "Qué puedes construir" en bento asimétrico (2 filas, celdas de tamaños distintos, 2 celdas con imagen real de producto) y una banda a ancho completo con screenshot del dashboard entre medios | Rompe la repetición "grilla de tarjetas" y muestra producto real | captura desktop 1440 y móvil 375; ningún par de secciones consecutivas con la misma familia |
| 6 | Texto de roadmap en acordeón por fase (hoy 5 fases con listas largas visibles) | Escaneo en móvil | medida de altura del viewport en 375px antes/después |
| 7 | Micro-interacción de foco en el install command: Copiar → "Copiado" con check durante 1.5 s (`InstallCommand.tsx` ya tiene la base) | Feedback de la acción principal | click manual + axe focus order |
| 8 | Imágenes de producto con lightbox sencillo (kanban y dashboard en `/features`) | El usuario quiere ver detalle sin salir | click → overlay con Esc para cerrar, foco atrapado |

### Impacto medio, esfuerzo medio

| # | Qué | Por qué |
|---|-----|---------|
| 9 | Barra de progreso de lectura en `/blog/[slug]` (1 px, `scroll-timeline` CSS, sin JS) | Orientación en posts largos |
| 10 | Paleta de sombras tintada por palo: cada tarjeta con `suit-heart` proyecta sombra carmesi, `suit-spade` teal, etc. (hoy todo sombra dorada genérica) | Consistencia del sistema |

---

## 3. Propuestas 3D (sin modelar nosotros)

Restricción asumida: no creamos modelos. Todas las propuestas usan geometría
procedural, tipografía, o assets glTF de licencia abierta ya publicados.

### 3.1 Escena de naipes flotantes en el hero (recomendada)

- **Qué:** escena three.js con 4-6 planos con la textura de una carta
  (renderizadas con CSS2D/canvas a partir de los propios palos, no hay modelo
  externo), flotando con deriva lenta y parallax al puntero. Fondo con
  `transparent: true` sobre el hero actual.
- **Librería:** `three` (~150 KB gzip si se importa módulo) o,
  más barato, **CSS 3D puro** (`transform-style: preserve-3d` +
  `@keyframes` de deriva): 0 KB de JS, efecto casi idéntico para 6 planos.
- **Por qué:** da el "wow" del primer viewport que hoy falta y refuerza la
  metáfora de naipes/teatro.
- **Esfuerzo:** 1-2 días (CSS) / 3-4 días (three.js).
- **Riesgo CWV:** three.js sube el JS de la isla del hero; LCP no se toca si
  el arte sigue siendo HTML estático de respaldo. Debe ir `client:visible`
  y con `devicePixelRatio` limitado a 2.
- **Fallback:** si `prefers-reduced-motion` o si el dispositivo tiene
  `saveData`/2G, no se hidrata la isla; el hero se ve exactamente como hoy.

### 3.2 Letras 3D del wordmark (tipo Alice recortada en relieve)

- **Qué:** el título del hero con `text-shadow` en capas + `transform: rotateX`
  (CSS 3D) para simular extrusión; al mover el puntero, ligera inclinación.
- **Librería:** ninguna. Opcional: `spline`/`tres` si algún día hay una escena
  mayor.
- **Esfuerzo:** 0.5-1 día. **Riesgo:** nulo (solo CSS, degrada a texto plano).

### 3.3 Globe de plataformas en `/docs/platforms`

- **Qué:** los 20+ gateways de mensajería como puntos sobre un globo de
  alambre (geometría `SphereGeometry` + `Points`, sin modelos) girando lento.
- **Librería:** `three` en una isla `client:visible`, solo en esa página.
- **Riesgo CWV:** aceptable porque es below-the-fold y con lazy; presupuesto:
  la isla no debe superar 200 KB gzip; medir LCP de la página antes/después.
- **Alternativa 0 KB:** globo de alambre en SVG estático con
  `animation-timeline: view()` (rotación ligada al scroll).

### 3.4 Galería 3D de tarjetas de skill (solo si 3.1 resulta bien)

- **Qué:** al hacer hover en una tarjeta de `/skills`, tilt 3D real
  (`rotateX/rotateY` proporcional al puntero, estilo "holographic") en lugar
  del tilt fijo actual (+/-0.8deg).
- **Esfuerzo:** 0.5 día con framer-motion (`useMotionValue` + `useTransform`,
  sin `useState`, para no re-renderizar en cada frame).
- **Riesgo:** bajo; exigir `pointer: fine` y desactivar en táctil.

### 3.5 Qué NO hacer

- No cargar modelos glTF pesados en la landing (el LCP de la home es prioridad
  y el sitio vende una CLI liviana).
- No usar canvas/WebGL de fondo a pantalla completa: `global.css` ya aplica
  `.noise` con filtro SVG; combinar ambos destruye el FPS en móvil.
- No poner escenas 3D en `/docs/*` (el Docusaurus es contenido de lectura e
  índice; allí la prioridad es velocidad de búsqueda).

---

## 4. Core Web Vitals y presupuesto (para cualquier propuesta aceptada)

- **LCP < 2.5 s:** el LCP actual es texto del hero (bueno). Cualquier escena
  decorativa debe ser `aria-hidden`, below-the-fold o de carga diferida para
  no desplazar el LCP.
- **INP < 200 ms:** una sola isla de React pesada por viewport como máximo;
  nada de `useState` para valores continuos (puntero/scroll) — usar
  `useMotionValue`.
- **CLS < 0.1:** toda imagen declarada con `width/height` (ya corregido el
  desfase 880x495→880x550 de la imagen de kanban en este pase).
- **Verificación obligatoria antes de cerrar cualquier propuesta:**
  Lighthouse móvil sobre `/`, `/features/` y `/skills/`, más prueba de ancho
  375 px sin scroll horizontal, más prueba con `reducedMotion: 'reduce'`.

---

## 5. Orden de ejecución sugerido

1. Items 1 y 2 de la sección 2 (accesibilidad, esfuerzo mínimo).
2. Item 5 (familias de layout) y 6 (roadmap acordeón).
3. 3.2 (letras 3D en CSS) que es casi gratis.
4. 3.1 (naipes flotantes en hero), con presupuesto de performance medido.
5. El resto, según métricas reales de uso.
