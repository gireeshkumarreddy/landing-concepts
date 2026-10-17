# 08 — Signature animations (one per site)

The user supplied six animation references (`references/batch-2/`, local only). Each site gets one
of these as a **signature moment**, built on the shared motion system (Lenis + GSAP/ScrollTrigger,
`docs/briefs/07-motion.md`). Copy the *motion idea and composition*, never the reference's text,
brand, logos or people (the originality check now includes those phrases).

Rules for all six:
- Transforms/opacity only; one rAF/ticker loop per effect; pause when off-screen; clean up on unmount.
- Works with smooth scroll (use ScrollTrigger / Lenis velocity, not raw `scroll` listeners).
- Pointer effects only on `(hover: hover) and (pointer: fine)`; touch gets a calm, still-readable version.
- Reduced motion: a beautiful static arrangement (no rotation/drift), everything visible and usable.
- Mobile (390): recomposed, no overflow, nothing clipped awkwardly.
- Keyboard: anything clickable stays focusable with visible focus; decorative layers `aria-hidden`.
- Keep the site's palette, fonts and the rest of the page as it is. Original copy only.

| Site | Reference | Signature animation |
| --- | --- | --- |
| Ines Morrow `/creative-portfolio` | `1-ai-image-generator.png` | **Scale strip** — a single row of film stills where each card's size depends on its distance from the screen centre (tiny at the edges, largest in the middle). As you scroll the section, the row slides horizontally (scrubbed), so stills swell as they pass the centre and shrink away. Drag/wheel-friendly; the centred still shows its title + timecode. Place it as the opening of the Reel section (keep the hero). |
| Emberpost `/emberpost` | `2-testimonials-wall.png` | **Hanging people wall** — portrait cards in 8–10 columns that hang from the top edge at staggered lengths (faded tops), with a centred heading below. Columns drift at different speeds while scrolling (parallax), and the hovered card tilts in 3D toward the pointer and lifts, showing a name + role chip. These are *people you email*, not testimonials — no quotes, no "trusted by" claims. Add as its own section before Workflows. |
| Maren Holt `/maren-holt` | `3-ai-photos-arc.webp` | **Rotating arc** — essay images on rounded cards placed around a large circle whose top half arcs over a centred heading + CTA. The ring rotates slowly on its own and speeds up/reverses with scroll velocity; cards tilt along the arc and the one at the apex is largest. Hover pauses and lifts a card ("Read" cursor label); click opens that essay. Place as the intro of the Essays section. |
| Vantline `/vantline` | `4-design-agency.png` | **Scroll-fanned deck** — upgrade the existing How-it-works deck: cards start stacked behind the heading and fan out (rotate/translate along an arc) as the section scrolls into view (scrubbed), fully spread at centre, gently closing again as it leaves. Keep click/arrow-key navigation and the snap carousel on mobile. |
| Sagewell `/sagewell` | `5-creative-mines.png` | **Kinetic pills** — the "how it thinks" steps (Plan · Investigate · Cross-check · Conclude) become bold words inside long pill/capsule shapes on a track; on entering view the pills slide in from alternating sides and stretch to width, round icon chips pop in, and a dotted connector line draws between them. Use Sagewell's palette (moss, leaf, sand, bloom accents) — calm, not loud. |
| Tidings `/tidings` | `6-fintech-card.png` | **Floating 3D phone** — the hero phone gains depth: a soft idle float, a pointer-driven tilt (perspective, ≤8°), and as you scroll past the hero it turns slightly (rotateY/rotateX) and rises before handing off to the page. The phone must stay fully clickable (small angles, hit-testing intact). Floating message cards follow at different depths. |
