// Content + deterministic sample data for the Vantline concept page.

export const IMG = {
  hero: '1559202419-67d790c9d3dc',
  panel: '1679267207806-53137718141b',
  people: '1774509653819-93b91734dedc',
  plans: '1615567123837-6ca3e50e5a99',
};

export const NAV_LINKS = [
  { href: '#product', label: 'Product' },
  { href: '#workflows', label: 'Workflows' },
  { href: '#principles', label: 'Principles' },
  { href: '#plans', label: 'Plans' },
];

// The five stages of the Vantline loop, in order. The deck opens on stage 1 (centre).
export const STEPS = [
  {
    id: 'connect',
    title: 'Connect sources',
    text: 'Plug in metrics, docs and team threads. Vantline keeps them in sync.',
    img: '1494121508687-f3560d4f394e',
    alt: 'A small figure walking along a ridge under a pink evening sky',
    pos: '58% 60%',
  },
  {
    id: 'shift',
    title: 'Spot the shift',
    text: 'Flags the numbers that moved more than usual, and when it began.',
    img: '1790332263635-1da22019ceae',
    alt: 'Light refracting through a glass cube on black',
    pos: '50% 50%',
  },
  {
    id: 'cause',
    title: 'Explain the cause',
    text: 'Traces each change to the segment, release or event behind it.',
    img: '1762368229295-81f2742fb8a5',
    alt: 'A man seated on a hilltop, looking out over hazy ridges',
    pos: '50% 62%',
  },
  {
    id: 'options',
    title: 'Weigh the options',
    text: 'Lays out next moves side by side, with expected impact and effort.',
    img: '1696238081142-0979237124a8',
    alt: 'A lone silhouette on a grassy hill at dusk',
    pos: '62% 50%',
  },
  {
    id: 'brief',
    title: 'Share the brief',
    text: 'Sends a one-page summary the whole team can read and act on.',
    img: '1775892590228-c93f8108c22e',
    alt: 'A seated figure lit from behind by a bright beam of light',
    pos: '42% 50%',
  },
];

export const PRINCIPLES = [
  {
    title: 'Explanations, not dashboards',
    text: 'Every shift arrives as a short, plain-language account of what moved and why.',
    more: 'The underlying chart is always one click away when you want to dig in.',
    img: '1766997200042-ec2a576e499f',
    alt: 'A human figure traced in streaks of rainbow light',
    pos: '50% 38%',
  },
  {
    title: 'Grounded in your own data',
    text: 'Each answer cites the exact metric, doc or thread it was built from.',
    more: 'Your workspace data is never used to train shared models.',
    img: '1771599940657-f9f151abed45',
    alt: 'An iridescent glass ring catching light against black',
    pos: '50% 42%',
  },
  {
    title: 'Sharper every week',
    text: 'Mark a brief as useful or off target, and the next one adjusts to how you work.',
    more: 'A short weekly note shows what Vantline learned and what it changed.',
    img: '1783250971699-b93f67e34660',
    alt: 'Mirrored iridescent arcs repeating into the distance',
    pos: '50% 50%',
  },
];

export const PLANS = [
  {
    id: 'team',
    name: 'Team',
    monthly: 24,
    blurb: 'For small teams who want a clear weekly read on their numbers.',
    features: ['Weekly change briefs', 'Plain-language explanations', '12 data connectors', 'Shared workspace', 'Email support'],
  },
  {
    id: 'business',
    name: 'Business',
    monthly: 64,
    blurb: 'For companies running decisions across several teams at once.',
    features: ['Everything in Team', 'Unlimited connectors', 'Scenario forecasts', 'Roles & audit log', 'Priority support'],
  },
];

export const YEARLY_DISCOUNT = 0.2;
export const priceFor = (plan, billing) => (billing === 'yearly' ? plan.monthly * (1 - YEARLY_DISCOUNT) : plan.monthly);
export const money = n => `$${n.toFixed(2)}`;

export const TEAM_SIZES = ['Only me', '2–15 people', '16–60 people', '61–250 people', 'Over 250 people'];

// Bands for the "Depth of analysis" slider.
export const DEPTHS = [
  { max: 24, label: 'Skim', note: 'Reads the newest figures and answers from the weekly summary.' },
  { max: 49, label: 'Cross-check', note: 'Compares the change against the same period last quarter.' },
  { max: 74, label: 'Deep read', note: 'Pulls in docs, release notes and team threads before answering.' },
  { max: 100, label: 'Full investigation', note: 'Tests rival explanations and shows each step of its working.' },
];
export const depthFor = v => DEPTHS.find(d => v <= d.max) || DEPTHS[DEPTHS.length - 1];
// 3s at 0 → 45s at 100, eased so the low end moves slowly.
export const secondsFor = v => Math.round(3 + 42 * Math.pow(v / 100, 1.6));

/* ---------- Seeded sample data for the chart (no Math.random at render) ---------- */

export const CHART_MAX = 2500; // accounts
export const CHART_TICKS = [0, 500, 1000, 1500, 2000, 2500];
export const fmtCount = n => Math.round(n).toLocaleString('en-US');
export const fmtTick = n => (n >= 1000 ? `${(n / 1000).toString()}k` : String(n));

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const END = Date.UTC(2026, 9, 12); // Mon, Oct 12, 2026 — fixed so the sample never shifts.
const DAY = 86400000;
const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const fmtLong = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });

// Shape is described on a 0–100 scale, then mapped to accounts.
function series(n, seed, { from, to, waves, noise }) {
  const rnd = mulberry32(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 1 : i / (n - 1);
    let v = from + (to - from) * Math.pow(t, 1.15);
    for (const [amp, freq, phase] of waves) v += amp * Math.sin(t * Math.PI * 2 * freq + phase);
    v += (rnd() - 0.5) * noise;
    out.push((Math.max(4, Math.min(96, v)) / 100) * CHART_MAX);
  }
  return out;
}

function build(n, seed, shape, baseShape) {
  const values = series(n, seed, shape).map(Math.round);
  const base = series(n, seed + 5, baseShape).map(Math.round);
  return values.map((v, i) => {
    const d = END - (n - 1 - i) * DAY;
    return { v, b: base[i], label: fmt.format(d), long: fmtLong.format(d) };
  });
}

export const RANGES = {
  '1W': build(7, 41, { from: 66, to: 82, waves: [[4, 0.9, 1.1]], noise: 5 }, { from: 58, to: 61, waves: [[1.5, 0.7, 0.4]], noise: 2 }),
  '1M': build(30, 53, { from: 38, to: 86, waves: [[9, 1.3, 0.9], [4, 3.6, -0.3]], noise: 4 }, { from: 44, to: 60, waves: [[2.5, 1.1, 0.6]], noise: 2 }),
  '1Q': build(91, 67, { from: 22, to: 84, waves: [[10, 2.1, -0.4], [4, 5.5, 0.9]], noise: 3 }, { from: 30, to: 57, waves: [[3, 1.4, 0.2]], noise: 2 }),
};
export const DEFAULT_RANGE = '1M';
