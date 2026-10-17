# 07 — Motion & premium pass (all six sites)

The user wants every site to feel like a top-tier agency site: buttery scrolling, page colour that
flows between sections, text that reveals and fills as you scroll, images that breathe, and
interactions with soft, confident easing. **No intro/preloader animations. Keep each site's own
fonts, palette and layout** (the first-build look the user approved) — this is a motion and polish
pass, not a redesign.

## What makes the reference feel premium (studied in a real browser)
1. **Smooth scroll** — the page glides ~1s behind the wheel (scroll smoother, "smooth: 1").
2. **Page colour transitions** — when a section reaches the middle of the screen, the *whole page*
   background tweens (≈0.6–0.8s) to that section's colour (e.g. #ebebeb → #191919 and back). There
   are no hard section edges; header/cursor switch light/dark with it.
3. **Scroll-filled statement** — a large paragraph starts dim (≈20% opacity) and lights up word by
   word as you scroll through it.
4. **Media expansion** — a framed media block grows from an inset, rounded frame to full width as
   you scroll.
5. **Masked text reveals** — headings rise line by line from behind a mask; small labels fade up.
6. **Parallax images** — photos drift slightly inside their frames.
7. **Restraint** — long, soft easings (expo/power3 out), generous whitespace, hairline dividers,
   underlined text links with arrows, hover states that move a few px, never bounce.

## Shared system (already built — use it, don't re-implement)
- Smooth scrolling (Lenis) is global and synced with ScrollTrigger. `html.lenis` forces
  `scroll-behavior: auto`, so remove any per-site inline `scroll-behavior` overrides.
- `import { useMotion, scrollToTarget, pauseScroll, resumeScroll, getLenis } from '../../shared/motion/index.js'`
- Call `useMotion(rootRef)` once in the page component (root = the element with your site class).
- Attributes (see header comment in `src/shared/motion/useMotion.js`):
  - `data-reveal="lines|words|chars|fade|stagger|clip"` (+ `data-reveal-delay`, `data-reveal-stagger`, `data-reveal-start`)
  - `data-fill` (+ `data-fill-from`, `data-fill-start`, `data-fill-end`) — scrubbed word fill
  - `data-parallax="0.12"` on an `<img>` inside an `overflow:hidden` frame
  - `data-expand="10% 16%"` (+ `data-expand-radius`, `-start`, `-end`) — inset → full-bleed clip
  - `data-magnetic="0.3"` on primary CTAs
  - `data-bg="#hex"` (or bare `data-bg` to use the section's own background) — page re-tint while
    the section is centred. The section becomes transparent; the site root, body and html tween to
    the colour. The root gets `data-scroll-theme="dark|light"` → style navs/headers with
    `.xx[data-scroll-theme='dark'] .xx-nav { … }`. Sections next to a data-bg section should be
    transparent (show the root colour) so the transition is seamless — no hard edges.
  - `data-velocity` — skew with scroll velocity (marquees/strips)
  - `data-cursor="View"` — a pill label follows the pointer over that element. Set
    `--cursor-bg` / `--cursor-fg` on your root to theme it.
- In-page links: plain `<a href="#id">` is handled globally. Replace any custom
  `window.scrollTo({behavior:'smooth'})` / `scrollIntoView` handlers with `scrollToTarget(el | '#id')`.
- Modals/drawers/menus: use the shared `useScrollLock` (it pauses Lenis) or call
  `pauseScroll()` / `resumeScroll()`. Inner scroll areas scroll natively (`allowNestedScroll`);
  if one doesn't, add `data-lenis-prevent` to it.
- QA: `node scripts/qa/motion-check.mjs /<route> <outDir>` reports whether smooth scroll is active,
  the glide curve, every page-colour/theme change while wheel-scrolling, frames and console errors.

## What every site must get
1. Smooth scroll working with all existing interactions (anchors, modals, inner scrollers, pinned bits).
2. **At least one seamless page-colour transition** (two is better) using colours already in the
   site's palette — typically into the site's darkest tone for a "dark interlude" section and back.
   Nav/header must stay legible during it.
3. **One scroll-filled statement** (`data-fill`): a large editorial sentence in the site's voice —
   reuse an existing big paragraph or add one short original statement in a fitting place.
4. Masked line reveals on section headings; staggered fades for card groups. Don't double-animate:
   remove or replace older entrance tweens on the same elements.
5. Parallax on photography inside frames; one `data-expand` moment where a large media block exists.
6. Magnetic primary CTAs; `data-cursor` labels on clickable cards/rows ("View", "Open", "Read", "Play").
7. Hover polish: transforms with `cubic-bezier(.22,1,.36,1)` 0.6–0.9s; images scale 1.04–1.06 inside
   frames; underline links that draw in; no instant colour jumps.

## Premium pass (look at every element with a critical eye)
- **Typography:** tighten display tracking, balanced/pretty wrapping (`text-wrap: balance|pretty`),
  no orphans in headings, consistent label styles, tabular numbers for data.
- **Cards & panels:** consistent radii, hairline borders at low alpha, layered soft shadows, real
  hover states, aligned baselines and equal paddings.
- **People photos:** faces cropped well (`crop=faces`), sharp on retina (request 2× size), consistent
  framing and treatment across the page.
- **Colour grading:** photos should feel like one shoot — apply one subtle, consistent grade per
  site (a gentle `filter` or overlay) that suits its palette.
- **Spacing rhythm:** consistent section paddings; let big moments breathe.

## Must keep
- Reduced motion: no smooth scroll, no scrubbed motion, content fully visible; colour transitions
  can still apply instantly.
- All existing interactions and tests pass; no horizontal overflow at 375–1920; console clean.
- Text stays original (originality check must stay at 0 for your folder).
