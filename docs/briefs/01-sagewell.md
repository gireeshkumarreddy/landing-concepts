# 01 — Sagewell · AI reasoning model · `/sagewell` · folder `src/sites/sagewell/` · prefix `cr` (internal)

Layout, components and interactions stay as built (inset painted hero frame, glass composer with
reasoning-trace demo, quickstart, API playground, “how it thinks” cards over art, use-case cards,
usage pricing + estimator, journal list + reader, closing CTA, footer). **Everything visible changes:**
name, every line of copy, sample prompts/answers, model ids, prices, palette and imagery.

## Identity
- **Sagewell** — “a reasoning model that shows its work”. Tone: calm, precise, a little literary.
- Wordmark: “Sagewell” in the display face, weight 600, no symbol.
- Model ids: `sagewell-2`, `sagewell-2-swift`. Demo key prefix `sw_demo_`.

## Palette — “Harbour at dusk” (replace every old token/hard-coded colour)
- `--paper #f3f1f6` (cool porcelain page), `--fog #f7f5fa`, `--ink #191a2e` (indigo-black), `--ink-2 #34364f`, `--muted #6a6a80`, `--line rgba(25,26,46,.10)`
- `--indigo #2b3263` (primary dark: buttons, code panels), `--tide #5b72a3` (secondary), `--mist #dfe3ef`
- `--apricot #e48d5b` (single warm accent: badge chip, active states, highlights, slider fill), `--apricot-soft #f8e3d5`
- Code panel: bg `#161a33`, text `#e6e8f3`, strings `#f0b48a`, keywords `#9fb3ff`, comments `#7d84a8`.
- Fog gradient over the hero art fades to porcelain (`#f7f5fa`), not warm white. Shadows tinted indigo (`rgba(25,26,60,…)`).
- No green UI anywhere.

## Imagery (Unsplash ids — painterly sea & sky)
- Hero (desktop + mobile, use `object-position` for mobile): `1775313088881-649b8d9dc7d8` (soft pastel sky over water)
- How-it-thinks band: `1681235155981-b6553346cc41` (painted cloudscape)
- Use-case cards: `1781708897984-9f8b06afb9dc` (impressionist cliffs & boats), `1774887053803-5e535abe27c5` (pink/orange coastal sunset), `1705080188277-74dd01f11d61` (stormy painted sky), `1742673506753-b286d4c0a120` (calm bay with sailboat)
- Closing CTA: `1742672001310-a6fab9c25b92` (sunset over a lake and hills); alt `1744571180310-a41e49d1269e` (cumulus over ocean)

## Copy (write the rest in the same voice; all original)
- Nav: Research · Developers · Pricing · Journal — CTA “Request access”.
- Badge: chip “Preview” + “Sagewell 2 reads a million tokens”.
- H1 (2 lines): “The model that thinks / before it speaks.”
- Sub: “Sagewell plans, checks and revises its own reasoning before it replies — so every answer comes with a trail you can follow, cite and defend.”
- Composer placeholder rotation + example chips (write good pre-written answers + reasoning traces for each):
  1. “How would tides work on a planet with two moons?” (chip: “Two-moon tides”)
  2. “Which of these three suppliers is the riskiest, and why?” (chip: “Supplier risk”)
  3. “Why does my list re-render on every keystroke?” (chip: “React re-renders”)
  4. “What are the real trade-offs of a four-day work week?” (chip: “Four-day week”)
  For #2 the demo answer should explain it needs the supplier data and show how it would weigh criteria — no invented companies presented as real.
- Quickstart H2: “Three steps to your first traced answer.” Playground H2: “One endpoint. *Adjustable depth.*” (or similar — your words).
- How-it-thinks steps: Plan · Investigate · Cross-check · Conclude.
- Use cases: Literature reviews, Incident post-mortems, Policy comparison, Product strategy (new questions for each).
- Pricing: “Pay for thinking, not seats.” `sagewell-2`: $2.50 / M input, $12 / M output; `sagewell-2-swift`: $0.30 / $1.50. Keep “illustrative pricing for a concept product”.
- Journal (nav “Journal”): three new notes, e.g. “Introducing Sagewell 2”, “Reading a reasoning trace”, “When the right answer is ‘it depends’” — new body text.
- Closing: “Ask something difficult.” + “Request access” / “Read the docs”.
- Access modal title: “Request early access”; success: “Request saved in this demo only — no account was created and nothing was sent.”
- Footer line: “Sagewell is a concept product for a design portfolio.”
