# 04 — Emberpost · People-first email app · `/emberpost` · folder `src/sites/emberpost/` · prefix `ta` (internal)

Layout, components and interactions stay as built (double-ring sticky nav, badge, huge tight
headline with inline tile, floating avatar tiles with connector lines, interactive inbox window
with notifications/keyboard/reply/mark-done, people-vs-threads toggle, feature bento, workflow
studies, about, waitlist form, footer). **Everything visible changes:** name, all copy, every
person, subject, message, notification source. The visual design stays as the first build.

## Identity
- **Emberpost** — “email organised around the people behind it”.
- Wordmark: “emberpost” lowercase, Geist 600, with a small spark mark.
- Footer line: “Emberpost is a concept product for a design portfolio. People and messages are sample data.”

## Visual design — restored first build (light grey, restrained purple)
- Tokens: `--ta-bg #ececee`, `--ta-bg-2 #f4f4f6`, `--ta-surface #ffffff`, `--ta-ink #0c0c10`, `--ta-ink-2 #3a3a44`, `--ta-muted #75757f`, `--ta-line #dcdce2`, `--ta-violet #5b4cf0`, `--ta-violet-2 #7b6dff`, `--ta-lavender #e8e5ff`, `--ta-lavender-2 #d9d4ff`; sidebar `#efedff → #e3e0ff`.
- Logo: “emberpost” wordmark with a small original spark mark.

## Copy (all original)
- Nav right: “Manifesto” · “Workflows” · CTA “Join the waitlist”.
- Badge: bolt glyph + “Now inviting small teams”.
- H1 (two lines, keep the inline tile after the first word): “Talk [tile] to people,” / “not to piles of mail.” Tile = purple circle with white envelope glyph. Re-tune size/line breaks so it stays a strong 2-line block at desktop.
- Sub: “Emberpost groups every email by the person behind it, so you can catch up on a relationship in seconds and reply like you’re in the same room.”
- CTA: “Join the waitlist”.
- Inbox sample data (all new):
  - Teammates: Maya Chen, Oliver Grant (+ more). People: Sofia Reyes (unread 2), **Marcus Bell — selected**, Amara Osei, Theo Lindqvist (unread 3). Notifications: Billing, Calendar, Status alerts, Release notes.
  - Selected thread subject: “Draft budget for the spring launch” — new body text, participants, “5 messages · 14 Mar 2026, 09:40”.
  - Floating notifications: Sofia Reyes — “Could we move Thursday’s review to the morning?”; Theo Lindqvist — “Sent the revised contract, two small changes on page 3…”.
  - Every other conversation rewritten.
- Sections: “Sorted by who, not by when.” (classic ↔ Emberpost toggle) · features H2 of your own (Screener, Lanes, Nudges, Keyboard) · Workflows `#workflows` “How small teams use Emberpost” (3 illustrative scenarios: Studio founder, Client services, Hiring loop — label as illustrative) · Manifesto `#manifesto`: about the name — embers keep a conversation warm between replies; principles: People first, Quiet by default, Private by design · Waitlist `#waitlist` “Keep the conversation going.”
- Waitlist success: “You’re on the demo list — this concept doesn’t send emails or store your address.”
- Remove any mention of the old name or its meaning.
