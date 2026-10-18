# Six Landing Pages — interactive concept studies

Six independent, fully interactive landing pages. Six reference designs set the visual direction —
layout, composition and colour; every brand, logo, word, person and data point here is original.

| Route | Concept | Type | Signature interaction | Signature animation |
| --- | --- | --- | --- | --- |
| `/sagewell` | Sagewell — AI reasoning model | Figtree | Prompt composer with streamed reasoning-trace demo, API playground, cost estimator | Kinetic pills: the four reasoning passes slide in as capsules, stitched by a dotted thread |
| `/vantline` | Vantline — decision-intelligence copilot | Inter Tight + Instrument Serif | Fanned insight deck, live chart controls, plans toggle, scroll colour transition | Scroll-fanned deck: cards fan out from a stack as the section scrolls through |
| `/tidings` | Tidings — WhatsApp commerce platform | Outfit | Clickable phone chats, campaign builder with live preview, 3-step campaign wizard | Floating 3D phone: idle float, pointer tilt and a scroll turn, still fully clickable |
| `/emberpost` | Emberpost — people-first email | Geist + Geist Mono | Fully clickable inbox: switch people, reply, mark done/undo, keyboard shortcuts | Hanging people wall: drifting portrait columns that tilt toward the pointer |
| `/creative-portfolio` | Ines Morrow — film editor (fictional) | Archivo + JetBrains Mono + Caveat | Scrubbable hero timeline, case studies with before/after colour-grade slider | Scale strip: film stills swell as they pass the centre; scroll or drag |
| `/maren-holt` | Maren Holt — book editor (fictional) | Plus Jakarta Sans + Newsreader | Typewriter headline with pressable 3D keycaps, essay filters, search palette, reader | Rotating arc: essay cards circle over the heading and react to scroll speed |

`/` is an index of all six. Every route loads directly and survives refresh.

## Live links

| Site | URL |
| --- | --- |
| Index of all six | https://gireeshkumarreddy.github.io/landing-concepts/ |
| Sagewell | https://gireeshkumarreddy.github.io/landing-concepts/sagewell/ |
| Vantline | https://gireeshkumarreddy.github.io/landing-concepts/vantline/ |
| Tidings | https://gireeshkumarreddy.github.io/landing-concepts/tidings/ |
| Emberpost | https://gireeshkumarreddy.github.io/landing-concepts/emberpost/ |
| Ines Morrow | https://gireeshkumarreddy.github.io/landing-concepts/creative-portfolio/ |
| Maren Holt | https://gireeshkumarreddy.github.io/landing-concepts/maren-holt/ |

Every push to `main` rebuilds and redeploys through `.github/workflows/deploy.yml`.
`npm run build:pages` builds with `BASE_PATH=/<repo>/` and writes a copy of `index.html` into
each route folder (plus `404.html`), because GitHub Pages has no SPA rewrites. For Netlify or
Vercel use the plain `npm run build`; `public/_redirects` and `vercel.json` handle their rewrites.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build to dist/
npm run preview    # serve dist/ on http://localhost:4173
```

## Motion system

Shared, declarative and the same across all six sites (`src/shared/motion/`):

- **Smooth scrolling** with Lenis, driven by the GSAP ticker and synced with ScrollTrigger; in-page
  links, route changes and modals (which pause scrolling) all go through it.
- **Page colour transitions** — a section marked `data-bg` re-tints the whole page while it's centred,
  so colours flow between sections instead of meeting at hard edges; navs follow via `data-scroll-theme`.
- **Scroll-filled statements** (`data-fill`), **masked line reveals** (`data-reveal`), **parallax**
  photography (`data-parallax`), **inset-to-full-bleed media** (`data-expand`), **magnetic** CTAs
  (`data-magnetic`), **velocity skew** (`data-velocity`) and a **cursor label** (`data-cursor`).
- Everything is reverted on unmount and disabled under `prefers-reduced-motion` (content stays visible).

## Structure

```
src/
  App.jsx                 router — each site is a lazy-loaded chunk
  sites.js                registry used by the router and the index page
  hub/                    the index page at "/"
  shared/                 infrastructure only (no visual design):
    gsap.js               GSAP + ScrollTrigger + SplitText registration, reduced-motion queries
    useSiteMeta.js        per-route title, description, theme colour and page background
    a11y.js               focus trap, Escape, scroll lock, email validation
    img.js                Unsplash URL + srcset helpers
    ScrollManager.jsx     scroll reset on route change, #hash support for lazy routes
    base.css              minimal reset, skip link, reduced-motion clamp
  sites/<slug>/           one folder per site: its own components, data, icons and scoped CSS
docs/briefs/              the design brief for each site (identity, palette, imagery, copy)
scripts/shot.mjs          screenshot helper (headless Edge via playwright-core)
scripts/audit.mjs         route × viewport audit (overflow, console errors, broken images, a11y basics)
scripts/originality-check.mjs  fails if any reference text, brand or person name is in src/
```

CSS is scoped per site (each site's selectors live under its own short class prefix) so the pages
never leak styles into each other when navigating client-side.

## QA scripts

All use the locally installed Microsoft Edge through `playwright-core` (no browser download).

```bash
node scripts/originality-check.mjs                         # no reference text, names or data in src/
node scripts/shot.mjs /sagewell shot.png 1440 900 --full   # screenshot (also --reduced, --scroll=px)
node scripts/audit.mjs http://localhost:4173               # every route × 6 viewports
node scripts/qa/cross-nav.mjs http://localhost:4173        # client-side navigation between sites
node scripts/qa/motion-check.mjs /sagewell out/           # smooth scroll, glide curve, colour changes, frames
node scripts/qa/<site>-test.mjs <screenshot-dir>           # per-site interaction suites (dev server)
```

## Honesty notes

- These are concept products. Forms validate and show loading/success states, but nothing is sent
  or stored — every success message says so.
- No real company logos are drawn; brand names are typographic and invented. People, clients,
  messages and metrics are fictional sample data. Ines Morrow and Maren Holt are fictional people.
- Photography is hotlinked from Unsplash (Unsplash licence). On Tidings that is a single photo, the
  bistro table; its customer avatars are original illustrations drawn in code
  (`src/sites/tidings/components/Avatar.jsx`), not photos.
