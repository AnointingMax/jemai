@AGENTS.md

# Project conventions

- Next.js (App Router) + React, TypeScript, Tailwind CSS, shadcn/ui components
- Use `type`, not `interface`
- Double-quoted strings
- Arrow functions, not the `function` keyword
- Single-line `if`/`return` guards with no braces:
  `if (!customer) return response(res, false, 404, "Customer not found");`
- Reuse existing shadcn/ui primitives and existing components under
  `components/` before creating new ones — check there first
- Match Figma variables to existing Tailwind tokens (the `@theme` block in
  `app/globals.css`) rather than inventing new spacing/color values
- When you add a `--text-*` token to `@theme`, also register it in the
  `font-size` class group in `lib/utils.ts`. `cn()` uses tailwind-merge, which
  otherwise reads a custom `text-*` utility as a text *colour* and silently
  drops whatever colour class it is merged with

# Responsive design

Every page ships responsive — no desktop-only screens.

- The Figma file contains **desktop frames only** (1440px wide; the style guide
  is labelled "JEMAI DESIGN SYSTEM · DESKTOP"). Desktop is the parity target and
  must match its frame; tablet and mobile layouts are derived from it, since the
  design has no frames for them.
- Write mobile-first: unprefixed classes are the small-screen layout, then
  `sm:` / `md:` / `lg:` / `xl:` layer up to the desktop design. The `lg:`
  breakpoint (1024px) is where the desktop composition takes over.
- Page gutter steps `px-4` → `sm:px-6` → `lg:px-page-gutter` (64px, the Figma
  `layout/page-gutter` value). Section padding and stack gaps step down the same
  way rather than jumping straight to the desktop token.
- Side-by-side columns stack vertically on mobile. Card grids collapse
  4-up → 2-up → 1-up; horizontal card rails scroll on touch instead of squashing.
- Display/heading type scales down on small screens (`text-4xl sm:text-5xl
  lg:text-display`); body type keeps its token size.
- Fixed pixel widths from Figma become `max-w-*` + fluid width, never a hard
  `w-[1080px]`.
- Verify at three widths before checking a page off: **1440** (design parity),
  **768**, and **390**.
