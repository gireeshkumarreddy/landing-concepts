// Copy and sample data for the Sagewell concept page. All of it is written for this project.

export const IMG = {
  hero: '1775313088881-649b8d9dc7d8', // soft pastel sky over water
  clouds: '1681235155981-b6553346cc41', // painted cloudscape
  cliffs: '1781708897984-9f8b06afb9dc', // impressionist cliffs and boats
  coastSunset: '1774887053803-5e535abe27c5', // pink and orange coastal sunset
  storm: '1705080188277-74dd01f11d61', // stormy painted sky
  bay: '1742673506753-b286d4c0a120', // calm bay with a sailboat
  lakeSunset: '1742672001310-a6fab9c25b92', // sunset over a lake and hills
};

export const NAV_LINKS = [
  { href: '#research', label: 'Research', id: 'research' },
  { href: '#developers', label: 'Developers', id: 'developers' },
  { href: '#pricing', label: 'Pricing', id: 'pricing' },
  { href: '#journal', label: 'Journal', id: 'journal' },
];

/* ------------------------------------------------------------------ */
/* Composer demo: scripted questions, trails and replies               */
/* ------------------------------------------------------------------ */

export const TRAIL_TITLES = ['Plan', 'Investigate', 'Cross-check', 'Mark the uncertainty', 'Conclude'];

export const EXAMPLES = [
  {
    id: 'tides',
    chip: 'Two-moon tides',
    question: 'How would tides work on a planet with two moons?',
    match: /tide|two moons|moons/i,
    steps: [
      'Treat each moon as its own tide-raiser, then ask how the two patterns combine as the moons move.',
      'Tidal force scales with mass over distance cubed. Earth’s Sun and Moon already form a working two-body example.',
      'Spring and neap tides on Earth confirm it: aligned bodies add up, bodies at right angles partly cancel.',
      'Actual heights depend on coastlines and basin resonance, which the question leaves open.',
      'Describe the combined rhythm first, then say what would change it.',
    ],
    answer: [
      {
        type: 'p',
        text: 'Each moon raises its own pair of tidal bulges, one facing it and one on the far side of the planet. The ocean follows the sum of the two patterns, and that sum keeps changing as the moons move relative to each other.',
      },
      {
        type: 'ul',
        items: [
          ['When the moons line up,', 'on the same side of the planet or on opposite sides, their bulges stack and the tidal range is at its widest, much like spring tides on Earth.'],
          ['When they sit at right angles,', 'one moon’s high water lands on the other’s low water and the range shrinks, like a neap tide.'],
          ['The rhythm between those extremes', 'follows the moons’ synodic period, the time between alignments, with the biggest tides twice in each cycle.'],
        ],
      },
      {
        type: 'p',
        text: 'Which moon dominates depends on mass divided by distance cubed, so a small, close moon can outweigh a large, distant one. It is the same reason the Sun’s tidal pull on Earth is a little under half the Moon’s.',
      },
      {
        type: 'p',
        text: 'Local geography still decides what a harbour actually sees: shelves and bays can amplify or mute either pattern, and some coasts would get irregular, mixed tides rather than a tidy twice-daily cycle.',
      },
    ],
  },
  {
    id: 'suppliers',
    chip: 'Supplier risk',
    question: 'Which of these three suppliers is the riskiest, and why?',
    match: /supplier|vendor|procure/i,
    steps: [
      'No supplier records came with the question, so set out the criteria first and ask for the data.',
      'Common risk signals: how dependent you are, delivery history, financial health, exposure to disruption, compliance.',
      'Weights should follow what a failure would cost you, not a generic scorecard.',
      'Without the three profiles, any ranking would be made up.',
      'Explain the method, show the weighting, and request the records.',
    ],
    answer: [
      {
        type: 'p',
        text: 'I can’t rank suppliers I haven’t seen, and a guess would be worse than no answer. Share what you have on each of the three (contracts, delivery logs, recent accounts, audit notes) and I’ll score them side by side with the reasoning visible. This is how I would weigh them:',
      },
      {
        type: 'ol',
        items: [
          ['Dependence.', 'What share of a critical part does each one provide, and how quickly could you switch? Single-sourced items weigh most.'],
          ['Delivery record.', 'On-time rate and defect trend over the last four quarters, with recent changes counting more than old ones.'],
          ['Financial resilience.', 'Liquidity, debt and payment behaviour. A supplier under strain can fail suddenly despite a clean delivery history.'],
          ['Exposure.', 'Single-site production, regions prone to disruption, and sanctions or export controls further up their chain.'],
          ['Compliance.', 'Open audit findings, certifications about to lapse, and labour or environmental concerns.'],
        ],
      },
      {
        type: 'p',
        text: 'I would score each factor from 1 to 5, weight dependence and financial resilience highest for anything single-sourced, and flag missing data instead of assuming the best.',
      },
    ],
  },
  {
    id: 'rerender',
    chip: 'React re-renders',
    question: 'Why does my list re-render on every keystroke?',
    match: /re-?render|keystroke|react/i,
    steps: [
      'No component attached, so list the usual reasons a list re-renders when an unrelated input changes.',
      'Where the state lives, props that change identity each render, unstable keys, and context updates.',
      'React re-renders children whenever a parent renders; memoising only helps when the props stay stable.',
      'A re-render is not automatically slow, so measure before optimising.',
      'Give the likely causes in order, each with a fix.',
    ],
    answer: [
      {
        type: 'p',
        text: 'Most often the input’s state lives in the same component as the list, so each keystroke re-renders that component and, by default, all of its children. Paste the component and I’ll point to the line. Until then, check these in order:',
      },
      {
        type: 'ul',
        items: [
          ['Move the state down.', 'Give the input and its state their own component, so typing only re-renders that component.'],
          ['Keep props stable.', 'Inline objects, arrays and arrow functions are new on each render, which defeats React.memo. Use useMemo and useCallback, or hoist constants.'],
          ['Fix the keys.', 'Keys from the array index or Math.random() make React remount rows instead of reusing them. Use a stable id from your data.'],
          ['Split the context.', 'If the input writes to a context the list also reads, every consumer re-renders. Keep fast-changing values in a context of their own.'],
        ],
      },
      {
        type: 'p',
        text: 'Confirm with the React DevTools Profiler before changing anything. If filtering the list is genuinely expensive, useDeferredValue keeps typing responsive while the list catches up.',
      },
    ],
  },
  {
    id: 'fourday',
    chip: 'Four-day week',
    question: 'What are the real trade-offs of a four-day work week?',
    match: /four-?day|4-?day|work week|workweek/i,
    steps: [
      'Separate the two designs, fewer hours at full pay versus the same hours in four days, because the evidence differs.',
      'Large pilots in the UK and Iceland plus company reports; participants were mostly self-selected.',
      'Wellbeing results are consistent; productivity data is thinner and harder to compare.',
      'Results from volunteer organisations may not transfer to every role or sector.',
      'Set out the gains, the costs, and where it tends to break.',
    ],
    answer: [
      {
        type: 'p',
        text: 'It depends on which version you mean. Cutting hours at the same pay is a different experiment from compressing forty hours into four longer days, and most of the evidence concerns the first.',
      },
      {
        type: 'ul',
        items: [
          ['Likely gains.', 'Large trials, including a 2022 UK pilot of around sixty companies, reported less burnout and better retention, and most of those firms kept the policy afterwards.'],
          ['Real costs.', 'Cover gets harder for customer-facing, shift and on-call roles, and meetings and handovers need redesigning or the work leaks into the fifth day.'],
          ['Gaps in the evidence.', 'Many outcomes are self-reported, and the organisations that volunteer are the ones most likely to make it work.'],
          ['Compressed weeks', 'keep total hours the same: more flexibility, but long days can bring fatigue.'],
        ],
      },
      {
        type: 'p',
        text: 'A sensible way in is a time-limited pilot with output measures agreed before it starts and a clear route back if they slip.',
      },
    ],
  },
  // Questions behind the use-case cards
  {
    id: 'spacing',
    question: 'What does the research actually say about spaced repetition?',
    match: /spaced|repetition|spacing/i,
    steps: [
      'Separate the core spacing effect from claims about apps, schedules and complex skills.',
      'More than a century of memory studies, plus meta-analyses of spaced versus massed practice.',
      'Retrieval practice studies point the same way; classroom effects are smaller than lab effects.',
      'Most experiments use facts and word lists, so evidence for complex skills is thinner.',
      'State the robust finding, the practical rule, and the limits.',
    ],
    answer: [
      {
        type: 'p',
        text: 'The spacing effect is one of the most replicated findings in memory research: material reviewed across several sessions is remembered far longer than the same amount of study crammed into one. Meta-analyses of hundreds of experiments agree on the direction.',
      },
      {
        type: 'ul',
        items: [
          ['The gap should grow with the goal.', 'The longer you need to remember something, the longer the best interval between reviews; one large study put it at roughly a tenth to a fifth of the retention period.'],
          ['Testing beats rereading.', 'Spacing works best combined with retrieval practice, actively recalling the answer instead of looking at it again.'],
          ['Limits.', 'Most studies use facts, vocabulary and word lists. Evidence for complex skills is thinner, and real classroom gains are smaller than laboratory ones, though still positive.'],
        ],
      },
    ],
  },
  {
    id: 'postmortem',
    question: 'What should a blameless post-mortem for a 40-minute outage include?',
    match: /post-?mortem|outage|incident/i,
    steps: [
      'Define the audience: engineers who will act on it and readers who only need the impact.',
      'Common post-incident review formats and the parts teams actually reuse.',
      'Blameless language describes decisions in their context rather than naming fault.',
      'Without the incident notes, the outline stays generic.',
      'Give a section-by-section outline and the questions each part should answer.',
    ],
    answer: [
      {
        type: 'p',
        text: 'Keep it short enough to be read and specific enough to change something. A good structure:',
      },
      {
        type: 'ol',
        items: [
          ['Summary and impact.', 'Two or three sentences: what broke, for whom, for how long, and how it was detected.'],
          ['Timeline.', 'Timestamped, in one time zone, from first signal to full recovery, including what responders believed at each point.'],
          ['Contributing factors.', 'Usually several, not one root cause: the change, the missing safeguard, and the conditions that let them meet.'],
          ['What helped.', 'Alerts, runbooks or decisions that shortened the outage and should be kept.'],
          ['Actions.', 'A few concrete changes, each with an owner and a date, ranked by how much risk they remove.'],
        ],
      },
      {
        type: 'p',
        text: 'Write about decisions in the light of what people knew at the time. If a reasonable person would have made the same call, the fix belongs in the system, not in a reminder to be careful.',
      },
    ],
  },
  {
    id: 'privacy',
    question: 'How do the GDPR and the CCPA differ on consent?',
    match: /gdpr|ccpa|consent|privacy/i,
    steps: [
      'Compare the default model of each law, then the exceptions that matter in practice.',
      'GDPR lawful bases for processing; CCPA rights to know, delete and opt out, as amended by the CPRA.',
      'Check where each law requires opt-in consent and where opt-out is enough.',
      'Thresholds and enforcement details change, and this is not legal advice.',
      'Summarise the difference in one line, then the details.',
    ],
    answer: [
      {
        type: 'p',
        text: 'In short, the GDPR asks for a lawful reason before you process personal data, while the CCPA mostly lets processing happen and gives people the right to opt out.',
      },
      {
        type: 'ul',
        items: [
          ['GDPR.', 'Consent is one of six lawful bases. Where you rely on it, it must be freely given, specific, informed and unambiguous, and as easy to withdraw as to give.'],
          ['CCPA.', 'Businesses above revenue or data-volume thresholds must honour requests to opt out of the sale or sharing of personal information, and offer a clear link to do so.'],
          ['Where the CCPA asks for opt-in.', 'Selling or sharing the data of consumers under 16 requires opt-in, from a parent for children under 13.'],
        ],
      },
      {
        type: 'p',
        text: 'This is general information, not legal advice. Check current guidance for the jurisdictions you operate in.',
      },
    ],
  },
  {
    id: 'billing',
    question: 'Should we build our own billing system or buy one?',
    match: /billing|build or buy|invoic/i,
    steps: [
      'Ask whether billing is part of what makes the product different, or plumbing.',
      'The hidden scope: tax, proration, dunning, invoicing, revenue recognition and payment-card compliance.',
      'Vendor fees versus the long-term cost of a team that owns billing.',
      'Pricing models and volumes are unknown, so the answer stays conditional.',
      'Recommend a default and name the conditions that would flip it.',
    ],
    answer: [
      {
        type: 'p',
        text: 'Buy by default. Billing looks like a few tables and a cron job, but the long tail of taxes, proration, failed-payment retries, invoices, refunds, revenue recognition and payment-card compliance is where homegrown systems stall.',
      },
      {
        type: 'ul',
        items: [
          ['Build when', 'your pricing model is the product and vendors cannot express it, or volume makes their fees larger than a dedicated team.'],
          ['A common middle path', 'is a vendor for payments and invoicing with your own entitlements layer that decides what each customer can use.'],
        ],
      },
      {
        type: 'p',
        text: 'Whichever you choose, keep pricing logic in one place and export billing events to your warehouse from the start.',
      },
    ],
  },
];

export const CHIP_EXAMPLES = EXAMPLES.filter(e => e.chip);

export const FALLBACK_TITLES = ['Read the question', 'Look for a scripted example', 'Conclude'];

export function fallbackRun(question) {
  return {
    titles: FALLBACK_TITLES,
    steps: [
      `“${question.length > 90 ? question.slice(0, 88) + '…' : question}”`,
      'This page carries a handful of scripted examples and no model.',
      'Nothing matches, so explain what the demo can show instead.',
    ],
    answer: [
      {
        type: 'p',
        text: 'This is a design demo with no model behind it, so it can’t answer that one. Your question stayed in this tab; nothing was sent anywhere.',
      },
      {
        type: 'p',
        text: 'In the real product this panel would fill with Sagewell’s plan, evidence and checks before the reply. Try one of the scripted questions to watch a full trail unfold.',
      },
    ],
    fallback: true,
  };
}

export function findExample(text) {
  const exact = EXAMPLES.find(e => e.question.toLowerCase() === text.trim().toLowerCase());
  return exact || EXAMPLES.find(e => e.match.test(text)) || null;
}

/* ------------------------------------------------------------------ */
/* Getting started                                                     */
/* ------------------------------------------------------------------ */

// Each terminal line is a list of [tokenType, text] pairs.
export const QUICKSTART = [
  {
    id: 'key',
    title: 'Issue a key',
    body: 'Create a key from the command line, label it for the machine it lives on, and keep it out of your repository.',
    meta: 'sagewell keys',
    file: 'shell — ~/harbour',
    lines: [
      [['c', '# A key is shown once. Put it straight into your secrets manager.']],
      [['p', '$ '], ['t', 'sagewell keys create --label laptop']],
      [['o', 'created  laptop  sw_key_••••••••••••••3f9a']],
      [],
      [['p', '$ '], ['k', 'export'], ['t', ' SAGEWELL_API_KEY='], ['s', '"sw_key_••••3f9a"']],
    ],
  },
  {
    id: 'client',
    title: 'Add the client',
    body: 'Typed clients for TypeScript and Python handle streaming trails, retries and pagination. Plain HTTPS works as well.',
    meta: 'pnpm · uv',
    file: 'shell — ~/harbour',
    lines: [
      [['p', '$ '], ['t', 'pnpm add @sagewell/client']],
      [['o', '+ @sagewell/client 2.1.0']],
      [],
      [['c', '# Python']],
      [['p', '$ '], ['t', 'uv add sagewell']],
      [['g', 'Resolved 1 package in 0.4s']],
    ],
  },
  {
    id: 'ask',
    title: 'Ask with a trail',
    body: 'Choose a model and a depth, ask your question, and read the reply alongside the trail that produced it.',
    meta: 'ask.ts',
    file: 'ask.ts',
    lines: [
      [['k', 'import'], ['t', ' { Sagewell } '], ['k', 'from'], ['s', ' "@sagewell/client"'], ['t', ';']],
      [['k', 'const'], ['t', ' sw = '], ['k', 'new'], ['f', ' Sagewell'], ['t', '();']],
      [['k', 'const'], ['t', ' answer = '], ['k', 'await'], ['t', ' sw.answers.'], ['f', 'create'], ['t', '({']],
      [['t', '  model: '], ['s', '"sagewell-2"'], ['t', ', depth: '], ['s', '"standard"'], ['t', ',']],
      [['t', '  question: '], ['s', '"Is 1,000,003 prime?"'], ['t', ', trail: '], ['k', 'true'], ['t', ',']],
      [['t', '});']],
      [],
      [['p', '$ '], ['t', 'npx tsx ask.ts']],
      [['g', 'Yes. No whole number from 2 up to its square root (about 1,000) divides it.']],
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Playground                                                          */
/* ------------------------------------------------------------------ */

export const MODELS = [
  { id: 'sagewell-2', label: 'sagewell-2', input: 2.5, output: 12, note: 'Full-depth reasoning for questions with consequences.' },
  { id: 'sagewell-2-swift', label: 'sagewell-2-swift', input: 0.3, output: 1.5, note: 'Lighter trails for high-volume, everyday work.' },
];

export const DEPTHS = ['brief', 'standard', 'thorough'];

export const LANGS = [
  { id: 'python', label: 'Python' },
  { id: 'ts', label: 'TypeScript' },
  { id: 'http', label: 'HTTP' },
];

const QUESTION = 'Which of last night’s deploys should we roll back first?';

export function buildCode(lang, model, depth) {
  if (lang === 'python') {
    return `from sagewell import Sagewell

sw = Sagewell()  # uses SAGEWELL_API_KEY

answer = sw.answers.create(
    model="${model}",
    depth="${depth}",
    question="${QUESTION}",
    trail=True,
)

for step in answer.trail:
    print(step.kind, step.summary)

print(answer.text)`;
  }
  if (lang === 'ts') {
    return `import { Sagewell } from "@sagewell/client";

const sw = new Sagewell(); // uses SAGEWELL_API_KEY

const answer = await sw.answers.create({
  model: "${model}",
  depth: "${depth}",
  question: "${QUESTION}",
  trail: true,
});

for (const step of answer.trail) {
  console.log(step.kind, step.summary);
}

console.log(answer.text);`;
  }
  return `curl https://api.sagewell.example/v2/answers \\
  -H "Authorization: Bearer $SAGEWELL_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "depth": "${depth}",
    "question": "${QUESTION}",
    "trail": true
  }'`;
}

export const CAPABILITIES = [
  {
    title: 'Live trails',
    body: 'Plans, evidence and checks arrive as separate events while Sagewell works, so an interface can show real progress.',
    sig: 'on("trail.step", render)',
  },
  {
    title: 'Your own tools',
    body: 'Register lookups, calculators or internal services. Sagewell calls them mid-reasoning and cites what came back.',
    sig: 'tools=[lookup_runbook]',
  },
  {
    title: 'Shaped replies',
    body: 'Hand over a JSON Schema and receive replies that validate against it, ready to store or pass along.',
    sig: 'schema=IncidentSummary',
  },
];

/* ------------------------------------------------------------------ */
/* Research: the four passes                                           */
/* ------------------------------------------------------------------ */

export const PASSES = [
  {
    title: 'Plan',
    line: 'Sets out what would need to be true for an answer to hold.',
    detail: 'Loose terms are pinned down before any searching begins.',
  },
  {
    title: 'Investigate',
    line: 'Collects evidence from your sources and its tools.',
    detail: 'Each claim keeps a pointer back to where it was found.',
  },
  {
    title: 'Cross-check',
    line: 'Tests the draft against the evidence and against itself.',
    detail: 'Contradictions are raised in the open instead of smoothed over.',
  },
  {
    title: 'Conclude',
    line: 'Replies plainly and states how sure it is.',
    detail: 'Whatever would change the conclusion is listed next to it.',
  },
];

/* ------------------------------------------------------------------ */
/* In practice                                                         */
/* ------------------------------------------------------------------ */

export const USE_CASES = [
  {
    id: 'literature',
    label: 'Literature reviews',
    example: 'spacing',
    body: 'Reads across studies, separates strong findings from weak ones, and keeps the citations attached.',
    img: IMG.bay,
    pos: '62% 50%',
  },
  {
    id: 'postmortems',
    label: 'Incident post-mortems',
    example: 'postmortem',
    body: 'Turns scattered notes into a timeline and actions without hunting for someone to blame.',
    img: IMG.storm,
    pos: '45% 40%',
  },
  {
    id: 'policy',
    label: 'Policy comparison',
    example: 'privacy',
    body: 'Lines up rules clause by clause and is explicit about where the law is unsettled.',
    img: IMG.cliffs,
    pos: '40% 50%',
  },
  {
    id: 'strategy',
    label: 'Product strategy',
    example: 'billing',
    body: 'Weighs options against your constraints and names the conditions that would change the call.',
    img: IMG.coastSunset,
    pos: '30% 50%',
  },
];

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

export const REQUEST_STEPS = [1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];

/* ------------------------------------------------------------------ */
/* Journal                                                             */
/* ------------------------------------------------------------------ */

export const NOTES = [
  {
    id: 'introducing',
    date: '2026-09-30',
    dateLabel: '30 Sep 2026',
    read: '3 min read',
    tag: 'Release',
    title: 'Introducing Sagewell 2',
    dek: 'A million-token reading window, adjustable depth, and a swift sibling for routine work.',
    body: [
      'Sagewell 2 can read up to a million tokens in a single request: a year of incident reports, a full contract bundle, or a small codebase. It plans its route through that material before answering, and the trail records which parts it relied on.',
      'Depth is now a setting rather than a guess. Brief suits lookups and rewrites; thorough spends longer cross-checking and is meant for questions where a confident mistake would be expensive.',
      'Alongside it we are introducing sagewell-2-swift, which uses the same trail format at a fraction of the price. Most teams route routine questions to swift and save the full model for the ones that matter.',
    ],
  },
  {
    id: 'reading-trace',
    date: '2026-09-09',
    dateLabel: '9 Sep 2026',
    read: '4 min read',
    tag: 'Guide',
    title: 'Reading a reasoning trace',
    dek: 'Where to look first, and the three patterns that usually mean something went wrong.',
    body: [
      'Start with the plan. If the plan misreads the question, nothing after it can be trusted, and that is the cheapest place to catch a problem.',
      'Next, skim the evidence for gaps rather than errors. A step that should have consulted a source and did not is more common than a source misquoted. Then look at the cross-check: a good one disagrees with the draft at least occasionally.',
      'Three patterns are worth a second look: a conclusion more confident than the cross-check, evidence drawn from a single source, and a plan that quietly changes the question.',
    ],
  },
  {
    id: 'it-depends',
    date: '2026-08-19',
    dateLabel: '19 Aug 2026',
    read: '3 min read',
    tag: 'Essay',
    title: 'When the right answer is “it depends”',
    dek: 'Designing replies that stay useful when the honest answer is conditional.',
    body: [
      '“It depends” is only a dodge when it stops there. Useful conditional answers say what it depends on, which way each condition pushes, and which one matters most.',
      'We shape Sagewell’s replies around that structure: the most likely answer first, then the conditions that would change it, then what the reader could check to settle the question.',
      'When information is missing, such as supplier data that was never shared or a jurisdiction nobody named, Sagewell asks instead of filling the gap with something plausible.',
    ],
  },
];

export const BUILD_OPTIONS = [
  'Research and analysis',
  'Engineering tools',
  'Policy and compliance',
  'Planning and strategy',
  'Something else',
];
