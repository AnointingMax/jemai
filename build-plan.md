# JEMAI build plan

Figma: https://www.figma.com/design/H6CP33Usyu8COd06zaNBda/JEMAI-Preview
Page: `Customer facing` (`0:1`) · Style guide: `JEMAI / Style Guide` (`17:236`)

One page per session. Work top-down unless told otherwise.

- [x] Home — `58:1595` (1440 × 8604) — sections 01–06 plus the shared Newsletter
      and Footer. Section heights measured against their frames: intro −2,
      furniture +3, artworks −11, exhibitions +1, architecture +1, newsletter +2,
      footer −3. Verified at 1440 / 768 / 390.
- [x] Furniture — `1:607` (1440 × 4462) — `/furniture`. Built from three frame
      exports (`Nav`, `Furniture Catalogue`, `Architecture & Interiors CTA`) plus
      the shared Newsletter and Footer. Every landmark within 1–3px of its frame;
      page total 4449 vs 4462. Verified at 1440 / 768 / 390 and swept 390–1920
      for overflow.
- [ ] Furniture Details — `166:9708` (1440 × 2822)
- [ ] Artworks — `166:10393` (1440 × 6696)
- [ ] Artwork Details — `164:8295`, variant `278:28837` (1440 × 3512)
- [ ] Exhibitions / Upcoming — `186:12088`, with modal `278:28420` (1440 × 3251)
- [ ] Exhibitions / Past — `186:12520` (1440 × 3782)
- [ ] Upcoming Exhibition Details — `164:8752`, variant `267:24736`, paid event `278:26966` (1440 × 3307)
- [ ] Past Exhibition Details — `166:9228` (1440 × 6097)
- [ ] Consultation — `252:20009` (1440 × 3230)
- [ ] About Page — `182:10993` (1440 × 5917)
- [ ] Contact — `247:18961` (1440 × 2504)
- [ ] Cart Drawer — empty `1:1508`, filled/consent-off `1:1588`, filled/consent-on `1:1527` (500 × 900)
- [ ] Checkout — `1:1664`, plus modals: processing `257:20543`, success `267:23442`, payment issue `267:23955` (1440 × 1004)

Shared reference frames (not pages): `246:18783` intro, `247:18801` semantic colour,
`249:19691` typography, `249:19754` spacing & layout, `251:19982` shared components,
`267:22649` modal flows, `280:30461` modal wrapper.

## Notes

- **Page shell lives in `app/layout.tsx`.** The announcement bar, header, the
  closing newsletter and the footer are rendered there, and the layout owns the
  `<main className="flex flex-col gap-section-gap-editorial">` wrapper. A page
  returns only its own sections as siblings of that flex column — no `<main>`,
  no chrome. The newsletter is the last child of `main`, so it keeps the 80px
  editorial gap from whatever section precedes it. A page that must *not* close
  on the newsletter (checkout and the cart drawer are the likely ones) needs a
  route group with its own layout rather than an opt-out prop.

- **Display typeface.** `Classico` (the design's display/heading face) is licensed and
  vendored at `public/figma/fonts/Classico`, self-hosted via `next/font/local` in
  `app/layout.tsx` and exposed as `font-heading`. Only 400 and 700 are available;
  the 600 heading token resolves to the bold file. Body copy is Assistant from
  Google Fonts.
- **Tokens.** The Figma variables live in the `@theme` block at the bottom of
  `app/globals.css` (colours, type scale, layout spacing), and the shadcn/ui semantic
  variables are re-pointed at them so primitives inherit the brand.
  Figma reports `letterSpacing` as a **percentage** of font size — those are stored as
  `em` values, not `px`.
- **Responsive.** Frames are desktop-only, so 1440 is the parity target and the
  `md`/`sm` layouts are derived. See the responsive section in `CLAUDE.md`.
- **Assets.** Exported to `public/figma/{brand,icons,home}`. Node exports bake the
  surrounding canvas fills in as bare `<rect>` elements — strip those, but keep the
  `<rect>` inside `<clipPath>` in `<defs>` or the whole logo gets clipped away.

- **Newsletter & Footer.** The Figma MCP quota (Starter tier = 20 calls/month)
  ran out before these two could be pulled, so they were built from 1x PNG frame
  exports in `design-reference/` instead: colours sampled and geometry measured
  out of the pixels with `sharp`. Both are within a few px of their frames.
  Re-derive from Figma directly if the plan is ever upgraded.
- **Divider rule.** Measured at exactly **3px of `#98908f`** — i.e.
  `border-t-[3px] border-border-strong`. All six section rules use it.
- **Footer ground.** `#320b11`, sampled from the export and added to `@theme` as
  `--color-surface-footer`; the file publishes no variable for it.
- **Measure the export, don't eyeball it.** With the MCP quota gone, the reliable
  method is to compare *ink extents* per text run between the frame export and a
  Playwright screenshot (`sharp` ships under `next`; there is no other image
  tooling on this machine). Matching a run's rendered width to the frame's pins
  size, weight and wrap width exactly. Two things only this caught:
  the Newsletter eyebrow is `text-eyebrow-lg` (12px, width 147) and not
  `text-eyebrow` (10px, width 123); and the h2 is Classico **Bold** — at 40px,
  w700 measures 445 against the frame's 447, w400 measures 489.
- **Heading weight — confirmed and fixed.** `section-intro.tsx` and
  `consultation-cta.tsx` rendered their h2 as `sm:text-[40px]`, which carries no
  weight and so resolved to Classico Regular. The Furniture CTA frame settled it
  (see the Furniture notes); both now use `sm:text-h2`, which carries
  `--text-h2--font-weight: 700`, as the Newsletter always did.
- **Footer pattern.** `public/figma/brand/footer-pattern.png` — a 300 × 514 tile
  (11 KB, 37 colours) recovered from the export rather than re-drawn: the motif
  repeats every 300px horizontally (autocorrelation 0.94), so median-stacking the
  ~4.8 repeats while masking overlaid content reconstructs a clean tile. It
  renders pixel-identical to the frame (matching min/max/mean per channel). No
  vertical period, so a taller footer repeats it with a seam — invisible at the
  ~1% contrast the motif actually carries.
- **One spot fitted to the frame, not to a token.** The footer nav lists carry
  `lg:max-w-[72px]` because the frame wraps "JEMAI Journal" onto two lines. It is
  `lg:`-scoped so tablet and mobile flow naturally. The wrap looks more like a
  Figma text-box artifact than a deliberate decision — drop the class if it is.
- **Footer grid tracks are `fr`, and the ratios matter.**
  `lg:grid-cols-[341fr_164fr_164fr_292fr_345fr_6fr]`. They sum to 1312, which is
  the inner width at 1440 (1440 − 2×64 gutter), so at the design width each `fr`
  resolves to exactly 1px and the columns land on the frame's 64 / 405 / 569 /
  733 / 1025 — while every other viewport scales instead of overflowing. The
  trailing `6fr` is the slack the frame leaves right of the sign-up column;
  without it the other five would absorb that 6px and shift off the frame.
  These were fixed `px` tracks at first, which overflowed by 90px at 1280:
  five fixed tracks total 1306px and need a 1434px viewport, but `lg:` starts at
  1024. **Verify layout changes across a width sweep, not just 1440/768/390** —
  three checkpoints straddled that whole broken range without touching it.
- **Git.** The repo now exists (`origin/main`, one commit: "(feat): home page").
  The Furniture work is uncommitted — no session commits without being asked.
  `design-reference/` is gitignored, so the frame exports live only on this
  machine; keep them somewhere durable if the measurements need re-deriving.
- **Carousels.** Both were chrome without behaviour: the Curator's Pick arrows
  were inert `<button>`s, and the exhibition picker could not move anything at
  desktop because all four photographs fit at once.
  - `components/site/curator-carousel.tsx` (new, client) drives the panel and the
    framed work from one index and wraps at both ends. The gallery photograph
    behind it stays put. Three picks in `artworks-section.tsx`; **the second and
    third are placeholder copy** over existing images — replace with real works.
  - `components/site/photo-rail.tsx` now syncs both ways: the picker scrolls the
    rail and the rail's scroll position updates the picker.
  - **The dashes count pages, not slides.** A rail only scrolls to
    `scrollWidth - clientWidth`, so the final screenful can never reach the left
    edge — one dash per photograph left the trailing dashes dead (clicking dash 6
    of 8 moved nothing). Pages also fall out responsively: 8 dashes at 390, 3 at
    768, 2 at 1440, re-measured by `ResizeObserver`.
  - The exhibition rail runs the four photographs twice so there is something to
    page to; swap in real photography and drop the repeat.
  - Removing `lg:justify-center lg:overflow-visible` from the rail **also fixed
    the 1024–1050px horizontal overflow** noted earlier. `justify-center` on an
    overflowing flex row pushes the leading items past the scroll origin where
    they cannot be reached, so a scrollable rail must not use it. The rail is
    now left-aligned at desktop rather than centred — a small, deliberate
    departure from the frame, which had no scrollable state to draw.


## Furniture page notes

- **Reuse, not reimplementation.** `ProductCard` matched the catalogue grid
  almost exactly as built (316px cards, 16px gutter, 4-up), so the grid is pure
  reuse. Two blocks that were inlined on the home page became shared components:
  `components/site/assurance-row.tsx` (the three-up reassurance band, now taking
  its items as props so the icons can be `<Image>` on home and icon components
  here) and `components/site/consultation-cta.tsx` (the "Begin a project" band).
  Product data moved to `lib/products.ts`, which both pages read.
- **Confirmed: the h2 headings were a weight too light.** The earlier note
  suspected it; the CTA frame proves it. Classico Bold is *narrower* than
  Regular, so the frame's heading measures 405px where `sm:text-[40px]`
  (weight 400) rendered 435. Switching to `sm:text-h2` — which carries
  `--text-h2--font-weight: 700` — lands it at 405 exactly. Fixed in both
  `section-intro.tsx` and `consultation-cta.tsx`, so home sections 01–05 are
  corrected too. The page H1 is a different case: at 48px the frame measures
  Classico **Regular** (246 ink vs 246 predicted; Bold would be 232), so
  `lg:text-[48px]` with no weight is right there.
- **The nav frame closes on a section rule.** `Nav.png` is 119px tall: the
  announcement bar (43), the header (to 102), then the same 3px
  `border-strong` rule every section opens with at y=115–118. The home page
  renders no such rule under its header — worth checking against the home frame,
  since it would push everything on that page down 16px.
- **The catalogue's own numbers contradict each other.** The frame draws 16
  cards in 4 rows, labels the result set "44 ITEMS", and its pager reads
  "1-12 of 16 products" with the bar at 75%. No single reading satisfies all
  three. The build keeps the dominant visual — 4 rows of 4 — and derives the
  rest from data: 44 catalogue entries, `PAGE_SIZE = 16`, so the pager reads
  "1-16 of 44 products" at 36%. Only the pager string diverges from the frame.
- **Placeholder product data.** The frame draws only four real pieces, cycled in
  a fixed shuffled order; `rotation` in `lib/products.ts` reproduces the first
  sixteen exactly so the grid matches the frame, then repeats to 44. Replace it
  with the real catalogue. The `collection` field is `"Chairs"` for all four, so
  every tab except All and Chairs lands on the empty state.
- **The empty state is invented.** No frame draws one, and functional filters
  need one. It is deliberately minimal — one line of body copy and a "Clear
  filters" action.
- **Three colours in this frame are off-palette.** The Load more button is a
  solid `#333639`, the pager text and progress fill `#3c4347`, the progress
  track `#eaeaea`. None is within reach of a JEMAI token (the CTA language
  everywhere else is `action-primary` maroon), so they are literal hex with a
  comment rather than invented tokens. Worth raising with the designer — this
  block looks pasted in from another system.
- **The assurance row's top and bottom rules measure a solid `#dfdfdf`**, not
  `border-default` (`#16050729`, which composites to `#d3d1d1` on the page
  ground). The column dividers *are* `border-default`. The build uses
  `border-border-default` for all of them to match the home page; the delta is
  ~12 levels on a 1px line.
- **Three icons were traced, not exported.** Globe, return-arrow and padlock are
  hand-authored SVGs in `components/icons/index.tsx`, matched against a pixel
  dump of the frame (32px artwork, 2px stroke, `icon/action`). Widths land
  within 1px; the padlock is 4px shorter than drawn because it was fitted to a
  32-unit viewBox. Replace with the Figma SVG exports when the MCP quota allows.
- **The category tabs sit 24px right of centre in the frame** (ink 474–1013,
  centre 743.5 against a page centre of 720) while measuring exactly 539px wide,
  the same as the render. That reads as a Figma positioning artifact rather than
  intent, so the row is page-centred here.
- **The consultation panel is 526px on this frame and 560px on home.** Same
  component, two widths in the design file, so `ConsultationCta` takes a
  `panelClassName` and each caller passes its own.
- **The filter bar breaks the page gutter.** Its rules run the full viewport
  width while its contents sit in a 1152px measure — an outer
  `px-4 sm:px-6 lg:px-page-gutter` with an inner `mx-auto max-w-[1152px]`, which
  lands on the frame's 144/1296 at 1440 and keeps a gutter below 1152.
- **Measuring without Playwright.** The MCP browser was locked by another
  session for this whole build, so verification ran against headless Chrome over
  CDP (`--remote-debugging-port`, driven by Node's built-in `WebSocket`).
  `--virtual-time-budget` hangs against `next dev` — leave it off.
