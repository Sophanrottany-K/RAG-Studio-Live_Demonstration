# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A **static, no-backend React prototype**: a faithful code rendering of the Figma
section *Live Demo · RAG Studio (prototype)*. 44 screens, wired together exactly like
the Figma prototype links. There is no API, no data layer and no real application
state — every number, label and "uploaded file" is hard-coded markup.

Treat the Figma design as the source of truth. When changing layout, spacing, color or
typography, the goal is matching the design, not inventing a nicer one.

## Commands

```bash
npm run dev       # Vite dev server (usually http://localhost:5173)
npm run build     # tsc -b && vite build  → dist/
npm run preview   # serve the built dist/
npm run format    # prettier --write on src/**/*.{ts,tsx,css}
```

There are **no tests and no linter**. `npm run build` is the only automated check —
it type-checks with `tsc -b` before bundling, so run it after non-trivial edits.

## Architecture

- `src/main.tsx` → `src/App.tsx`: `HashRouter` (routes are `#/...`, so the build runs
  from any static host with no server rewrites; `vite.config.ts` sets `base: "./"`).
- `src/screens/index.ts`: the single registry — one `{ path, title, Component }` entry
  per Figma frame, in prototype order. `App.tsx` maps over it; `#/screens` renders
  `ScreenIndex` (the jump list) and also catches unknown routes.
- `src/components/Stage.tsx`: wraps every screen. It picks a scale so the window behaves
  like a ~1536×760 laptop viewport, lays out at `window/scale`, then scales back up.
  Screens therefore assume a desktop-width canvas and use `w-full h-full` — they are not
  responsive in the usual sense, and should not be made so.
- `src/lib/nav.ts`: the only two navigation primitives.
  - `useGo()` → `onClick={go("/list")}` for click links.
  - `useAutoNext(to, ms)` for Figma "After delay" transitions (used by the uploading /
    processing screens, e.g. `Screen10S3u`, `Screen14DDraft`, `Screen41KbAdded`).
- `src/components/shared/`: blocks that appear on several screens.
- `public/icons/`: every icon, logo and chart exported from Figma as SVG.

## Conventions

**Screens** — `src/screens/ScreenNN<Key>.tsx`, default export named after the file, with
a two-line header comment giving the Figma frame title and the route:

```tsx
// Demo 04 · [list] A2 · Chatbots list
// Route: #/list
```

A new screen needs the file plus an entry in `src/screens/index.ts`; nothing else.

**Markup is generated from Figma auto-layout.** Expect long chains of Tailwind utility
classes mirroring frames one-to-one (`flex-1 min-w-0 self-stretch …`), text wrapped as
JSX string literals (`{"Analytics"}`), and arbitrary values (`text-[15px]`,
`rounded-[24px]`, `bg-[#ECE7FB]`) wherever the Figma node had no variable behind it.
This verbosity is intentional — do not "clean it up", collapse duplicated markup into new
abstractions, or swap hard-coded hex for a token that is merely close.

**Icon paths are relative, with no leading slash**: `src="icons/brand.svg"`. A leading
`/` breaks the `base: "./"` build when hosted in a subfolder.

**Duplicate-looking shared components are not duplicates.** `Header2…Header9`,
`Breadcrumb2…Breadcrumb7`, `Sidebar2…Sidebar4`, `ConfigTiles2`, etc. are distinct Figma
component variants that happen to be similar. Keep them separate; edit only the one the
screen in question imports. Shared components are mostly prop-less; a few take an
optional callback (e.g. `Right({ onManageChannels })`).

**Styling** — Tailwind CSS v4 via `@tailwindcss/vite`, no `tailwind.config`. Design tokens
are CSS variables in the `@theme` block of `src/index.css` (`--color-ink-body`,
`--font-gabarito`, …), used as `text-ink-body`, `font-gabarito`. Fonts load from Google
Fonts in `index.html`. Prettier is configured with `printWidth: 120` only.
