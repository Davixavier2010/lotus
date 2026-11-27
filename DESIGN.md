# Design System — Lótus

## Palette & Surfaces
- **Washi Ground (`--washi-bg`):** `#F4EEDE` — papel natural quente para leitura longa sem fadiga visual.
- **Elevated Paper (`--washi-surface`):** `#FAF6EB` — seções alternadas (Prefácio, Sumário), caixas de conceito e formulários.
- **Recessed Paper (`--washi-recessed`):** `#EAE2CE` — banda de captação (Lista de Acompanhamento).
- **Primary Ink (`--ink-primary`):** `#141416` e **Strong Ink (`--ink-strong`):** `#000000` — texto corrido e títulos.
- **Muted Warm Ink (`--ink-muted`):** `#4A463F` — metadados, legendas e rótulos secundários (contraste ≥ 4.5:1 sobre `#F4EEDE`).
- **Hanko Vermilion (`--hanko-red`):** `#C82E36` (hover `#A82229`) — selo `蓮` / `終わり`, barra de progresso de leitura, títulos de conceito e ações principais.

## Typography
- **Editorial Serif (`--font-serif`):** `Spectral` (400, 500, 600, italic) — títulos (`h1`–`h4`) e leitura literária dos contos e reflexões (`65ch`, `leading-[1.9]`).
- **Interface Sans (`--font-sans`):** `Hanken Grotesk` (400, 500, 600) — navegação, metadados, filtros e botões.
- **Japanese Seal (`--font-jp`):** `Noto Serif JP` (500) — ideogramas `蓮` e `終わり`.

## Motion & Interaction
- **Reduced Motion:** Todos os componentes Framer Motion respeitam `useReducedMotion()`.
- **Scroll Progress:** Barra fixa superior (`scaleX` via `useScroll()`) nas páginas de capítulo.
- **Ritual de Leitura:** O Conto é exibido integralmente até `終わり`; a seção *Reflexão de Lótus* é revelada via `AnimatePresence` após a conclusão do conto (ou via âncora `#reflexao`).
- **Browser Surfaces:** Seleção de texto em `#C82E36` / `#F4EEDE`, foco visível com anel `#C82E36` e scrollbar customizada em tinta suave.
