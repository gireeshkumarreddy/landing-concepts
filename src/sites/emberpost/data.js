// Sample data for the Emberpost concept. Every person, company, address and number here is
// invented demo content; nothing is sent or stored anywhere.

/* ---------------------------------------------------------------- people */
// `photo` is an Unsplash id (the part after "photo-"). Without one we render initials.
export const PEOPLE = {
  you: { name: 'You', full: 'Ines Duarte', initials: 'ID', letter: 'I', tone: 'ink' },
  maya: { name: 'Maya Chen', photo: '1655249493799-9cee4fe983bb', role: 'Marketing' },
  oliver: { name: 'Oliver Grant', photo: '1771898343647-bd979ad8cca5', role: 'Operations' },
  kofi: { name: 'Kofi Mensah', photo: '1628619488538-f4ce88739f56', role: 'Web & shop' },
  sofia: { name: 'Sofia Reyes', photo: '1609436132311-e4b0c9370469', role: 'Packaging designer' },
  marcus: { name: 'Marcus Bell', photo: '1507003211169-0a1dd7228f2d', role: 'Launch producer' },
  amara: { name: 'Amara Osei', photo: '1701728667207-54b43dbdab97', role: 'Photographer' },
  theo: { name: 'Theo Lindqvist', photo: '1758874383973-83166565759c', role: 'Supplier accounts' },
  nora: { name: 'Nora Fitzgerald', photo: '1780733058027-680a7c841fe5', role: 'Trademark lawyer' },
  elin: { name: 'Elin Sandberg', photo: '1764971591006-b6eb67a8f0cb', role: 'Radio host' },
  rosa: { name: 'Rosa Vidal', initials: 'R', tone: 'violet', role: 'Venue coordinator' },
  tomas: { name: 'Tomás Herrera', photo: '1500648767791-00dcc994a43e', role: 'Accountant' },
  lena: { name: 'Lena Hartmann', photo: '1494790108377-be9c29b29330', role: 'Event florist' },
  yusuf: { name: 'Yusuf Kaya', photo: '1758874574397-e56dfcfc116d', role: 'Ceramics supplier' },
  camille: { name: 'Camille Dubois', photo: '1609371497456-3a55a205d5eb', role: 'Copy editor' },
  jonas: { name: 'Jonas Weber', photo: '1592234789031-94bf65f630ed', role: 'Freelance developer' },
  ruby: { name: 'Ruby Okafor', photo: '1623717217554-72ca676de535', role: 'Community lead' },
  billing: { name: 'Billing', initials: 'B', service: true },
  calendar: { name: 'Calendar', initials: 'C', service: true },
  status: { name: 'Status alerts', initials: 'S', service: true },
  release: { name: 'Release notes', initials: 'R', service: true },
};

export const initialsOf = p => p.initials || p.name.split(' ').map(w => w[0]).join('').slice(0, 2);

/* ---------------------------------------------------------------- inbox demo */
export const GROUPS = [
  { id: 'teammates', label: 'Teammates', short: 'Teammates' },
  { id: 'people', label: 'People', short: 'People' },
  { id: 'notifications', label: 'Notifications', short: 'Notifications' },
];

// The demo is set on Saturday 14 March 2026 at Halden Supply, a small outdoor-goods brand
// preparing its spring launch. Messages are oldest first.
export const CONVERSATIONS = [
  {
    id: 'maya', group: 'teammates', person: 'maya', unread: 0,
    subject: 'Launch newsletter copy',
    cc: ['oliver'],
    messages: [
      { from: 'maya', at: '12 Mar 2026, 16:40', body: 'First pass of the launch newsletter is in the doc: a short intro, three products and one button.' },
      { from: 'you', at: '12 Mar 2026, 17:15', body: 'Good start. Can the pop-up date go in the very first line?' },
      { from: 'maya', at: '14 Mar 2026, 08:55', body: 'Moved it up and trimmed the sign-off. Ready for a final read whenever you have a minute.' },
    ],
  },
  {
    id: 'oliver', group: 'teammates', person: 'oliver', unread: 0,
    subject: 'Warehouse stock count',
    cc: [],
    messages: [
      { from: 'oliver', at: '11 Mar 2026, 09:30', body: 'Stock count is done. We are short on the large canvas tote and the trail bottle.' },
      { from: 'oliver', at: '14 Mar 2026, 08:20', body: 'The reorder for both is drafted and ready to go. Shall I place it today?' },
    ],
  },
  {
    id: 'kofi', group: 'teammates', person: 'kofi', unread: 1,
    subject: 'Shop update before launch',
    cc: ['maya'],
    messages: [
      { from: 'kofi', at: '12 Mar 2026, 13:10', body: 'The new product pages are on staging. Checkout is untouched.' },
      { from: 'kofi', at: '14 Mar 2026, 07:45', body: 'Quick check: should the spring bundle sit on the homepage, or only in the newsletter?' },
    ],
  },
  {
    id: 'sofia', group: 'people', person: 'sofia', unread: 2,
    subject: 'Thursday packaging review',
    cc: ['maya'],
    messages: [
      { from: 'you', at: '12 Mar 2026, 15:00', body: 'Booked Thursday at 4 pm for the packaging review. I’ll bring the first printed samples.' },
      { from: 'sofia', at: '13 Mar 2026, 17:48', body: 'Great. The printer is running a second set with the warmer label colour.' },
      { from: 'sofia', at: '13 Mar 2026, 22:14', body: 'Could we move Thursday’s review to the morning? The printer can only deliver the new samples before noon.' },
    ],
  },
  {
    id: 'marcus', group: 'people', person: 'marcus', unread: 0,
    subject: 'Draft budget for the spring launch',
    cc: ['amara', 'maya', 'rosa'],
    messages: [
      { from: 'marcus', at: '9 Mar 2026, 16:05', body: 'Kicking off the launch budget. I’ve split it into content, paid social and the pop-up, with rough numbers in the sheet.' },
      { from: 'you', at: '10 Mar 2026, 10:12', body: 'Thanks Marcus. Can we cap paid social at a third of the total and move the rest to the pop-up?' },
      { from: 'amara', at: '11 Mar 2026, 14:30', body: 'If we shoot both pop-up days back to back I can bring the photography quote down.' },
      { from: 'you', at: '12 Mar 2026, 18:22', body: 'Love that. Marcus, could you fold Amara’s quote in and send a clean draft?' },
      { from: 'marcus', at: '14 Mar 2026, 09:40', body: 'Morning Ines, the draft budget is attached with Amara’s quote folded in. Paid social is now 30% and the pop-up has a small buffer for the venue. Could you sign it off by Tuesday so Rosa can hold the space?' },
    ],
  },
  {
    id: 'amara', group: 'people', person: 'amara', unread: 0,
    subject: 'Pop-up shoot dates',
    cc: ['marcus'],
    messages: [
      { from: 'amara', at: '12 Mar 2026, 11:00', body: 'Both 27 and 28 March work for me. I’ll hold them until Monday.' },
      { from: 'you', at: '12 Mar 2026, 11:40', body: 'Perfect, please hold both. The venue should confirm early next week.' },
    ],
  },
  {
    id: 'theo', group: 'people', person: 'theo', unread: 3,
    subject: 'Revised supplier contract',
    cc: ['oliver'],
    messages: [
      { from: 'theo', at: '13 Mar 2026, 11:20', body: 'Our legal team went through the supply agreement. Mostly fine, two clauses to tidy.' },
      { from: 'theo', at: '13 Mar 2026, 16:02', body: 'I’ve marked every change in the PDF so you can see them at a glance.' },
      { from: 'theo', at: '13 Mar 2026, 23:05', body: 'Sent the revised contract, two small changes on page 3: the delivery window and the late fee. Everything else is as agreed.' },
    ],
  },
  {
    id: 'billing', group: 'notifications', person: 'billing', unread: 0,
    subject: 'Your March statement',
    cc: [],
    messages: [
      { from: 'billing', at: '14 Mar 2026, 06:00', body: 'Your workspace renews on 1 April. This month comes to $48.00 and nothing needs doing.' },
    ],
  },
  {
    id: 'calendar', group: 'notifications', person: 'calendar', unread: 0,
    subject: 'Venue walkthrough on Monday',
    cc: [],
    messages: [
      { from: 'calendar', at: '13 Mar 2026, 18:00', body: 'Venue walkthrough with Marcus Bell and Rosa Vidal, Monday 16 March at 11:00, 18 Canal Row.' },
    ],
  },
  {
    id: 'status', group: 'notifications', person: 'status', unread: 0,
    subject: 'Resolved: delayed mail sync',
    cc: [],
    messages: [
      { from: 'status', at: '13 Mar 2026, 08:31', body: 'Mail sync was delayed for about twelve minutes this morning. Everything has caught up.' },
    ],
  },
  {
    id: 'release', group: 'notifications', person: 'release', unread: 0,
    subject: 'What changed this week',
    cc: [],
    messages: [
      { from: 'release', at: '12 Mar 2026, 09:00', body: 'Lanes can now be reordered, and nudges remember the time you picked last.' },
    ],
  },
];

// Canned drafts for “Draft a reply”. Written to fit each conversation.
export const SUGGESTED = {
  maya: 'Reads beautifully. Let’s schedule it for Tuesday at 8:00, right before the pop-up announcement.',
  oliver: 'Yes please, place the reorder today. Let’s add ten extra totes for the pop-up.',
  kofi: 'Homepage and newsletter both, please. The bundle is the main thing we want people to see.',
  sofia: 'Morning works for me. How about 10:00 on Thursday? I’ll move the room booking.',
  marcus: 'Thanks Marcus, this looks right. Signing it off now. Please go ahead and ask Rosa to hold the venue for both days.',
  amara: 'Thank you for holding both days. I’ll confirm the moment the venue does.',
  theo: 'Thanks Theo. Both changes look fine to me. I’ll sign and send it back on Monday.',
  billing: 'Thanks, noted.',
  calendar: 'Accept.',
  status: 'Thanks for the update.',
  release: 'Thanks, nice changes.',
};

// Incoming demo notifications (only while the hero is visible). Capped at this list's length.
export const INCOMING = [
  { convo: 'amara', body: 'Holding 27 and 28 March. I’ll send the shot list on Monday.' },
  { convo: 'oliver', body: 'Supplier confirmed the reorder ships on Wednesday.' },
  { convo: 'status', body: 'Planned maintenance tonight, 01:00–01:20 UTC. Nothing for you to do.' },
  { convo: 'sofia', body: 'The printer can do Thursday morning. Is 10:00 good for you?' },
  { convo: 'maya', body: 'Newsletter is scheduled for Tuesday at 08:00. Preview link is in the doc.' },
];

// The two cards that sit on the window in the hero composition. Times match the last message of
// each thread (Friday evening; the demo is set on Saturday morning), in the page's 24-hour style.
export const SEED_CARDS = {
  left: { key: 'seed-sofia', convo: 'sofia', time: 'Fri 22:14', body: 'Could we move Thursday’s review to the morning?' },
  right: { key: 'seed-theo', convo: 'theo', time: 'Fri 23:05', body: 'Sent the revised contract, two small changes on page 3…' },
};

/* ---------------------------------------------------------------- by person, not by time */
// Newest first. The rows that are also hero threads carry the same day as the inbox and Lanes.
export const CLASSIC_ROWS = [
  { id: 'c1', who: 'marcus', subject: 'Draft budget for the spring launch', time: '09:40' },
  { id: 'c2', who: 'theo', subject: 'Revised supplier contract', time: 'Fri' },
  { id: 'c3', who: 'sofia', subject: 'Thursday packaging review', time: 'Fri' },
  { id: 'c4', who: 'marcus', subject: 'Pop-up venue shortlist', time: 'Fri' },
  { id: 'c5', who: 'sofia', subject: 'Second round of label samples', time: 'Fri' },
  { id: 'c6', who: 'theo', subject: 'Delivery window for April', time: 'Thu' },
  { id: 'c7', who: 'marcus', subject: 'Launch timeline, version 3', time: 'Wed' },
  { id: 'c8', who: 'sofia', subject: 'Label colours: final pick', time: 'Tue' },
];
export const PEOPLE_CARDS = ['marcus', 'sofia', 'theo'];

/* ---------------------------------------------------------------- tools */
export const SCREENER = [
  { id: 's1', person: 'nora', email: 'nora@fitzgerald-law.example', subject: 'Trademark search for the spring range' },
  { id: 's2', name: 'Growth Weekly', email: 'news@growthweekly.example', subject: 'Nine tricks to triple your open rate' },
  { id: 's3', person: 'elin', email: 'elin@slowcraft.example', subject: 'Guest spot on Slow Craft Radio?' },
  { id: 's4', name: 'Flash Deals', email: 'offers@flashdeals.example', subject: 'Final hours: half price on everything' },
];

export const LANES = {
  teammates: [
    { who: 'maya', text: 'Launch newsletter copy', time: '08:55' },
    { who: 'oliver', text: 'Warehouse stock count', time: '08:20' },
    { who: 'kofi', text: 'Shop update before launch', time: '07:45' },
  ],
  people: [
    { who: 'marcus', text: 'Draft budget for the spring launch', time: '09:40' },
    { who: 'theo', text: 'Revised supplier contract', time: 'Fri' },
    { who: 'sofia', text: 'Thursday packaging review', time: 'Fri' },
    { who: 'amara', text: 'Pop-up shoot dates', time: 'Thu' },
  ],
  notifications: [
    { who: 'billing', text: 'Your March statement', time: '06:00' },
    { who: 'calendar', text: 'Venue walkthrough on Monday', time: 'Fri' },
    { who: 'status', text: 'Resolved: delayed mail sync', time: 'Fri' },
    { who: 'release', text: 'What changed this week', time: 'Thu' },
  ],
};

export const NUDGE_PRESETS = [
  { id: 'evening', label: 'This evening', pill: 'Today, 18:00' },
  { id: 'monday', label: 'Monday 9:00', pill: 'Mon 16 Mar, 09:00' },
  { id: 'custom', label: 'Pick a time', pill: null },
];

export const KEYCAPS = [
  { key: 'j', cap: 'J', action: 'Next person' },
  { key: 'k', cap: 'K', action: 'Previous person' },
  { key: 'e', cap: 'E', action: 'Mark done' },
  { key: 'r', cap: 'R', action: 'Reply' },
  { key: 'h', cap: 'H', action: 'Nudge me later' },
  { key: '/', cap: '/', action: 'Search people' },
];

/* ---------------------------------------------------------------- workflows */
export const WORKFLOWS = [
  {
    id: 'studio',
    title: 'Studio founder',
    who: 'A three-person design studio taking on its first retainer clients',
    before: 'Client replies buried under tool alerts and receipts',
    after: 'Clients pinned in People, tool alerts batched into one lane',
    metric: { from: '50 min', to: '20 min', label: 'first inbox pass of the day' },
    steps: [
      { title: 'Hold new senders', body: 'Cold pitches wait in the Screener until a quick look-through on Friday.' },
      { title: 'Pin current clients', body: 'Every active client sits at the top of People, latest message first.' },
      { title: 'Nudge every proposal', body: 'Each proposal carries a nudge, so silence brings it back after three days.' },
    ],
  },
  {
    id: 'services',
    title: 'Client services',
    who: 'An account team looking after eight ongoing clients',
    before: 'One client’s feedback split across many reply chains',
    after: 'One conversation per client contact, every subject inside it',
    metric: { from: '7 threads', to: '1 conversation', label: 'per client contact' },
    steps: [
      { title: 'One card per contact', body: 'Whatever subject line a client uses, it lands in the same conversation.' },
      { title: 'Shared history', body: 'Teammates read the same history, so nobody forwards long chains to catch up.' },
      { title: 'Done means done', body: 'Mark a request done. It reopens by itself when the client writes again.' },
    ],
  },
  {
    id: 'hiring',
    title: 'Hiring loop',
    who: 'A team lead hiring for two roles at once',
    before: 'Candidate replies mixed in with job-board digests',
    after: 'Digests in Notifications, candidates in People',
    metric: { from: '4 tools', to: '1 inbox', label: 'to follow every candidate' },
    steps: [
      { title: 'Quiet the job boards', body: 'Board digests go to the Notifications lane and never ping.' },
      { title: 'A card per candidate', body: 'Scheduling, take-home tasks and offers stay in one conversation.' },
      { title: 'Keys, not clicks', body: 'J and K to move, R to reply, E to mark done, all from the keyboard.' },
    ],
  },
];

/* ---------------------------------------------------------------- manifesto */
export const PRINCIPLES = [
  { n: '01', title: 'People first', body: 'Every message is filed under the human who sent it, so context is one glance away instead of one search away.' },
  { n: '02', title: 'Quiet by default', body: 'Receipts and alerts wait in their own lane. Nothing asks for your attention unless a person is waiting.' },
  { n: '03', title: 'Private by design', body: 'Your mail is never used to train models or to target ads, and you can export all of it whenever you like.' },
];

export const TEAM_SIZES = ['Only me', '2–10 people', '11–50 people', '51–200 people', 'More than 200'];
export const CLIENTS = ['Gmail', 'Outlook', 'Apple Mail', 'Something else'];

/* ---------------------------------------------------------------- people wall */
// Columns hang from the top edge. `drop` = how much of the faded top card shows (px at desktop),
// `speed` = parallax drift factor. Outer columns are longer so the centre stays clear for the copy.
export const WALL = [
  { drop: 104, speed: 0.55, people: ['tomas', 'maya'] },
  { drop: 46, speed: 1, people: ['lena', 'marcus'] },
  { drop: 112, speed: 0.35, people: ['yusuf'] },
  { drop: 54, speed: 0.85, people: ['sofia'] },
  { drop: 92, speed: 0.5, people: ['oliver'] },
  { drop: 40, speed: 1.05, people: ['camille'] },
  { drop: 108, speed: 0.4, people: ['theo'] },
  { drop: 50, speed: 0.9, people: ['amara'] },
  { drop: 100, speed: 0.6, people: ['jonas', 'nora'] },
  { drop: 58, speed: 0.95, people: ['ruby', 'elin'] },
];
