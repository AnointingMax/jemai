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
- [x] Furniture Details — `166:9708` (1440 × 2822) — `/furniture/[slug]`. Built
      from two frame exports (`Header - Product Detail`, `Related Products`)
      plus the shared Newsletter and Footer. Every landmark within 1–1.5px of
      its frame; page total 2804 vs 2822. Verified at 1440 / 768 / 390 and
      swept 360–1920 for overflow.
- [~] Artworks — `166:10393` (1440 × 6696) — `/artworks`. Built from three
      exports (`Frame 385`, `Artwork Catalogue`, `Exhibition CTA`). The three
      blocks render at **702 / 3100 / 500 against the frame's 702 / 3096 / 500**,
      and every landmark inside them lands within 5px. Verified at 1440 / 768 /
      390, swept for overflow at 390 / 1024 / 1920.
      **Not complete: roughly 1087px of the frame is missing.** The five exported
      nodes plus five 64px gaps total 5609 against the frame's 6696, so at least
      one block was never exported — see the notes. Do not check this off until
      that block lands.
- [x] Artwork Details — `164:8295`, variant `278:28837` (1440 × 3512) —
      `/artworks/[slug]`, plus the Enquire modal (`modal wrapper.png`). Built
      from two exports. **The content block renders at exactly its export's
      2017px**, every text run matches its frame's ink width within 3px, and the
      modal panel lands on the frame's 1124 × 715 with every band within 2px.
      Verified at 1440 / 768 / 390 and swept 360–1920 for overflow.
      **Note: ~1495px of the 3512 frame is unaccounted for** — see the notes.
- [x] Exhibitions / Upcoming — `186:12088`, with modal `278:28420` — `/exhibitions`,
      built from `Exhibitions - upcoming/Upcoming.png` (1440 × 2879) and its
      `modal wrapper.png`. Every band lands within 3px of its frame and the
      "Coming soon" block is exact. Verified at 1440 / 768 / 390, swept
      360–1920 for overflow.
- [x] Exhibitions / Past — `186:12520` — `/exhibitions/past`, built from
      `Exhibitions - past/Past.png` (1440 × 3183). **Every band lands within
      1px**, all three card rows at 434 exactly. Verified at 1440 / 768 / 390.
- [x] Upcoming Exhibition Details — `164:8752`, paid `278:26966`, unpaid
      `267:24736` — `/exhibitions/[slug]`, built from the three exports in
      `Upcoming Exhibition Details/`. **Every landmark on the page lands within
      1px of its frame**; the free and paid register modals land within 2px of
      theirs. Verified at 1440 / 768 / 390.
- [x] Past Exhibition Details — `166:9228` — `/exhibitions/past/[slug]`, built
      from `Past Exhibition Details.png` (1440 × 6097, the whole page). **Every
      one of its 40-odd bands lands within 1px** from the breadcrumb to the
      artist note. Verified at 1440 / 768 / 390.
- [x] Consultation — `252:20009` (1440 × 3230) — `/consultation`. Built from
      three frame exports (`Frame 385`, `Section`, `Artwork Catalogue` — the
      last is misnamed, it is the FAQ). **All three blocks render at exactly
      their frame heights: 600 / 949 / 371**, the form's five rules land on
      284 / 368 / 456 / 540 / 725 against 284 / 368 / 456 / 540 / 724, and the
      FAQ block is pixel-exact including the 20 × 20 toggle box at 1130, 158.
      Verified at 1440 / 768 / 390 and swept for overflow at 390 / 1024 / 1920.
- [x] About Page — `182:10993` (1440 × 5893) — `/about`. Built from frame
      *metadata* plus one export (`design-reference/1.png`, the founder note).
      The Figma quota died one call in, so five of the six blocks have no
      screenshot behind them and were solved from geometry alone; each lands
      within 3–4px of its frame, and the founder note — the one block that was
      measurable — lands within 2px on every landmark. **Page total 5889 against
      the frame's 5893.** Verified at 1440 / 768 / 390 and swept for overflow at
      390 / 1024 / 1050 / 1920. Colours outside the founder note are inferred
      rather than sampled; see the notes.
- [x] Contact — `247:18961` (1440 × 2504) — `/contact`. Built entirely from
      frame exports (`Container.png` and the three shell frames), since the
      Figma quota was gone before this frame could be read. Every landmark lands
      within 1px: the four form rules at 182 / 274 / 366 / 532, the directory
      rules at 214 / 268 / 321 / 374 / 427 against 214 / 267 / 320 / 373 / 426,
      the map at 444, 842 at 932 × 480, and the container 1322 against 1323.
      Verified at 1440 / 768 / 390 and swept for overflow at 390 / 1024 / 1920.
- [x] Cart Drawer — empty `1:1508`, filled/consent-off `1:1588`, filled/consent-on
      `1:1527` (500 × 900). Built from the three frame exports in
      `design-reference/`. Header, rule, item row and footer rhythm land within
      1px of the frames; only the item title is off (3px of ink width).
      Verified at 500 (design parity), 1440, 768 and 390.
- [x] Checkout — `1:1664`, plus modals: processing `257:20543`, success
      `267:23442`, payment issue `267:23955` (1440 × 1004) — `/checkout`, on its
      own `app/(checkout)` route group so the page closes on Pay Now with no
      newsletter and no footer. Delivery form, order summary and the three
      shared-wrapper payment modals live under `components/checkout/`; the
      off-palette values are collected in `components/checkout/tokens.ts`.

## Admin console

Built from the PNG drops in `design-reference/` rather than Figma — `Log in.png`,
the four `Recover password/` frames, and `Layout/{header,sidebar-7}.png`. There
are no admin frames in the `Customer facing` Figma page, so these exports are the
only reference; section screens beyond the shell have no design yet.

- [x] Admin auth — `/admin/login`, `/admin/recover-password`,
      `/admin/recover-password/check-email`, `/admin/reset-password`,
      `/admin/reset-password/success`. One 360px column on white, on the
      `app/admin/(auth)` group. **Every band on all five screens lands within
      3px of its frame**, with the fields at exactly 360 × 44 and each button on
      its frame's 40px box. Verified at 1440 / 768 / 390.
- [x] Console shell — `/admin` and the seven section routes, on the
      `app/admin/(dashboard)` group. **The rail matches `sidebar-7.png`
      band-for-band** — wordmark 24-47, group labels on 92 / 280 / 432, row
      pitch 36 with 28px pills, footer within 1px — and the header's runs land
      within 2px of `header.png` across the 64px bar. Verified at 1440 / 768 /
      390, plus the collapsed rail and the mobile drawer.

Notes on the admin drops:

- **The auth set runs two type scales.** The login frame is a 22px title over
  16px copy; the four recovery frames are 28px over ~18px. Measured on ink the
  recovery copy reads 18.4px against Assistant — 18px is the nearest token and
  lands every line within 3%, so the remaining ~2% width gap on those runs is
  expected, not drift. Worth a designer check.
- **Section screens are placeholders.** Every route under the console renders a
  title and a one-line blurb. The nav and the breadcrumb both read
  `components/admin/nav.ts`, so a section is named once.
- **`admin-surface` scopes the console's ground.** The storefront squares every
  corner (`--radius: 0px`) on the page ground; the console is white with an 8px
  radius. The class sits on the two admin layouts, so the shadcn primitives
  inside them pick up console values without touching the storefront.
- **The rail collapses off-canvas, not to icons.** No row in the frame carries
  an icon of its own, so an icon strip would have nothing to draw.
- **`devIndicators: false`** in `next.config.ts` — the floating dev badge sits
  over the sidebar's account row and lands in every measuring screenshot.

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

## Furniture Details notes

- **Route.** `app/furniture/[slug]/page.tsx`, which is where the product cards
  already pointed. `params` is a promise in Next 16 — `await` it. Five slugs are
  prerendered via `generateStaticParams`; an unknown slug 404s.

- **The frame details a piece that is not in the catalogue.** It draws "Palma
  Side Chair" at ₦150,851.19 over the *Mila* photograph. Palma is carried in
  `productDetails` so the page can be checked against the frame directly, and
  kept out of `rotation` so the catalogue grid still matches its own frame.
  The four catalogue pieces get detail pages too, with written summaries.

- **Two columns of 660 / 652 `fr`**, summing to the 1312px inner width, so each
  `fr` resolves to 1px at 1440 and scales everywhere else — the same trick the
  footer grid uses. The gallery panel is `items-start` so it closes at its own
  750px rather than stretching to the taller info column, as the frame draws it.

- **The divider at x=723 is two coincident strokes.** Its composited alpha is
  0x4b, which is `border-default` (0x29) over itself — not `border-strong`
  (0x6b). So the panel's right border and the info column's left border are both
  drawn. The info column's *top* rule really is `border-strong`, and it starts at
  724, i.e. right of the divider, not at the page gutter.

- **Panel geometry is exact.** 40px padding all round, a 578 × 580 main image
  (`aspect-[578/580]`, fluid rather than a hard width), an 8px gap, then four
  80px thumbnails 8px apart on a white ground with a `border-default` hairline.
  Panel, image and thumbnails all land pixel-identical to the frame.

- **Both headings are `text-h3` — 28px Classico Bold.** The page H1 and "You May
  Also Like" each measure 191/201 of ink at 23/29 tall; Classico Regular at 26px
  matches the widths (190.3 / 203.1) but is ~2 units short on the ink height,
  while 28/700 lands on both (191.6 / 22.1 and 201.5 / 27.9). Note this is the
  *opposite* of the catalogue H1, which is Regular at 48px — the two pages
  genuinely differ, so don't unify them without measuring.
- Other type, all confirmed by matching ink extents: price and summary are
  `text-body-lg`; the COLOR / SELECT SIZE eyebrows are `text-eyebrow-lg` (12px);
  the size-chip labels are `text-eyebrow` (10px — "CUSTOM" measures 40, which
  only 10px semibold at 0.08em gives); the shipping lines are `text-body-xs`
  (12px, "Pay in your local currency…" measures 221 against a rendered 222).

- **This page's breadcrumb uses "/" separators**, not the chevron the catalogue
  breadcrumb uses. The run measures 201 against the frame's 202. Two frames,
  two treatments — left as drawn rather than unified.

- **Variants cross-filter both ways** (`components/furniture/product-purchase.tsx`).
  `ProductVariant` is a colour × size × stock row. With a colour picked, only
  sizes in stock in that colour stay selectable; with a size picked, only the
  colours that carry it. Re-clicking the current chip clears it — without that
  escape, gating both axes can strand a selection with no way back. The stock
  matrix is placeholder but deliberately uneven (Amber runs in 14/15 only,
  Custom in Cream only, Olive down to a single 12) and **sums to 14, so the pill
  reads "14 Items In Stock" on load exactly as the frame draws it.**

- **Two deliberate departures from the frame, both because it draws a state that
  cannot exist.** The frame shows a live maroon "Add To Cart" with nothing
  selected; the label is kept but the button is disabled until a colour and size
  are chosen, so it renders at reduced opacity on load. And the frame's four
  thumbnails are alternate shots that were never exported — the other catalogue
  photographs stand in. Both are data/state problems, not layout ones.

- **The accordion block is inset 20px further than everything above it** (right
  edge 1335 vs 1355). That reads as a Figma artifact rather than intent, so it
  is a single `lg:mr-5` on the block rather than a second measure threaded
  through the column. Rows are 64px plus a 1px rule = the frame's 65px pitch,
  with no rule above the first. Built on `radix-ui`'s Accordion; the
  `accordion-down`/`accordion-up` keyframes come from `tw-animate-css`, already
  imported in `globals.css`. **No frame draws an expanded panel**, so the open
  state and all four bodies of copy are written, not transcribed.

- **The stock pill's green is `#74aa5b`**, sampled off the frame. Like the
  catalogue's Load-more block, nothing in the JEMAI palette is close, so it is a
  literal hex with a comment rather than an invented token.

- **Page total is 2804 against the frame's 2822.** Everything this page owns
  matches within 1–1.5px, and the residual 18px sits in the shared Newsletter and
  Footer, which render slightly taller than their own exports. Worth noting that
  the frame's own arithmetic does not close either: the five section frames plus
  two 80px editorial gaps come to 2727, 95 short of 2822.

- **`flex-1` must be breakpoint-scoped inside a column.** The Add To Cart button
  stacks above `sm:`, where `flex-1` resolves flex-basis against the *height* and
  flattened it to a sliver. It is `sm:flex-1` with `w-full` below that.

- **Running the dev server from a git worktree.** Turbopack rejects a symlinked
  `node_modules` ("points out of the filesystem root") because `next.config.ts`
  pins `turbopack.root` to `__dirname`. `cp -Rc` (APFS clone) into the worktree
  works and costs a minute.


## Cart drawer notes

- **Not a page — an overlay, plus the state behind it.** `lib/cart.tsx` holds an
  in-memory `CartProvider` (lines, count, subtotal, open/close) mounted in
  `app/layout.tsx`; `components/cart/cart-drawer.tsx` is the panel. The header's
  "Bag (n)" button opens it and reads its count from the same context — the
  `bagCount` prop it used to take is gone — and the detail page's **Add To Cart**
  now actually adds the selected colour/size and opens the drawer, which is the
  only way to reach the filled frames. Nothing survives a reload; swap the
  `useState` in `CartProvider` for the real cart service and every consumer
  follows.
- **Built on `radix-ui`'s Dialog**, not a new primitive: `components/ui` has no
  sheet, and Dialog already brings the scrim, focus trap, Escape and scroll lock.
  Radix focuses the close button on open, which is why the frame's bare X renders
  with a focus ring on the first paint.
- **Panel is 500 × viewport, square corners, pure white** — `#ffffff`, not
  `--color-surface-page`. The export's alpha shows a soft ~16px shadow on the
  left and bottom only.
- **This frame is a second block pasted in from another design system.** Four of
  its colours are cool neutrals with no JEMAI counterpart: rules `#dee2e6`,
  primary copy `#202025`, secondary copy `#636366`. They are literal hex
  constants at the top of the component rather than invented tokens — same call
  as the catalogue's Load-more block. The badge, the empty-state CTA border, the
  checkout fill and its 32% disabled tint are all `action-primary`, so those *are*
  tokens. Worth raising with the designer.
- **The measure is 24px** (`--spacing-cart-gutter`, which the style guide already
  publishes): header, rules, totals and the checkout button all run 24 → 475.
  **Item rows are inset 14px further** (image at x=38, "Remove" ending at 461),
  so the list carries `px-[38px]` rather than the gutter.
- **The close X sits 6px inside the measure** where everything else is flush
  (ink 451–464 against a content edge of 475). Reproduced with `mr-1.5` since it
  is only 6px, but it looks like a Figma nudge rather than intent.
- **Type, all pinned by matching ink extents against the exports:**
  - "YOUR CART" is **16px at weight 500** — cap height 12 fixes the size, and ink
    mass fixes the weight (400 renders 9% light, 500 6% heavy; a known-matching
    16/400 run calibrates the two rasterisers to within 1%). No `--text-*` token
    carries 16/500.
  - "Your bag is empty" is `text-body` — 118px of ink at x191–308, identical.
  - Item title is Classico ~17px; the frame is 126 wide by 14 tall and no single
    size satisfies both (17px lands 123 × 15). Left at 17px with the top edge
    exact — the residual is 3px of tracking the export does not explain.
  - "Color: …", the line price and the consent line are `text-body-sm`; the taxes
    line is `text-body-xs` (209px of ink, exact); "Sub Total:" is 16px Classico;
    the subtotal figure is 17px semibold (87px, exact).
  - "CHECKOUT" is 14px semibold at **0.04em**, not the eyebrow token's 0.08em —
    cap height 10 fixes the size, ink width 70 the tracking.
- **The quantity stepper is 75 × 29 with a 2px radius and three equal cells.**
  The frame draws the minus at a much lighter value than the plus: it is the
  disabled state at quantity 1, so the build disables decrement there.
- **Two links the frame draws are not wired**, because the pages do not exist:
  "View Cart" is **removed outright** (asked for during the build), and "terms
  and conditions" keeps its drawn treatment as plain text rather than a dead
  link. Point both at real routes when they exist. Removing View Cart shortens
  the footer, so its top rule sits ~44px lower than the frame's while every gap
  *within* the footer matches exactly (+23 / +57 / +89 / +131 from the rule).
- **The frame's line item cannot be reproduced from the catalogue data.** It
  draws Palma in "Brown", which is not in Palma's colourway (Cream/Tan/Amber/
  Olive), so parity was checked against a Tan line — same geometry, different
  string.
- **Responsive.** The panel is `w-full max-w-[500px]`, so it is full-bleed below
  500px and the drawer geometry is otherwise viewport-independent; the item list
  scrolls when the lines outgrow the panel. Checked at 1440, 768, 500 and 390.


## About page notes

- **Built from `get_metadata` alone.** The Figma Starter quota (20 calls/month)
  ran out one call into this session, so there is no screenshot, no
  `get_design_context` and no `get_variable_defs` behind this page — only the
  XML geometry dump, which gives every frame's x/y/w/h and every text node's
  string and box. That turns out to carry most of the layout, but it carries
  **no colour and no font information at all**, so everything below that names a
  colour or a typeface is inference. Re-verify against a frame export before
  treating this page as done.

- **What the geometry did pin, and how.** A text node's box height is
  lines × line-height, and its width is the ink advance, so sizes can be solved
  by matching a rendered run against the frame's box:
  - Page H1 is **48px Classico Regular on a 56px line** — the frame's box is
    550 × 112 and the render is 550 × 112 exactly. Same treatment as the
    Furniture catalogue H1, and the opposite of Furniture Details, which is
    Bold at 28.
  - The values panel h2 is `text-h2` (40/46): the frame's box is 568 × 92, i.e.
    two lines at 46. **`section-intro.tsx`'s heading class string carries
    `leading-tight`, which resolves 40px to a 50px line** and rendered 100 here;
    the class was copied, so the `leading-tight` had to come back out. Worth
    checking whether the home sections want the same removal.
  - The value kickers ("01 / CONSIDERED") are **15px semibold at 0.08em on a
    28px line** — `text-label`'s size, not either eyebrow token. The three runs
    measure 130 / 122 / 126 in the frame and 127 / 122 / 123 rendered; 14px
    comes out ~9% short and 16px ~5% long.
  - The discipline rows are **18px Classico on a 28px line**. Design / Furniture
    / Art / Exhibitions measure 51 / 69 / 22 / 83 in the frame and 53 / 67 / 23
    / 84 rendered — within 2px on all four, which is what fixes both the size
    and the serif face.

- **`182:11208` is "A Note From Our Founder"** — a 1440 × 565 full-bleed band
  between the mosaic and the disciplines. The metadata dump exposes no children
  for it, so it was initially left out; it was built from a PNG export dropped
  into `design-reference/1.png`. Being the one block with an export, it is also
  the one block that is measured rather than inferred:
  - The scrim panel is x 64 → 742 (678 wide), top y=64, flush to the bottom of
    the band, with 48px of padding — so the copy measure is 582px. Ink starts at
    112/113 against a panel edge of 64, and the longest line ends at 690 against
    a content edge of 694.
  - The panel fill is **`surface-inverse` at 87%**. Un-scrimming the region with
    those two values recovers the photograph underneath cleanly, which is what
    fixes both the colour and the alpha — a flat-alpha guess against a single
    boundary crossing does not, because the photo changes across the edge.
  - Heading is `text-h2` — Classico **Bold** at 40 measures 418.3 against the
    frame's 418, where Regular measures 452. Body is `text-body` (573/542
    against 572/540, on the 24px pitch the bands read off directly). Signature
    is `text-label` (107.4 against 108).
  - Copy is `text-inverse` (peak pixel 247,245,243 = #f7f5f3). The signature is
    the same ink at **~72%** — solving its 182,177,177 peak against the panel
    gives 0.716 / 0.717 / 0.723 across the three channels, consistent enough to
    be real transparency rather than a second colour.
  - **The photograph is a stand-in.** The frame's own image exists in the export
    only underneath the scrim *and the baked text*, and the text crosses a
    brightly lit painting, so un-scrimming leaves a smear that cannot be
    inpainted cleanly. `art-gallery.jpg` stands in; the band reads lighter than
    the frame because that photo is brighter than the frame's, not because the
    scrim is wrong. Swap in the real export when it lands.

- **This page runs a 64px section gap, not the shell's 80px editorial gap.**
  Every seam in the frame — between all six blocks, and into the Newsletter — is
  64. The page therefore returns **one wrapper** with `gap-16` rather than
  sibling sections, so the internal rhythm stays at 64 and the shell's 80 is
  spent once, on the seam into the Newsletter. That one seam is 16px looser than
  the frame, which is most of the page's 4px total drift once the prose block's
  short wrap (below) is netted off it.

- **Outside the founder note, colours are inferred from the site's own language,
  not measured.** The hero's
  copy half and the two mosaic copy panels are `surface-subtle`, on the
  precedent of the consultation panel, which is the same shape of block. The
  value-row rules are `border-border-default`. If a frame export ever lands,
  these are the first things to check.

- **The frame's own photography is a single placeholder.** All six image nodes
  reference the same `4vMrbP9mgswGaZpXigc0L7nbBQ.jpg`, so the design has no real
  photography here either. Existing `public/figma/home` shots stand in; asset
  download needs the MCP anyway.

- **One paragraph wraps a line short.** The first paragraph of the "Who We Are"
  measure is a 800 × 84 box — three lines on a 28px line, which is
  `text-body-lg`'s line-height exactly. At 18px the string's advance is 1505px,
  so it takes two lines in an 800px measure, not three; forcing three would need
  ~20px, which matches no token and no line-height. `text-body-lg` is kept and
  the block renders 272 against the frame's 300. Most likely a Figma wrap
  artifact, but an export would settle it.

- **The hidden "Who We Are" and "Our Values" labels.** Both are `hidden="true"`
  in the frame, so neither is drawn. "Who We Are" is carried as an `sr-only`
  heading so the section is still labelled; "Our Values" is not, since the
  panel's own h2 already labels it.

- **The disciplines accordion is the `/about#design` target** the footer already
  links to, so each row carries its `id` and `scroll-mt-24`. The frame draws
  Furniture open and gives copy for that row only — the other three bodies are
  written, the same call `ProductSections` made. The frame also draws no rule
  between rows; the hairline is borrowed from `ProductSections` because four
  bare labels read as one block.

- **Nav.** About and Contact are gone from the desktop bar and kept in the
  mobile menu, via a `mobileOnly` flag on the nav item and a `desktopNavItems`
  filter. The desktop `<nav>` keeps its `lg:w-[608.5px]` measure so the wordmark
  stays where every other frame draws it. Both pages are already linked from the
  footer's Company column.

- **Verified at 1440 / 768 / 390**, and checked for horizontal overflow at 390,
  1024, 1050 and 1920. The mosaic's middle row keeps its pair from `sm:` up; the
  two rows with a copy panel need the full measure and stack until `lg:`.


## Contact page notes

- **The only page built purely from exports.** No metadata, no design context —
  `design-reference/Container.png` (1440 × 1323) plus the three shell frames.
  The export is **transparent**, which makes it the easiest one to measure yet:
  the alpha channel is a perfect content mask, so text bands, rules and boxes
  all fall out of a threshold pass with no photograph to fight.

- **Two grids, both `fr` tracks that sum to the 1312 inner measure.** The
  contact/form row is `384fr` / 196px gutter / `732fr`; the map row is `380fr` /
  `932fr` with no gutter. Both resolve to exactly 1px per `fr` at 1440.

- **The form's rhythm is a 92px rule pitch** (y=90, 182, 274, 366): 34px of
  lead, a 14px eyebrow label, 6px, then a 37px control closing on the rule.
  That lands the label ink at 127 against the frame's 127 and the input ink at
  159 against 159. The rules are per column, not full width — 354px each with a
  24px gutter — which the export shows directly.

- **The form column is offset 53px from the top of its row.** The frame aligns
  the "01 · THE BRIEF" eyebrow with the *H1's ink*, not with the breadcrumb
  above it, so the two columns do not share a top edge.

- **Type, all pinned by ink extents:**
  - Every uppercase label on the page is `text-eyebrow` (10px semibold, 0.08em).
    Twelve separate runs were checked and all twelve land within 3px — including
    "COMPANY OR AGENCY (OPTIONAL)" at 167 against 166.
  - The page H1 is `text-h2` — **40px Classico Bold**, 337 against the frame's
    335, where Regular measures 359. Not a larger display size.
  - "Where to find us" is `text-h3` — 28px Bold, 188.3 against 188.
  - The intro copy, the directory rows and the input text are all `text-body-sm`
    (14/20); "875 Washington St, New York, NY 10014" measures 225 against 225.
  - **The message placeholder is `text-body` (16px) while the input placeholders
    are 14px** — the one place the form changes size. Its run measures 455
    against 450, where 14px gives 398.
  - "Murray Hill" and "Lagos" are `text-body-lg` (18px): 80.5 / 43.6 against
    79 / 42, where 16px gives 71.5 / 38.8.
  - The disclaimer is `text-body-xs` (12px): 667 against 666.

- **Two runs needed a narrower measure than their column**, both because the
  frame breaks them a word early: the intro copy is `max-w-80` (320px, not the
  column's 384) or "day." rides up onto line two; the disclaimer is `max-w-172`
  (688px, not 732) or "jemai.co." does the same. Both were caught by comparing
  the *widest rendered line* against the frame's, not the block height.

- **Three different rule weights, and only one is a token.** The form rules
  measure `#16050729` — `border-default` exactly. The textarea rule and the
  Get Directions underline measure black at 15%, which composites within a level
  of the same token, so they use it too. **The directory rules are black at
  10%**, which composites 11 levels lighter than any published border token, so
  they are literal `border-black/10` with a comment — the same call the
  catalogue's Load-more block and the cart drawer made.

- **The placeholder ink is `text-primary/25`**, solved from a peak alpha of 64
  on the transparent export. Note this is *not* the checkout flow's `#808080`
  placeholder — a third contact-form treatment in the file.

- **The map panel is live Leaflet**, via `react-leaflet` on OpenStreetMap tiles
  (`components/contact/{location-map,leaflet-map}.tsx`). It lands on the frame's
  own geometry — 444, 842 at 932 × 480 — so the block still measures 1322
  against the frame's 1323. Zoom controls sit top-left, which is where the frame
  draws them too.
- **Two files, and the split is load-bearing.** Leaflet touches `window` at
  module scope, so the map is loaded with `ssr: false`; that option is only
  legal inside a Client Component, and marking the *page* client breaks
  `export const metadata` outright (Next 500s on it). So `location-map.tsx` is a
  thin client wrapper that dynamic-imports `leaflet-map.tsx`, and the page stays
  a Server Component.
- **The marker is a `divIcon`, not Leaflet's default.** The default marker
  resolves its icon from relative image paths that bundlers break; a `divIcon`
  sidesteps that and lets the pin carry `action-primary` instead of shipping a
  PNG.
- **`overflow-hidden` on the map wrapper is required**, not cosmetic — Leaflet
  always paints tiles past the edge of its pane, and without the clip they widen
  the page on mobile. The wrapper also carries a `min-h-65` floor, since
  932/480 leaves the map only 184px tall at 390 and the frame has no mobile
  layout to follow.
- **`scrollWheelZoom` is off.** A full-width map that swallows page scroll is
  hostile; zoom stays on the controls and double-click.
- **One constant holds the location.** `LOCATION` in `leaflet-map.tsx` centres
  on Lagos Island — the extent the frame draws, and the city the block's own
  "City" label names. The design's address data contradicts itself (New York
  under "Visit", Murray Hill under "Neighborhood", Lagos under "City", Abuja in
  the footer), so pointing this at the real address is a one-line change.

- **The frame's own address data contradicts itself.** It draws a New York
  street address under "Visit", "Lagos" under "City", and the footer carries an
  Abuja address. Transcribed as drawn rather than reconciled; worth raising with
  the designer.

- **Written, not transcribed:** the inquiry-type options beyond "Book a Space"
  (the frame draws the closed select only), and the submitted state. There is no
  endpoint, so the form acknowledges in place via `react-hook-form` — the same
  library the checkout flow already uses — and `onSubmit` is the seam to point
  at a real handler.

- **`Field` is declared at module scope on purpose.** Inside the form component
  it remounts on every render and drops focus mid-keystroke.


## Consultation page notes

- **Three exports, three different measures.** Nothing on this page shares a
  container: the opening header is 1080 centred (180 either side), its
  photographic rail runs 16 → 1424, the inquiry form is 640 centred, and the FAQ
  is 860 centred. All four fall out of a 16px section padding plus a per-block
  `mx-auto max-w-*`, so none of them needs the page gutter.

- **The heading is 50px Classico Bold on a 56px line, which is not a token.**
  Its two lines measure 365.4 / 465.6 against the frame's 365 / 469. This one
  only fell out with **canvas ink extents** (`actualBoundingBoxLeft/Right`)
  rather than advance widths: on advances, 48px Regular looked right for line
  two (471.7 against 469) but was 17px wide on line one, and no single size fit
  both. Ink extents put line one at 365.4 and settled it. Worth reaching for
  when advance widths give contradictory sizes across two runs of the same
  heading.

- **The frame really does draw a double space in "Purpose, &  Personality".**
  With it the run measures 465.6 against 469; without it, ~453. Reproduced with
  a non-breaking space rather than tidied away, since the measurement is
  unambiguous — but it reads like a typo in the file, so drop the `\u00a0` if it
  is.

- **Two eyebrow sizes on one page.** The header kicker and the four rail
  captions are `text-eyebrow-lg` (12px) — "ARCHITECTURE & INTERIORS" measures
  169.9 against 169 there, and 141.6 at 10px. Everything in the form and the FAQ
  is `text-eyebrow` (10px), checked across seven separate runs. Don't assume one
  eyebrow size per page.

- **The rail photography is already in the repo.** `sp-lanier`, `sp-soho`,
  `sp-bathhouse`, `sp-woods` are the exact four frames drawn, in order — the
  `sp-` set turns out to be this rail's project photography. No stand-ins.

- **The form reuses the Contact field recipe on a tighter lead**: 26px rather
  than 34, then the same 14px eyebrow label, 6px, and a 37px control closing on
  the rule. That gives the frame's 84px rule pitch exactly.

- **The date row is 88px where every other row is 84.** Reproduced with `pb-1`
  on the field rather than a taller control — `h-[41px]` was tried first and
  silently did nothing, because Tailwind had not generated that arbitrary
  utility yet even though the class was on the element. **If an arbitrary value
  appears in the class list but the computed style ignores it, suspect a missing
  generated utility before suspecting the cascade** — and prefer a standard
  utility where one exists.

- **`SelectTrigger` needs its height overridden through its own variant.** The
  primitive carries `data-[size=default]:h-8`, which a plain `h-[37px]` in
  `cn()` does not displace — tailwind-merge treats them as different keys and
  the variant wins on specificity. The budget row came out 5px short until the
  override was written as `data-[size=default]:h-[37px]`.

- **The date fields swap type on focus.** The frame draws "Select date" with a
  calendar glyph, and a native date input has no placeholder, so the control
  starts as `text` and becomes `date` on focus; the browser's own indicator is
  made transparent and stretched over the drawn glyph so that is what you click.
  `register`'s `onBlur` has to be composed rather than replaced, or RHF stops
  seeing the field.

- **Ground and rules are tokens.** The form band is `surface-subtle` (#ece5e2,
  sampled exactly) and every rule on the page solves to `border-default` against
  its own ground — 41/255 over the tint, the same over the page ground.

- **Written, not transcribed:** all three FAQ answers (the frame draws every row
  collapsed), the open/minus state of the toggle, the project-type list beyond
  "Interior Decor", every budget range, and the submitted state. As with
  Contact, there is no endpoint — `onSubmit` is the seam.


## Artworks page notes

- **~1087px of this page has no export.** Nav (119) + hero (702) + catalogue
  (3096) + CTA (500) + Newsletter (358) + Footer (514) plus five 64px seams
  comes to 5609 against the frame's 6696. Two candidates for the gap, and the
  export cannot distinguish them: `Frame 385` **clips its own carousel** (the
  photograph runs to the export's bottom edge at y=702, so the band's true
  height is unknown), and there may be a whole section between the hero and the
  catalogue that was not exported at all. The build holds the carousel at the
  1440 × 500 the export does show. Re-export the hero node unclipped and check
  whether a block is missing between it and the catalogue.

- **The photographs are recovered, not stood in.** All fifteen catalogue works
  sit unobstructed in the export at 383 × 339, and the curator's pick at
  720 × 537, so they were cropped straight out to `public/figma/artworks/`
  (684 KB for seventeen images). Only the hero carousel's second and third
  slides and the CTA photograph are stand-ins.

- **The hero is the consultation header, again.** Same 1080px centred measure,
  same eyebrow at x=180, same 50px Classico Bold on a 56px line, same copy
  column at x=753 — its first line measures 475.3 against the frame's 475. The
  carousel below it is full-bleed with arrows inset 90px and three dashes.

- **Three different measures on one page, none of them the page gutter.** The
  hero header is 1080 centred; the curator's rule runs the gutter's 1312
  (x 64 → 1375); the card grid sits on its own 1183 (x 128 → 1310), narrower
  than the rule directly above it. As drawn.

- **The seam inside the catalogue block is 80px, not 64.** Every other seam on
  this page — and on About, Contact and Consultation — is 64. Here the frame
  puts its rule at y=600 and the first card at 681.

- **The curator's photo does not fill its track.** The frame runs it 592 → 1311
  and leaves the last 65px of the measure empty, so the image is capped at
  `max-w-[720px]` inside a wider column rather than stretched.

- **The exhibition CTA's copy deliberately breaks out of its scrim**, and that
  is the one thing about this block worth knowing. The scrim runs x 64 → 404,
  but the heading's first line ends at 496 and the body copy at 588 — the type
  sits straight on the photograph past the panel's edge. Building it the obvious
  way, with the copy nested inside the panel, wraps the heading onto three lines
  and can never match. Scrim and copy are two separate absolutely-positioned
  boxes.
  - Its heading is `text-h2` — 40px Classico Bold, 391.1 / 235.5 against
    391 / 233, on the frame's own 46px pitch. Copy is `text-body` (486 against
    485), eyebrow `text-eyebrow-lg` (183 against 181), button 148 × 48 at y=348.
  - The scrim's alpha is **approximate**: its right edge crosses a framed work,
    so the photo changes as you cross it and it will not solve the way the
    founder note's did. Sampling either side puts it in the same 85–88% band, so
    it takes the founder note's value.

- **The pager block is now shared.** `components/shared/load-more-pager.tsx` —
  the "1-n of m" count, its 160px bar and the charcoal Load more button — is
  drawn identically here and on the furniture catalogue, so it was lifted out of
  `catalogue.tsx` and both pages use it. The three off-palette colours travel
  with it.

- **The frame's card data is placeholder, and its own numbers disagree.** All
  fifteen cards read "Of Mind and Myth · Mixed media on canvas · 2 ft × 3 ft",
  while the pager reads "1-12 of 16 pieces" against a grid of fifteen — the same
  shape of contradiction the furniture catalogue has. The build keeps the
  dominant visual (the fifteen cards as drawn) and derives the pager from data:
  the fifteen run twice, so the first page is exactly the frame's grid and
  "Load more" still has somewhere to go. Drop the repeat with the real
  catalogue.

- **Two more arbitrary-value misses.** `pb-[65px]` and (earlier, on
  consultation) `h-[41px]` sat in the class list with no generated utility
  behind them, so the computed style ignored them silently. Same lesson: when an
  arbitrary value appears on the element but does nothing, suspect the generated
  CSS before the cascade, and prefer a standard utility where one exists.

- **Lazy images make full-page screenshots lie.** The CTA photograph read as
  missing in three successive captures — `complete: false`, `naturalWidth: 0` —
  purely because `loading="lazy"` had not fired for a band that far down. The
  optimizer was serving it in 100ms the whole time. Screenshot the element, or
  scroll first, before concluding an image is broken.


## Artwork details notes

- **Two exports, no Figma.** The MCP quota was gone before the first call
  landed, so this page is `design-reference/Artwork Content.png` (1440 × 2017,
  transparent) and `design-reference/modal wrapper.png` (1440 × 3198) measured
  with `sharp`, nothing else. Both are transparent, which makes the alpha
  channel the content mask — the same break the Contact page got.

- **~1495px of the 3512 frame has no export.** The content block (2017) plus
  Nav (119), Newsletter (358) and Footer (514) comes to 3008, and four 64px
  seams only bring that to 3264. The content export is *not* clipped — its last
  gallery row closes 1px above the bottom edge — so the missing height is a
  block that was never exported, most likely a related-works or exhibition band
  between the gallery and the newsletter. Re-export the frame's remaining
  children before treating the page as complete.

- **Every type token on this page fell out of ink extents, and two runs share
  one token.** The artist name and the lead paragraph are both `text-h4`
  (22px/600 on a 28px line): the name measures 191 against the frame's 192, and
  the lead's three lines measure 757/786/363 against 757/787/364 on an 800px
  measure. Nothing else came close — 20px semibold, the obvious first guess,
  renders the third line 146px short.
  - Body copy is `text-body-lg` (18/400), which reproduces the frame's wrap
    *exactly*: 778/772/512 against 779/772/512. It is `text-primary`, not
    secondary — the export's darkest pixel is alpha 239, where `text-secondary`
    would peak at 173. It only reads lighter than the lead because of weight.
  - The H1 is 50px Classico **Bold** set in caps (507 against 505), the same
    display size the consultation and artworks headers use.
  - The breadcrumb is `text-body-xs` and its middle crumb reads **"Art"**, not
    the catalogue's "Artworks".

- **The work is matted, not full-bleed.** A 900 × 730 `surface-tint` panel with
  24px of margin around an 852 × 682 photograph, centred on the page rather than
  on any of the site's measures. Copy and the Enquire button sit on their own
  800px measure below it (x 320 → 1120), left-aligned under the mat.

- **This page's rule is the odd one out.** Every section rule on the site is 3px
  of `border-strong`; this one is **2px of `border-default`**. The export settles
  it: rows 1281/1282/1283 carry alpha 16/41/26, which is a 2px stroke of 0x29
  landing on a fractional y, not a 1px one.

- **The gallery grid runs two different gutters** — 16px between columns, 40px
  between rows (`gap-x-4 gap-y-10`), on three 426.67px tracks. Cells are
  `aspect-[427/327]`. The frame repeats one photograph in the first and last
  cell; reproduced as drawn.

- **`bg-clip-padding` on the button variants eats 2px of fill.** The Enquire
  button is 148 × 48 in the frame and rendered 146 × 46, because the shadcn base
  carries `border border-transparent` *and* `bg-clip-padding`, so the background
  stops at the padding box. `border-0` on the instance restores the full fill.
  Worth knowing for every other CTA measured against a frame.

- **The photographs are recovered, not stood in.** The hero (852 × 682) and all
  six gallery cells were cropped straight out of the export into
  `public/figma/artworks/detail/`.

## Enquire modal notes

- **1124 × 715, and it lands on the frame exactly** — a 423px photograph on the
  left with its caption block inset 32px, and a 702px `surface-page` panel on the
  right padded 48px. Same shape as the checkout modal at a different measure, and
  built on the same `ui/dialog`, whose `bg-black/64` scrim is already this
  frame's value.

- **The field recipe is Contact's on a 9px shorter lead** — 25px of lead, a 14px
  eyebrow label, 6px, then a 37px control closing on a `border-default` rule —
  which gives the frame's 84px rule pitch. The email/phone row is two 290px
  columns on a 24px gutter, i.e. the 604px content measure split.

- **Type: heading is `text-h3`** (28px Classico Bold — 305 against 306, where
  Regular measures 324), subcopy and the locked artwork value are `text-body-sm`,
  the help line is `text-body-xs`, the message placeholder is `text-body` (401
  against 401), and both buttons are `text-label` at `px-6` (133 wide against
  133). The caption line over the photograph is `text-body-sm`, not `text-body`.

- **`md:text-sm` on the Textarea primitive beat `text-body`.** tailwind-merge
  treats a responsive variant as a different class group, so an unprefixed
  `text-body` never displaces it and the placeholder rendered at 14px (351 of ink
  against the frame's 401). The fix is to pass `md:text-body` alongside it. The
  Input primitive hides the same bug — its `md:text-sm` happens to equal the
  `text-body-sm` the fields want.

- **Focus is moved off the close button.** Radix autofocuses it, which paints a
  focus ring the frame does not draw; `onOpenAutoFocus` sends focus to the first
  field instead — closer to the frame and better to use.

- **The frame and its page disagree about the artist.** The page reads
  "Marcellina Akpojotor" and the modal's caption reads "Amina Bako". The modal
  takes whatever piece it is opened on, so the page's name wins. Worth raising
  with the designer.

- **Written, not transcribed:** the sent state (there is no endpoint —
  `onSubmit` is the seam, as on Contact and Consultation) and the mobile layout,
  where the photograph pane drops and the form stacks to one column.


## Exhibitions notes (all four pages)

- **Four exports, no Figma.** The MCP quota is still spent, so all four pages
  and all three modals were measured out of the seven transparent PNGs in
  `design-reference/`. `Past Exhibition Details.png` and
  `Upcoming Exhibition Details.png` are whole-page exports including the nav,
  newsletter and footer; the two index exports include the nav.

- **The site header is 13px shorter than the frames' Nav.** Every export puts
  its closing 3px rule at y=115; ours renders it at y=102. That offset is
  pre-existing — it predates this work and shifts *every* page — so the
  exhibition pages were matched to their frames **relative to that rule**, and
  every measurement in this section is quoted against `frame − 13`. Worth
  fixing in `site-header.tsx` once, rather than per page; it would bring every
  page on the site onto its frame's absolute grid at the same time.

- **The type scale on these frames is the site's, with two exceptions.** Every
  size fell out of ink extents:
  - Index tabs, the detail status word and the detail date line are
    `text-body-lg` (161/115 against 160/115; 75 against 76; 156 against 157).
  - Card titles and the detail page's artist eyebrow are `text-h4` — 22px/600
    (155 against 156; 170 against 170; the artist run 117 against 117).
  - The "UP NEXT" kicker is `text-eyebrow-lg`, not `text-eyebrow` (48 against 49
    — 10px measures 40).
  - Detail titles are 50px Classico Bold (583 against 583, exact); the UP NEXT
    heading is `text-h2` (466 against 468); "About the Artist" is `text-h3`
    (186 against 186).
  - **The one size with no token is the card's second line** — 14px uppercase on
    the eyebrow's 0.08em tracking. `text-eyebrow-lg` is 12px and measures 12%
    short; 14px lands within 1px on both strings ("AMINA BAKO" 83 against 83,
    "18 JULY–8 AUGUST 2026" 159 against 158). Written as `text-body-sm` plus
    `tracking-[0.08em]`. Worth adding as a token if it recurs.
  - The detail lead/body are the artwork detail page's `text-h4` over
    `text-body-lg` on the same 800px measure, and reproduce the frame's wrap
    exactly.

- **The copy measure is 799px, not 800.** At 800 the lead and the first body
  paragraph match the frame but the second body paragraph pulls "us" up onto the
  previous line (800/415 against the frame's 779/434). 799 satisfies all three.
  A one-pixel measure looks arbitrary and is: it is the width the frame's own
  text box works out to.

- **An intrinsic image can beat `aspect-ratio`.** The exhibition cards render a
  work of its own aspect on a 411 × 341 mat. Built with `<Image width height>`
  inside `aspect-[411/341]`, a photograph taller than the box **wins** — the
  aspect box grows and cards in the same row come out different heights (434 vs
  374 at 768). Switching the mat to `relative` + a `fill` image with
  `object-contain p-2` fixes it: both cards render 411 × 433 against the frame's
  434. Same trap as the arbitrary-utility one — the class was right, the box
  just was not constrained.

- **The two index pages share everything above the listing**: a 3px nav rule, a
  full-bleed 1440 × 501 carousel (40px arrows inset 90/88, three 44 × 4 dashes
  39px off the foot), then a tab row with full-bleed 2px `border-default` rules
  49px apart. `ExhibitionHero`, `ExhibitionTabs` and `ExhibitionCard` are shared;
  so are `ExhibitionIntro` and `ArtistNote` across the two detail pages, which
  are byte-identical down to the body copy.

- **Two blocks break the page gutter, in opposite directions.** The UP NEXT row
  starts 40px *inside* the gutter (x=104) and closes flush on it; the artist note
  starts on the gutter and stops 92px short of it (576 + 81 + 563 = 1220 against
  the 1312 measure). Both are `fr`-free fixed compositions — a `max-w-[1220px]`
  block for the note, an `lg:pl-10` for the row — rather than second measures.

- **The past-detail works rail is not a grid of equal cells.** Four 300px columns
  on a 24px gutter, each image at its own natural height (538 / 192 / 386 / 537),
  so the row is top-aligned and every caption and button hangs off its own image.
  Modelled with intrinsic `<Image>` sizes rather than an aspect box.

- **`bg-clip-padding` bites again.** The works rail's "View Artwork" outline
  button is 43px in the frame; `h-11` rendered 46 because the border adds to the
  box. `h-[41px]` plus the 1px border lands on 43.

### Modals

- **The register modal has two geometries, and they are not variants of one
  box.** Free is 1120 × 579 with a 544px photograph and a 576px panel — the
  checkout modal's split. Paid is 1120 × 710 with a 419px photograph and a 701px
  panel — the enquire modal's. Both pad 48px and share the field rhythm, which is
  now `components/site/modal-field.tsx` (25px lead, 14px eyebrow label, 6px, a
  37px control on a `border-default` rule = the frames' 84px pitch). Both land
  within 2px of their frames on every band, including the button pair widths
  (292 free, 333 paid).

- **The ticket summary is the only new block.** `surface-subtle`, 604 × 142, a
  `TICKET SUMMARY` eyebrow in `action-primary`, then three rows on a 12px pitch
  with a semibold total. Its internal rhythm was solved from the frame's four ink
  bands rather than guessed — the obvious `pt-4.5 / mt-4.5 / pb-5` reading came
  out 8px tall.

- **The design contradicts itself about which events are paid.** The index frame
  draws its modal free for the 12 September event; the detail frames draw the
  *same* exhibition ("The Land Knows Our Names · 15 Aug 2026") both free and
  paid. `ticket` on the exhibition record is what switches the modal, and it is
  set on that exhibition — so the index's Register button opens the paid modal
  where its frame draws the free one. The free geometry is still reproduced
  exactly, from the other two upcoming exhibitions' detail pages. Worth asking
  the designer which events are ticketed.

- Focus is moved off the close button on open, as on the enquire modal, and both
  modals acknowledge in place — there is no endpoint, and `onSubmit` is the seam.

### Content the frames get wrong, and what was done about it

- **The past-detail frame draws its narrative block twice, verbatim** — the same
  nine lines above and below the featured work. Reproduced as drawn so the page
  matches its frame, but carried as two fields (`bodyBefore` / `bodyAfter`) in
  `lib/exhibitions.ts` so replacing the duplicate is a one-line edit. **This is
  the first thing to fix with real copy.**
- **The past-detail frame's artist note is a David Lynch biography**, pasted in
  from another file, on a page about a Nigerian painter. The design's own Amina
  Bako copy — which the upcoming-detail frame carries — is used on both pages
  instead. This is the one deliberate departure from the frames, and it is why
  the past detail's artist-note band is 865 against 863 rather than exact.
- The past index repeats "Queit Witnesses" in cards 6 and 9, with the same run of
  dates, and misspells "Quiet" in both. Transcribed as drawn.
- Every exhibition on every frame is by the same artist and most share the same
  body copy; the whole `lib/exhibitions.ts` content layer is placeholder.

- **The seam into the Newsletter does not agree between frames.** The two index
  frames want ~12px more than the shell's 80px editorial gap (added as a `pb-3`
  on each page); the two detail frames want ~19px *less*, which a fixed gap
  cannot give without a negative margin, so they are left 19px loose. Every other
  landmark on those pages is within 1px, so this is the only place either detail
  page departs from its frame by more than 3px.
