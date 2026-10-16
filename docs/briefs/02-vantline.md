# 02 — Vantline · Decision-intelligence copilot · `/vantline` · folder `src/sites/vantline/` · prefix `au` (internal)

Layout, components and interactions stay as built (inset photo hero with nav pill + glass slab,
fanned deck, features panel over a landscape with live chart + depth slider, three tall image
cards, pricing over landscape with monthly/yearly, scroll-scrubbed dark band, footer, signup
drawer). **Everything visible changes:** name, all copy, card titles, chart labels, plans,
prices, features, palette and imagery.

## Identity
- **Vantline** — “a copilot that explains what changed in your numbers, and what to do next”.
- Wordmark: “vantline” lowercase, sans 600, no symbol.

## Palette — “Desert dusk” (replace every old token/hard-coded colour; no chartreuse/green)
- `--paper #faf7f1` (warm ivory), `--sand #efe6d8`, `--ink #15201f`, `--ink-2 #2f3a38`, `--muted #6f7774`, `--line rgba(21,32,31,.09)`
- `--teal #0f3d3b` (deep — dark band, Pro card, footer), `--teal-2 #1d5653`, `--teal-mist #dde9e6`
- `--coral #ff7a59` (signal: chart line, slider fill, “save” chip, focus accents — sparingly), `--coral-soft #ffe1d7`
- Dark band animates from paper → `--teal` (not near-black). Glass over photos stays white-translucent.

## Imagery (Unsplash ids — dunes & warm light)
- Hero: `1775321611040-a2f3d96ec489` (lone walker on pale dunes, pastel dusk, mountains). Put the glass slab beside the walker; keep the sky clear for the headline. Re-tune slab position, object-position and the legibility treatment for this photo.
- Features panel background: `1638024510305-c36fcc0bf3b1` (dunes under blue sky)
- Image card in panel (“people”): `1762198455081-3971c4d9cd95` (backlit walker on dunes)
- Fan deck (5): `1774031476308-e125ca182d54`, `1775320273896-49ceedec076d`, `1785270100891-358b3d7cd067`, `1562350683-774f43c5bdca`, `1763431157736-647791cd688b`
- Three tall cards: `1785270101004-480820ecc9b6` (dune curve), `1763796216517-b480bc16d369` (warm stained-glass light), `1789222640123-27e3905fd776` (amber droplets)
- Pricing background: `1506147854445-5a3f534191f8` (dune ridge at sunset) with the white fade on top.

## Copy (all original; write the rest in this voice)
- Nav pill: Product · Workflows · Principles · Plans — right: “Start free”.
- H1: sans line “Know what changed” / serif-italic line “and what to do about it.”
- Sub: “Vantline reads your metrics, docs and team threads, explains every shift in plain language, and suggests the next move.”
- CTA: “Try Vantline free”. Hint: “(Keep scrolling)”.
- Section 1 label “+ The Vantline loop”; H2 “From raw numbers to a clear brief — *in minutes*”. Fan cards: Connect sources · Spot the shift · Explain the cause · Weigh the options · Share the brief (new 2-line texts). Button: “Walk through the loop”.
- Features H2: “Clarity, *built into every view*”. Chart title “Signal over noise” (series e.g. “Weekly active accounts”; baseline “Last quarter”). Image card: “Made for the people in the room”. Slider card: “Depth of analysis” (readouts like “Skim · ~3s” → “Full investigation · ~45s”).
- Approach label “principles”; H2 “Better calls, *made together*”. Cards: “Explanations, not dashboards” · “Grounded in your own data” · “Sharper every week”.
- Plans: “Plans that *grow with your team*”. **Team $24 / seat / month** (light) and **Business $64 / seat / month** (deep teal card). New feature lists (5 each), e.g. Team: Weekly change briefs, Plain-language explanations, 12 data connectors, Shared workspace, Email support. Business: Everything in Team, Unlimited connectors, Scenario forecasts, Roles & audit log, Priority support. Yearly saves 20%.
- Dark band: “Make the next call *a clear one*.” + “Try Vantline free”.
- Drawer title: “Start your workspace”; success: “Workspace request saved in this demo only — no account was created.”
- Footer line: “Vantline is a concept product for a design portfolio. Chart values are sample data.”
