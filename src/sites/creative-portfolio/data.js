// Content for the Ines Morrow portfolio concept. Ines, the collaborators and every project
// below are fictional; the stills are Unsplash photographs used as stand-in frames.

export const FPS = 25;
export const REEL_SECONDS = 60;
export const REEL_FRAMES = FPS * REEL_SECONDS;

export const HEADSHOT = '1714462396046-29272a3cb549';

export const TYPES = ['Commercial', 'Music video', 'Documentary', 'Social'];

// Track colours double as the colour key for each kind of work.
export const TYPE_TONE = {
  Commercial: 'v1',
  'Music video': 'v2',
  Documentary: 'a1',
  Social: 'a2',
};

export const PROJECTS = [
  {
    id: 'neon-hours',
    title: 'Neon Hours',
    type: 'Commercial',
    client: 'OSLO NORTH',
    year: 2026,
    runtime: '00:00:45:00',
    img: '1601042879364-f3947d3f9c16',
    alt: 'A rain-soaked Tokyo side street at night, glowing with shop signs and traffic lights.',
    reel: 'TK_A003_C021',
    seconds: [0, 12],
    role: 'Edit & colour',
    tools: ['DaVinci Resolve', 'After Effects'],
    summary:
      'A 45-second launch film for a rain shell, shot across three wet nights in Tokyo. The job: make a jacket feel like a place you would want to be.',
    breakdown: [
      ['Rhythm', 'I built the cut around the sound of rain on nylon instead of the track, so the music arrives late and lands harder.'],
      ['Colour', 'Cooler shadows, protected skin tones, and the signage left to do the rest. No added glow, only what the lenses caught.'],
      ['Versions', 'A 45-second hero, a 20-second edit and a 6-second bumper, each re-paced on the timeline rather than trimmed from the end.'],
    ],
  },
  {
    id: 'afterglow',
    title: 'Afterglow',
    type: 'Music video',
    client: 'lowtide',
    year: 2025,
    runtime: '00:04:02:10',
    img: '1630769660701-3454835913dc',
    alt: 'A low sports car with glowing headlights parked beneath a red diner sign at dusk.',
    reel: 'AG_B014_C007',
    seconds: [12, 21],
    role: 'Editor',
    tools: ['Premiere Pro', 'DaVinci Resolve'],
    summary:
      'A slow-burn video for a lowtide single, filmed in one car park over two nights. Most of the drama lives in the reflections on the paintwork.',
    breakdown: [
      ['Structure', 'Three passes of the same drive, cut together like verses, each one a little closer and a little brighter than the last.'],
      ['Matching', 'I balanced the highlights on the bodywork shot by shot, so the colour of the car never jumps between takes.'],
      ['Deliverables', 'Album master, a vertical teaser and four short loops for streaming platforms.'],
    ],
  },
  {
    id: 'grandfathers-hands',
    title: 'Grandfather’s Hands',
    type: 'Documentary',
    client: 'The Weekend Review',
    year: 2025,
    runtime: '00:18:36:00',
    img: '1683796491683-9e7aad6a0a5e',
    alt: 'An older man with a white beard adjusting his glasses against a dark background.',
    reel: 'GH_R04',
    seconds: [21, 33],
    role: 'Editor & colourist',
    tools: ['DaVinci Resolve', 'Premiere Pro'],
    summary:
      'A short documentary about a retired cabinet maker who still opens his workshop every morning. Nine hours of conversation became eighteen quiet minutes.',
    breakdown: [
      ['Paper edit', 'I transcribed every interview first and shaped the story on index cards before opening the timeline.'],
      ['Pacing', 'The long pauses stayed in. He thinks before he speaks, and the film gives him the time to.'],
      ['Finish', 'A gentle, filmic grade that keeps the sawdust and the texture of his skin, with subtitle files in three languages.'],
    ],
  },
  {
    id: 'coastline',
    title: 'Coastline',
    type: 'Commercial',
    client: 'HALDEN & CO',
    year: 2026,
    runtime: '00:00:30:00',
    img: '1559627755-42212e5c5fdf',
    alt: 'Aerial view of a lone surfer paddling beside a breaking turquoise wave.',
    reel: 'CL_DR02_0118',
    seconds: [33, 42],
    role: 'Edit & colour',
    tools: ['DaVinci Resolve', 'After Effects'],
    summary:
      'A 30-second spot for a sun-care brand, assembled from a week of drone and water footage. The brief asked for summer without a single beach towel.',
    breakdown: [
      ['Selects', 'I kept only the moments where light breaks through the water, which turned six hours of footage into forty usable seconds.'],
      ['Sound', 'The mix is rebuilt from underwater recordings, so even the overhead shots feel close and physical.'],
      ['Colour', 'The turquoise is held back a touch, so skin and foam still read cleanly on a phone screen.'],
    ],
  },
  {
    id: 'backstreet-bloom',
    title: 'Backstreet Bloom',
    type: 'Social',
    client: 'Studio Fjeld',
    year: 2026,
    runtime: '8 × 00:00:12:00',
    img: '1599060052009-24d6d0b0161c',
    alt: 'A motorbike waiting in a narrow alley lit by warm lamps and green neon.',
    reel: 'BB_SOC_014',
    seconds: [42, 51],
    role: 'Editor',
    tools: ['Premiere Pro', 'After Effects'],
    summary:
      'Eight vertical shorts for a florist’s evening delivery launch, cut from a single night of street footage. Every one of them had to work on mute.',
    breakdown: [
      ['Openers', 'Each short starts mid-movement, so the very first frame already feels like the middle of a story.'],
      ['Type', 'Captions are designed as part of the composition and sized to stay clear of thumbs and phone notches.'],
      ['Handover', 'A tidy master project with templates, so the in-house team can make new versions without me.'],
    ],
  },
  {
    id: 'ocean-avenue',
    title: 'Ocean Avenue',
    type: 'Music video',
    client: 'Paper Kite Films',
    year: 2024,
    runtime: '00:03:27:16',
    img: '1533106497176-45ae19e68ba2',
    alt: 'Pastel art deco hotels glowing pink and teal along a palm-lined street at night.',
    reel: 'OA_C006_C091',
    seconds: [51, 60],
    role: 'Editor & colourist',
    tools: ['DaVinci Resolve', 'Premiere Pro'],
    summary:
      'A night-time performance film shot on a single block of pastel hotels. I cut it like a slow walk past every lit window.',
    breakdown: [
      ['Multicam', 'Four cameras synced into one angle view, so each chorus could be cut live first and refined frame by frame after.'],
      ['Look', 'Leaned into the pink and teal of the signage while keeping the blacks deep and clean.'],
      ['Formats', 'A streaming master plus a 4:5 version that is re-framed shot by shot, not simply cropped.'],
    ],
  },
];

export const CLIENTS = [
  { name: 'OSLO NORTH', style: 'wide' },
  { name: 'Paper Kite Films', style: 'serif' },
  { name: 'HALDEN & CO', style: 'condensed' },
  { name: 'Studio Fjeld', style: 'mono' },
  { name: 'lowtide', style: 'heavy' },
  { name: 'The Weekend Review', style: 'news' },
];

export const STEPS = [
  {
    id: 'log',
    name: 'Log & sync',
    line: 'Every frame, labelled.',
    body: 'I sync the sound, tag every take and pull selects into bins, so the first cut starts from everything you shot rather than whatever I happen to remember.',
    days: 'Days 1–2',
  },
  {
    id: 'story',
    name: 'Story cut',
    line: 'Structure before style.',
    body: 'Scenes find their order, the shape of the piece appears and the music bed gets chosen. You review it with frame-accurate comments.',
    days: 'Days 3–6',
  },
  {
    id: 'lock',
    name: 'Picture lock',
    line: 'Nothing moves after this.',
    body: 'Every cut point is trimmed to the frame, titles are placed, and we agree together that the edit is done before anything goes to finishing.',
    days: 'Days 7–9',
  },
  {
    id: 'finish',
    name: 'Finish',
    line: 'Colour and sound, together.',
    body: 'One consistent grade across every shot, clean dialogue, music and effects balanced for where it will be watched, then delivered in every size you need.',
    days: 'Days 10–12',
  },
];

// Clip layouts for the process timeline. Units: 0–100 across the visible sequence (1 unit = 2 s).
// A clip missing from a step is not on the timeline at that stage.
export const SEQ_CLIPS = [
  { id: 'title', track: 'V2', label: 'TITLE_A', at: { story: [0, 9], lock: [0, 7], finish: [0, 7] } },
  { id: 'br12', track: 'V2', label: 'CUTAWAY_12', img: 1, at: { log: [12, 44], story: [12, 28], lock: [9, 21], finish: [9, 21] } },
  { id: 'br19', track: 'V2', label: 'CUTAWAY_19', img: 5, at: { log: [60, 90], story: [46, 58], lock: [38, 48], finish: [38, 48] } },
  { id: 'inta', track: 'V1', label: 'SC03_TK2', img: 0, at: { log: [0, 30], story: [0, 22], lock: [0, 18], finish: [0, 18] } },
  { id: 'br07', track: 'V1', label: 'SC05_TK1', img: 3, at: { log: [31, 58], story: [22, 40], lock: [18, 33], finish: [18, 33] } },
  { id: 'intb', track: 'V1', label: 'SC07_TK4', img: 4, at: { log: [60, 96], story: [41, 66], lock: [33, 54], finish: [33, 54] } },
  { id: 'vo3', track: 'A1', label: 'DIAL_03', seed: 3, at: { log: [0, 40], story: [0, 21], lock: [0, 17], finish: [0, 17] } },
  { id: 'sfx', track: 'A1', label: 'FX_RAIN', seed: 9, at: { finish: [20, 28] } },
  { id: 'vo5', track: 'A1', label: 'DIAL_05', seed: 5, at: { log: [44, 92], story: [41, 64], lock: [34, 52], finish: [34, 52] } },
  { id: 'music', track: 'A2', label: 'SCORE_v2', seed: 7, at: { log: [0, 98], story: [0, 68], lock: [0, 56], finish: [0, 56] } },
];

export const SEQ_NAME = 'NEON_HOURS';
export const SEQ_END = { log: 98, story: 68, lock: 56, finish: 56 };
export const SEQ_TRANSITIONS = { lock: [18, 33], finish: [18, 33] };
export const SEQ_PLAYHEAD = { log: 47, story: 33, lock: 26, finish: 26 };

export const SERVICES = [
  {
    id: 'campaign',
    name: 'Campaign films',
    turnaround: '3–4 weeks',
    from: '€3,200',
    range: '€3,200 – €8,000',
    type: 'Campaign',
    body: 'Hero films and every cut-down that follows, from the first assembly to the final export. I can join early to help plan coverage, or start the day the drives arrive.',
    deliverables: ['ProRes 4444 master plus review copies', '20, 10 and 6-second versions', 'Separate dialogue, music and effects stems'],
  },
  {
    id: 'music',
    name: 'Music videos',
    turnaround: '8–12 days',
    from: '€1,900',
    range: '€1,900 – €4,500',
    type: 'Music video',
    body: 'Performance, story or somewhere in between. Cut to the bar, graded to match the artwork and delivered before release day.',
    deliverables: ['4K master and a clean version without titles', 'Vertical teaser and short loops', 'Stills pulled straight from the grade'],
  },
  {
    id: 'docs',
    name: 'Documentary',
    turnaround: '5–10 weeks',
    from: '€7,000',
    range: '€7,000 – €20,000',
    type: 'Documentary',
    body: 'Interview-led shorts and series: transcripts, paper edit, structure and picture lock, with an online conform when the film moves to finishing.',
    deliverables: ['Locked cut with XML or AAF', 'Online conform and finishing', 'Subtitle files in the languages you need'],
  },
  {
    id: 'social',
    name: 'Social versions',
    turnaround: '2–4 days',
    from: '€520',
    range: '€520 – €1,600 per set',
    type: 'Social',
    body: 'Vertical, square and 4:5 edits built for the feed, with a strong first second and captions designed to work with the sound off.',
    deliverables: ['9:16, 1:1 and 4:5 exports', 'Designed captions plus SRT files', 'A reusable template project'],
  },
  {
    id: 'finishing',
    name: 'Colour & finishing',
    turnaround: '2–4 days',
    from: '€780 / day',
    range: '€780 per day',
    type: 'Finishing only',
    body: 'Grading for films cut elsewhere: look development from your references, shot matching and a clean final master.',
    deliverables: ['Graded master in your delivery spec', 'Show LUT and grading notes', 'Before and after stills'],
  },
];

export const PROJECT_TYPES = ['Campaign', 'Music video', 'Documentary', 'Social', 'Finishing only'];

export const BUDGETS = ['Below €2,500', '€2,500 – €6,000', '€6,000 – €12,000', 'Above €12,000', 'Still deciding'];

export const EMAIL = 'studio@inesmorrow.film';

export const NAV = [
  { id: 'index', label: 'Index' },
  { id: 'process', label: 'Process' },
  { id: 'reel', label: 'Reel' },
  { id: 'studio', label: 'Studio' },
  { id: 'contact', label: 'Contact' },
];
