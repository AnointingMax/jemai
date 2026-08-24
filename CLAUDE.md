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

# Route structure

- `app/(customer)/` — the storefront. `(site)/` is the editorial shell
  (announcement bar, header, newsletter, footer); `(checkout)/` is the
  stripped-back checkout shell. The cart provider lives on the `(customer)`
  layout, not the root.
- `app/admin/` — internal tools, with its own layout and no storefront chrome.
- `app/layout.tsx` — document shell and fonts only. Page chrome, providers and
  storefront metadata belong to one tree or the other, never the root.

Route groups are folders, not URL segments, so `app/(customer)/(site)/about`
still serves `/about`.

# Tailwind class values

Prefer an existing `@theme` token, then a stock Tailwind scale value, and only
then an arbitrary `foo-[...]` value.

- Lengths go on the spacing scale — `--spacing` is `0.25rem`, so a whole-pixel
  Figma measurement is that number over four: 29px is `mt-7.25`, not
  `mt-[29px]`. Quarter steps are fine.
- Aspect ratios take a bare fraction: `aspect-1440/501`, not `aspect-[1440/501]`.
- v4 renamed some v3 names: `bg-linear-to-b`, `bg-top-left`, `bg-size-[...]`,
  `scrollbar-none`, `group-has-focus-visible`.
- Sweep with the Tailwind LSP's `suggestCanonicalClasses` diagnostic, but verify
  any suggestion that changes a computed value. It misses `:root` overrides —
  it wrongly suggests `rounded-[4px]` → `rounded-lg`, which is 0px here because
  `app/globals.css` sets `--radius: 0px`.

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
