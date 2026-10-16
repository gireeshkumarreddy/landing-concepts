# Shared brief — rules for all six sites

You are building ONE of six independent landing pages in a Vite + React 19 SPA.
Each site must look like it was art-directed by a senior studio: precise type, deliberate
spacing, restrained colour, purposeful motion, and product UI built from real elements.

## Project facts (already set up — do not change)

- Root: the project folder (has `package.json`, `vite.config.js`, `src/`).
- Router: `src/App.jsx` lazy-loads `src/sites/<slug>/index.jsx` (default export) at `/<slug>`.
- Dev server: already running at `http://localhost:5173` with HMR. Do NOT start another, do NOT run `npm run build`, do NOT `npm install` anything.
- Installed: `react@19`, `react-router-dom@7`, `gsap@3.15` (SplitText, ScrollTrigger included and free), `@gsap/react`, `motion@12` (import from `motion/react`), and these fonts:
  `@fontsource-variable/figtree`, `@fontsource-variable/inter-tight`, `@fontsource/instrument-serif` (import `@fontsource/instrument-serif/400.css` and `/400-italic.css`),
  `@fontsource-variable/outfit`, `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource-variable/archivo` (also `@fontsource-variable/archivo/wdth.css` for the width axis),
  `@fontsource-variable/caveat`, `@fontsource-variable/jetbrains-mono`, `@fontsource-variable/plus-jakarta-sans`, `@fontsource-variable/newsreader`.
  Variable font family names are e.g. `'Figtree Variable'`, `'Inter Tight Variable'`, `'Geist Variable'`, `'Archivo Variable'`; static is `'Instrument Serif'`.
- Shared helpers (import, do not edit):
  - `src/shared/gsap.js` → `{ gsap, ScrollTrigger, SplitText, useGSAP, REDUCED, MOTION_OK, prefersReducedMotion }` (plugins registered).
  - `src/shared/useSiteMeta.js` → `useSiteMeta({ title, description, themeColor, background, site })`. Call it at the top of your page component. `background` must be your page background colour.
  - `src/shared/img.js` → `unsplash(id, { w, h, q, fit, crop })` and `unsplashSrcSet(id, widths, { ratio })`. Ids are the part after `photo-`. Always pass sensible widths, use `srcSet`+`sizes` for big images, `loading="lazy"` + `decoding="async"` below the fold, and explicit `width`/`height` or `aspect-ratio` to avoid layout shift.
  - `src/shared/a11y.js` → `useEscape(active, cb)`, `useFocusTrap(ref, active)`, `useScrollLock(active)`, `isEmail(v)`.
  - `src/shared/base.css` is a minimal global reset (box-sizing, margins, button reset, `html{scroll-behavior:smooth; scroll-padding-top: var(--scroll-pad, 88px)}`, `.sr-only`, `.skip-link`, reduced-motion CSS clamp).

## Hard boundaries

- Write ONLY inside `src/sites/<your-slug>/` (plus optional throwaway test scripts in `scripts/qa/<your-slug>-*.mjs`). Never touch shared files, other sites, `App.jsx`, `package.json`, `index.html`.
- CSS scoping: other sites' CSS is loaded in the same document after navigation. Every selector in your CSS must be scoped under your root class (e.g. `.cr …`) or use your unique class prefix. Never style bare `body`, `html`, `h1`, `a`, `*` globally. Prefix keyframe names and CSS custom properties defined on your root (define tokens on the root class, not `:root`).
- Split the page into sensible components (e.g. `components/Nav.jsx`, `Hero.jsx`, `ProductDemo.jsx`, `Pricing.jsx`, `Footer.jsx`, `data.js`, `icons.jsx`) — no single 2,000-line file. One CSS file per site is fine (or a few), but keep it organised by section with design tokens at the top.

## Originality (highest priority)

The reference screenshots set the **visual design**: layout, composition, proportions, colours,
imagery mood and interaction ideas — match them closely. **Words and brands** must not be copied:
no headline or sentence, no nav or button label, no brand name or logo, no person name, and no
sample data (names, messages, subjects, prices, plan names, feature lists, card titles). Every word
on the page and every logo must be original to this project. When in doubt, rewrite it.

## Content & honesty rules

- No lorem ipsum, no fake testimonials, no fabricated customer logos, no invented press quotes, no unsupported performance claims ("10x faster", "98% accuracy", "10K+ clients"). Product facts (features, pricing of this concept product) are fine. Sample data in mockups must be coherent and clearly sample data.
- No real company logos or trademarks drawn as brand marks. Product names are rendered as clean typographic wordmarks — do NOT invent a logo symbol/icon for the brand.
- Functional UI icons (arrow, plus, mic, send, search, check, close, chevron, menu) are fine: draw them as small inline SVGs with a consistent stroke weight. No emoji anywhere. No decorative random icons, blobs, orbs, sparkles or meaningless floating shapes.
- Every form: real `<label>`s (visible or `.sr-only`), validation on submit + on blur after first submit, clear inline error text tied with `aria-describedby`, `aria-invalid`, a short loading state, and a success state that plainly says it is a demo (e.g. “Saved in this demo only — no email was sent.”). Never claim an account was created or a message was sent.
- Every button/link does something sensible: navigates to a section, opens a working modal/drawer/menu, changes UI state, copies text, etc. No dead controls. Use `<a href="#id">` for in-page navigation, `<button>` for actions.
- Footer of every site must include: a link back to the concept index (`<Link to="/">` from react-router-dom, label like “All concepts”), the line “Concept project for a design portfolio.” (adapt wording), and “Photography: Unsplash” if you use Unsplash images.

## Design quality bar

- Study the reference screenshot first (Read the image). Match hero composition: headline position, line breaks, proportions, nav placement, content width, radii, shadows, button sizes, the balance of whitespace vs imagery. Then extend the same language to the rest of the page.
- Use a real type scale with `clamp()`; tight tracking on large display type, comfortable body line-height (1.5–1.65), max ~68ch line length.
- Use the defined colour tokens consistently. Gradients only where the reference uses them. Ensure WCAG AA contrast for text.
- Avoid generic “AI template” traits: identical 3-column icon grids, gradient blobs, glowing orbs, glassmorphism everywhere, everything in rounded cards with borders. Vary section layouts with intent.
- Product mockups are built from real elements (lists, panels, buttons, charts in SVG) with believable sample data, not images of UI.

## Motion

- GSAP for entrance timelines & scroll-linked effects (`useGSAP(() => {...}, { scope: rootRef })` so everything is reverted on unmount). Motion (`motion/react`) is great for state transitions (`AnimatePresence`, `layout`).
- Wrap GSAP work in `gsap.matchMedia()` with `MOTION_OK` / `REDUCED` so reduced-motion users get static, fully visible content. Content must never stay invisible if JS animation fails — prefer `gsap.from()`/`fromTo` inside `useGSAP` over CSS `opacity:0` defaults, or set initial hidden states only inside the motion-ok branch.
- Restraint: natural easing (`power3.out`, `expo.out`, `cubic-bezier(.2,.7,.2,1)`), 0.5–1.1s entrances, 0.04–0.08s staggers. No bouncing/elastic, no scroll-jacking, no infinite motion that distracts reading (slow ambient drift is fine). Pinned sections only if short and clearly valuable.
- Mouse-parallax / tilt only on pointer: fine devices (`(hover: hover) and (pointer: fine)`), throttled with rAF or `gsap.quickTo`, cleaned up on unmount.
- Don't animate layout properties; use transform/opacity/filter. No layout shift.

## Responsive

- Must work with no horizontal overflow at 375, 390, 768, 1024, 1366, 1440, 1920 widths. Recompose for mobile (stack, simplify, hide purely decorative floating bits, keep the key idea). Mobile nav: a real menu button (`aria-expanded`, `aria-controls`), Escape closes, focus handling, links close the menu.
- Use `min-height: 100svh`-style units carefully; never clip product mockups awkwardly.

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `section` with headings, `footer`), one `h1`, logical heading order, `aria-label`s on icon-only buttons, visible `:focus-visible` styles that fit the design, keyboard operable tabs (`role="tablist"` with arrow keys) / accordions / modals (`role="dialog" aria-modal="true" aria-labelledby`, focus trap, Escape, scroll lock), alt text on meaningful images and `alt=""` on decorative ones. Include a skip link: `<a className="skip-link" href="#main">Skip to content</a>`.

## QA you must do yourself (iterate until it is genuinely good)

A screenshot helper exists: `node scripts/shot.mjs /<slug> <out.png> <width> <height> [--full] [--scroll=px] [--wait=ms] [--reduced]`.
It uses headless Edge against the running dev server, prints `horizontal-overflow=<px>` and any console errors/warnings. Save screenshots to your QA folder (given in your task) and Read them to look at them.

1. After building, screenshot at 1440×900 (viewport and `--full`), 1366×768, 390×844 (`--full`), 768×1024, 1920×1080. Compare the 1440 hero against the reference side by side in your head: is it the same composition? Fix what isn’t.
2. Check: zero console errors, overflow = 0 at every width, no overlapping text, nothing clipped, images load, fonts load.
3. Test interactions with a small Playwright script (`scripts/qa/<slug>-test.mjs`, import `{ chromium } from 'playwright-core'`, launch `{ channel: 'msedge', headless: true }`): click every CTA/nav link, open/close every modal/menu, submit forms empty and valid, toggle tabs/filters, take screenshots of resulting states and Read them.
4. Run `--reduced` once and confirm content is visible.
5. Do at least two refine passes on the visuals after your first full build: tighten spacing rhythm, typographic hierarchy, alignment, and anything that looks generic.

## Final report (your last message)

Under 300 words: files created, sections, list of interactions, QA performed (widths checked, console state), and anything you could not finish or are unsure about. Be honest; do not claim tests you did not run.
