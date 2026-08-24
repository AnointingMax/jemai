---
name: figma-build
description: Implements the next unbuilt page from this project's Figma design as production code, one page at a time, verified against the design via screenshot. Use when asked to build, implement, or continue building pages from the Figma design.
---

# Project conventions

- Next.js (App Router) + React, TypeScript, Tailwind CSS, shadcn/ui components
- Use `type`, not `interface`
- Double-quoted strings
- Arrow functions, not the `function` keyword
- Single-line `if`/`return` guards with no braces:
  `if (!customer) return response(res, false, 404, "Customer not found");`
- Reuse existing shadcn/ui primitives and existing components under `components/`
  before creating new ones — check there first
- Match Figma variables to existing Tailwind tokens rather than inventing new
  spacing/color values. This is Tailwind v4: there is **no `tailwind.config`**.
  Tokens live in the `@theme` block in `app/globals.css`
- When you add a `--text-*` token to `@theme`, also register it in the
  `font-size` class group in `lib/utils.ts`. `cn()` uses tailwind-merge, which
  otherwise reads a custom `text-*` utility as a text *colour* and silently
  drops whatever colour class it is merged with
- Forms: React Hook Form + Zod/Yup validation, following existing patterns in
  the repo if any exist
- Data fetching: TanStack Query, following existing patterns in the repo if
  any exist

## Route structure

The app is split into two trees. Put new work in the right one:

- `app/(customer)/` — the storefront. `(site)/` is the editorial shell
  (announcement bar, header, newsletter, footer); `(checkout)/` is the
  stripped-back checkout shell. The cart provider lives on the `(customer)`
  layout, not the root.
- `app/admin/` — internal tools, with its own layout and no storefront chrome.
- `app/layout.tsx` — document shell and fonts only. Don't add page chrome,
  providers, or storefront metadata here; they belong to one tree or the other.

Route groups are folders, not URL segments, so `app/(customer)/(site)/about`
still serves `/about`.

## Writing Tailwind classes

Prefer, in this order: an existing `@theme` token → a stock Tailwind scale
value → an arbitrary value. Only reach for `foo-[...]` when the first two
genuinely cannot express the value.

- **Lengths go on the spacing scale.** `--spacing` is the default `0.25rem`, so
  a Figma measurement in whole pixels is that number over four: 12px is `mt-3`,
  18px is `mt-4.5`, 29px is `mt-7.25`. Write `mt-7.25`, not `mt-[29px]`. Quarter
  steps are fine and already used across the codebase; keep the pixel figure in
  a comment when it documents a frame measurement.
- **Aspect ratios take a bare fraction**: `aspect-1440/501`, not
  `aspect-[1440/501]`.
- **Type sizes**: if the px matches a `--text-*` token, use the token — but only
  when the token's line-height and weight are also what you want, since the
  token sets all three. Otherwise keep the arbitrary size.
- Some v4 names differ from v3 muscle memory: `bg-linear-to-b` (not
  `bg-gradient-to-b`), `bg-top-left` (not `bg-left-top`), `bg-size-[...]` (not
  `bg-[length:...]`), `scrollbar-none` (not `[scrollbar-width:none]`),
  `group-has-focus-visible` (not `group-has-[:focus-visible]`).

**Check your work** with the Tailwind language server's `suggestCanonicalClasses`
diagnostic, which flags every non-canonical class in one pass. The VS Code
extension shows them inline; to sweep the whole repo headlessly, drive
`~/.vscode/extensions/bradlc.vscode-tailwindcss-*/dist/tailwindServer.js` over
stdio with `tailwindCSS.lint.suggestCanonicalClasses` set to `"warning"`.

Treat its output as suggestions, not orders — **verify before applying any that
change a computed value.** It resolves theme variables statically and misses
runtime overrides. Known false positive: it suggests `rounded-[4px]` →
`rounded-lg`, but `app/globals.css` sets `--radius: 0px`, so `rounded-lg`
computes to **0px** and taking the suggestion squares off the corner. Confirm
with a computed-style probe in the browser when a suggestion touches a value
that a `:root` block redefines.

Legitimately arbitrary in this codebase, and fine to leave: sub-pixel values
from Figma auto-layout (`gap-[14.896px]`), `border-[1.5px]`, `backdrop-blur-[2px]`,
off-scale display type (`text-[50px]`), `fr` grid tracks, and `min()`/`calc()`
widths.

## Design source

There is a Figma design for this project: [**\[FIGMA FILE URL — fill in\]**](https://www.figma.com/design/H6CP33Usyu8COd06zaNBda/JEMAI-Preview?node-id=0-1&p=f&t=WVZYd2mTGPW4DDIb-0)

This file is the source of truth for layout, spacing, typography, and color —
do not invent or improvise design decisions that aren't in it. Pull design
context per frame through the Figma MCP tools (`get_code`, `get_variable_defs`,
`get_image`, and `get_code_connect_map` if available) rather than guessing
from a screenshot alone.

## Build loop: implement the design one page at a time

Each session builds exactly one page, then stops. Do not chain automatically
into the next page.

1. **Enumerate.** If `build-plan.md` doesn't exist yet, create it by listing
   every top-level frame/page in the Figma file as an unchecked item:
    ```markdown
    - [ ] Home
    - [ ] Product listing
    - [ ] Product detail
    - [ ] Cart
    - [ ] Checkout
    ```
2. **Pick the next unchecked item** at the top of `build-plan.md` (unless
   told to work on a specific page instead):
    - Extract that frame's design context via the Figma MCP tools.
    - Check `components/` and the `@theme` block in `app/globals.css` for
      pieces that already match before writing anything new.
    - Implement the page per the conventions above.
    - Start (or reuse) the dev server, use Playwright MCP to navigate to the
      route, resize to the frame's breakpoint, and screenshot it. Fetch the
      Figma frame's own image and compare the two directly.
    - If they don't match, fix and re-screenshot.
    - Once it matches, check the item off in `build-plan.md` and commit.
3. **Stop there.** Report which page was built and what's next in
   `build-plan.md`, then wait for the next instruction — don't start another
   page in the same session.
4. **Don't guess past a blocker.** If a mismatch persists after a few fix
   attempts, or a design token/component has no clear mapping, stop on that
   item, report the specific discrepancy, and wait for input rather than
   shipping a best-guess version.
