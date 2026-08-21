# JEMAI build plan

Figma: https://www.figma.com/design/H6CP33Usyu8COd06zaNBda/JEMAI-Preview
Page: `Customer facing` (`0:1`) · Style guide: `JEMAI / Style Guide` (`17:236`)

One page per session. Work top-down unless told otherwise.

- [x] Home — `58:1595` (1440 × 8604) — sections 01–06 plus the shared Newsletter
      and Footer. Section heights measured against their frames: intro −2,
      furniture +3, artworks −11, exhibitions +1, architecture +1, newsletter +2,
      footer −3. Verified at 1440 / 768 / 390.
- [ ] Furniture — `1:607` (1440 × 4462)
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
- **Heading weight, worth re-checking.** `components/site/section-intro.tsx`
  renders its h2 as `sm:text-[40px]`, which carries no weight and so resolves to
  Classico Regular, while `--text-h2--font-weight` is `700`. Sections 01–05 all
  go through `SectionIntro`, so their headings are probably a weight too light.
  The Newsletter sets `sm:text-h2` instead, which carries the weight.
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
- **Not committed.** This directory is not a git repository, so no session so far
  has been committed. `git init` first if you want the build history tracked.
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
