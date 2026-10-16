# 01 — Sagewell · AI reasoning model · `/sagewell` · folder `src/sites/sagewell/` · prefix `cr` (internal)

Layout, components and interactions stay as built (inset painted hero frame, glass composer with
reasoning-trace demo, quickstart, API playground, “how it thinks” cards over art, use-case cards,
usage pricing + estimator, journal list + reader, closing CTA, footer). **Everything visible changes:**
name, every line of copy, sample prompts/answers, model ids, prices. The visual design (colours, imagery) stays as the first build.

## Identity
- **Sagewell** — “a reasoning model that shows its work”. Tone: calm, precise, a little literary.
- Wordmark: “Sagewell” in the display face, weight 600, no symbol.
- Model ids: `sagewell-2`, `sagewell-2-swift`. Demo key prefix `sw_demo_`.

## Visual design — restored first build (garden, warm white, near-monochrome UI)
- Tokens: `--cr-ink #141512`, `--cr-ink-2 #3a3b36`, `--cr-muted #6d6c66`, `--cr-paper #f6f3ec`, `--cr-fog #faf8f3`, `--cr-line rgba(20,21,18,.10)`, `--cr-moss #2f4536`, `--cr-leaf #6f8f6a`, `--cr-sand #e8e1d2`, `--cr-bloom #d4688e`.
- Black pill CTA, warm-white fog over the painting, glass composer, rounded inset hero frame.
- Logo: small original geometric mark + “Sagewell” wordmark.

## Imagery (Unsplash ids)
- Hero desktop `1745761500122-a39a7919ec5b`, hero mobile `1739160480412-259ec009d1cc`
- Extras: `1685648043564-ac64bc80d82f`, `1688588428113-d24195a109bc`, `1683221044456-b708fcb22060`, `1741722604145-4e00cf5b2052`, `1752854058427-8a87b57eac2b`

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
