# 03 — Tidings · WhatsApp commerce & marketing · `/tidings` · folder `src/sites/tidings/` · prefix `ar` (internal)

Layout, components and interactions stay as built (sticky nav with dropdowns + region switch,
badge, two-line headline, big pill CTA, gradient with light columns, cropped phone with live chats,
two tilted message cards, products bento, campaign builder, analytics, how-it-works, pricing, FAQ,
about, CTA band, footer, wizard/log-in/sales dialogs). **Everything visible changes:** name, all
copy, every chat name & message, templates, segments, analytics campaigns, prices, palette, imagery.

## Identity
- **Tidings** — “WhatsApp campaigns customers actually want to open”.
- Wordmark: “tidings” lowercase, Outfit 700, in `--emerald`, no symbol.
- Footer line: “Tidings is a concept product for a design portfolio. Not affiliated with WhatsApp or Meta.”

## Palette — “Garden emerald” (replace all blue/violet tokens and hard-coded blues)
- `--bg #fbfaf6` (cream), `--cloud #f2f5ef`, `--ink #10231e`, `--ink-2 #34463f`, `--muted #66756e`, `--line #e3e8e0`
- `--emerald #0e7a5a` (primary CTA, wordmark, headline line 2), `--emerald-deep #0a4f3c`, `--forest #083a2d`, `--mint #d8f1e4`, `--mint-2 #b9e7cf`
- `--tangerine #ff8a3d` (small accents: unread badges in marketing UI, “Popular” chip, highlights), `--tangerine-soft #ffe6d4`
- Hero gradient: cream → `#e3f4ea` → `#7fd0a8` → `#0f7a5a` at the bottom; light columns in mint/white. CTA glow emerald-tinted. Growth plan card emerald.
- Chat UI keeps neutral chat greys and a muted chat-green for sent bubbles (`#d9fdd3`-ish is fine inside the phone only).

## Imagery
- Booking card image: `1751011983324-fe9d30fe9efd` (bistro table with wine glasses). Alt for templates: `1414235077428-338989a2e8c0` (plated dish), `1536392706976-e486e2ba97af` (candle-lit long table).
- Avatars: keep the existing Unsplash portraits but give them **new names**.

## Copy (all original)
- Nav: Platform ▾ · Learn ▾ · Pricing · Company — right: “Sign in”, “Book a demo” (opens wizard), region.
- Badge: “New — take payments inside the chat”.
- H1: “Turn WhatsApp into” / “your best sales channel” (line 2 emerald).
- Sub: “Send personalised broadcasts, win back abandoned carts and take payments right in the chat — with opt-in built in and every message measured.”
- CTA: “Launch a campaign”.
- Phone chats (new people): Priya Nair, Tomás Ortega, Hannah Okafor, Lena Fischer, Kenji Watanabe, Amina Diallo — new last messages and conversations.
- Left floating card: “Hi Priya — the linen shirt you saved is back in your size. Reply YES and we’ll hold one for 24 hours.” Link: “Reserve mine”.
- Right floating card: “Hi Tomás — your table for four at Casa Verde is confirmed for Friday at 8:00 pm.” + bistro image + link “View booking”.
- Products H2: “Everything a chat-first shop needs”. Blocks: Broadcasts · Product messages · Pay in chat · Journeys (new vignettes text/data).
- Builder H2: “Write it once. *It reads personal.*” Templates: Back in stock · Cart reminder · Reservation confirmed · Loyalty reward. Variables `{{first_name}}`, `{{item}}`, `{{link}}`. Segments: Regulars 2,180 · Recent orders 4,320 · Browsed, didn’t buy 1,140 · Newsletter list 9,600.
- Analytics H2: “See what every message earns.” Campaigns: “Spring linen drop”, “Weekend table offer”, “Loyalty double points” with new funnel numbers (sample data).
- How it works: Connect your business number → Import or grow your list → Launch, then learn.
- Pricing: Starter £15 / $19 / €18, Growth £49 / $62 / €57 (highlighted), Scale → “Talk to sales”. New feature lists. Keep the Meta-fees-at-cost note.
- FAQ (6, new wording), About (“Messages people are glad to get” — new paragraph + principles: Consent first, Fair pricing, Useful over loud).
- Final CTA: “Your customers are already in the chat.” + “Launch a campaign”.
- Wizard success: “Campaign draft saved in this demo — nothing was sent and no account was created.”
