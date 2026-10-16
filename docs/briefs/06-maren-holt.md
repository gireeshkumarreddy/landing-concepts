# 06 — Maren Holt · Book editor & newsletter · `/maren-holt` · folder `src/sites/maren-holt/` · prefix `ch` (internal)

Layout, components and interactions stay as built (framed page with guide lines, pill nav with
search + sign-in, small label, two-line headline with two pressable 3D keycaps and a gradient
phrase, typewriter + caret, intro + newsletter form, featured tray, filtered essays + reader,
services accordion, anatomy flip cards, workshops + request form, about, contact, footer).
**Everything visible changes:** the person (now fictional), all copy, every article, palette, imagery.

## Identity
- **Maren Holt** — a *fictional* developmental editor who writes a weekly newsletter on making books better. Monogram avatar “MH”.
- Remove every trace of the previous real person (name, claims, disclaimers about him).
- Footer line: “Maren Holt is a fictional editor created for this portfolio concept. Essays are sample content.”

## Palette — “Paper, ink & rust” (replace every grey/pink/purple token and hard-coded value)
- `--bg #e7e2d8` (outer), `--page #f5f1e8` (framed page, warm paper), `--surface #fffdf8`, `--ink #221f1a`, `--ink-2 #4a443b`, `--muted #857d70`, `--line #e2dacb`
- Gradient phrase: `linear-gradient(90deg,#c9822a 0%,#b5482a 60%,#8f2f24 100%)` (amber → rust).
- Keycaps: cream keycap (`#fbf7ee` face, `#e6dccb` skirt) with ink glyph; **sage** keycap (`#7f9b7d` face, `#5f7b5d` skirt) with white glyph.
- Buttons: deep forest `#2f3d33` with raised 3D edge (`#1f2a22`). Links/active dot: rust `#b5482a`.

## Imagery (Unsplash ids)
- Featured tray (3): `1581431886288-e216ea4ccf3f` (red pencil on a page — editing), `1749671232817-1f224147f0c9` (warm grand library), `1445964047600-cdbdb873673d` (misty autumn path)
- Essays & reader headers: `1744693660970-3517f524fb28` (bookstore table), `1471107340929-a87cd0f5b5f3` (fountain pen on notebook), `1617177435596-1c9e30d6d608` (gold pen & leather notebook), `1769490314531-759457a659db` (books in sunlight), `1791973648912-1dbfd532b471` (bookshelf by a forest window), `1689859910728-53b49d5ec39c` (bookshop shelves)
- Do not use the old images (mic, red book spines, father & child).

## Copy (all original)
- Nav: Essays · Services · Workshops · About · Contact — right: search, “Sign in”.
- Label: small book glyph + “Editing notes, every Sunday”.
- H1 (2 lines): “Turn your [cream keycap: pen] manuscript into” / “a book [gradient]readers recommend[/] [sage keycap: bookmark]”.
- Intro: “I’m a developmental editor. I help first-time and returning authors shape stronger books — and I write down what I learn along the way.”
- Newsletter: placeholder “your@email_” style with the blinking underscore; button “Get the notes”. Success: “You’re subscribed in this demo — no email was stored or sent.”
- Featured label “From the notebook”. Essays (8, new titles + bodies, filters: Structure · Revision · Publishing · Writing life), e.g. “The chapter you should cut first”, “Why your opening needs a question, not an answer”, “Revision in three passes”, “What a good editorial letter looks like”, “Querying without losing your nerve”, “Writing on the days you can’t”, etc.
- Services `#services`: Manuscript assessment · Developmental edit · Book coaching. Anatomy cards: Premise · Structure · Voice · Ending.
- Workshops `#workshops` (3 talks/workshops, new) + “Request a workshop” form.
- About: fictional bio (Bristol-based, 14 years editing fiction and narrative non-fiction — clearly fictional persona).
- Search palette + sign-in (email only) keep their behaviour with new wording.
