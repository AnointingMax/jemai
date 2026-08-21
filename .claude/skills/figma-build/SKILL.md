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
- Match Figma variables to existing Tailwind tokens in `tailwind.config` rather
  than inventing new spacing/color values
- Forms: React Hook Form + Zod/Yup validation, following existing patterns in
  the repo if any exist
- Data fetching: TanStack Query, following existing patterns in the repo if
  any exist

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
    - Check `components/` and `tailwind.config` for existing pieces that
      already match before writing anything new.
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
