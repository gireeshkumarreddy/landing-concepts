// Content for the Maren Holt concept page.
// Maren Holt is a fictional developmental editor. Every essay, service outline, checklist and
// workshop below is original sample content written for this portfolio concept.

export const NAV = [
  { id: 'essays', label: 'Essays' },
  { id: 'services', label: 'Services' },
  { id: 'workshops', label: 'Workshops' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export const CATEGORIES = ['All', 'Structure', 'Revision', 'Publishing', 'Writing life'];

// Unsplash photo ids (the part after "photo-"). `fpY` / `fpX` set the focal point for crops.
export const PHOTOS = {
  mic: { id: '1478737270239-2f02b77fc618', fpY: 0.5, alt: 'A studio microphone in a dark recording room' },
  spines: { id: '1524401597352-ec4463663233', fpY: 0.45, alt: 'A row of worn cloth book spines in warm colours' },
  sunset: { id: '1783124759365-d42501a56513', fpY: 0.58, alt: 'Two figures silhouetted against a sunset over the sea' },
  shelf: { id: '1529473814998-077b4fec6770', fpY: 0.5, alt: 'A bookshelf arranged by colour, from red to green' },
  typewriter: { id: '1570626742839-59acd9822944', fpY: 0.5, alt: 'An orange typewriter with a sheet of paper on a small round table' },
  window: { id: '1772920908288-2bff379e8387', fpY: 0.55, alt: 'A typewriter on a desk beside a curtained window, in black and white' },
  notebook: { id: '1512284125381-bdb1f3a77338', fpY: 0.62, alt: 'An open notebook with a coffee ring on a dark wooden desk' },
  leather: { id: '1683234805020-8a7d3116736b', fpY: 0.4, alt: 'Old leather-bound books standing on a shelf' },
};

const RAW_ESSAYS = [
  {
    slug: 'three-passes',
    title: 'Revision in three passes',
    overlay: { title: 'Three passes', script: 'a revision method' },
    category: 'Revision',
    photo: 'mic',
    topics: ['revision', 'editing plan', 'line edits', 'pace'],
    dek: 'Trying to fix everything at once is why revision feels endless. Split the work into passes and each one becomes finite.',
    quoteAfter: 2,
    quote: 'Fix the house before you choose the curtains.',
    sections: [
      {
        h: 'Pass one: the shape',
        p: [
          'Read the whole draft without changing a sentence. List what happens in each chapter and mark the places your own attention drifted.',
          'This pass is about order, purpose and pace. Nothing else is allowed to distract you.',
        ],
      },
      {
        h: 'Pass two: the scenes',
        p: [
          'Now work chapter by chapter. Does each scene begin late enough and finish early enough? Does something change inside it? Merge or rewrite the scenes that only repeat what the reader already knows.',
        ],
      },
      {
        h: 'Pass three: the sentences',
        p: [
          'Only now polish the prose. Line edits made earlier are often wasted, because the paragraphs they improved disappear in the first two passes.',
        ],
      },
      {
        h: 'Write the brief before each pass',
        p: [
          'Before you begin a pass, write three or four questions it has to answer. Stop when they are answered, even if you are tempted to keep tinkering.',
        ],
      },
    ],
  },
  {
    slug: 'opening-question',
    title: 'Why your opening needs a question, not an answer',
    category: 'Structure',
    photo: 'spines',
    topics: ['openings', 'first page', 'curiosity', 'hooks'],
    dek: 'Openings that explain everything ask the reader to wait. Openings that raise a question give them a reason to keep going.',
    quoteAfter: 2,
    quote: 'Curiosity is the reader’s fuel. Don’t spend it all on page one.',
    sections: [
      {
        h: 'Answers close doors',
        p: [
          'An opening that sets out the place, the stakes and the backstory can feel generous, but it takes away the reader’s main job: wondering. Leave them something to work out.',
        ],
      },
      {
        h: 'Make the question concrete',
        p: [
          '“Will she be happy?” is too vague to pull anyone forward. “Why has she packed only one shoe?” is small, specific and hard to ignore. Small questions often carry the large ones inside them.',
        ],
      },
      {
        h: 'Answer something, then ask something bigger',
        p: [
          'Readers trust a book that keeps its promises. Settle one small question within the first chapter, and let that answer open a larger one.',
        ],
      },
      {
        h: 'Test page one on its own',
        p: [
          'Give a friend only the first page and ask what they want to know next. If they can’t name anything, the page is explaining when it should be inviting.',
        ],
      },
    ],
  },
  {
    slug: 'days-you-cant',
    title: 'Writing on the days you can’t',
    category: 'Writing life',
    photo: 'sunset',
    topics: ['routine', 'low energy', 'habits', 'rest'],
    dek: 'Some days the words won’t come. There is still useful work that keeps the book alive until they do.',
    quoteAfter: 2,
    quote: 'A small touch on a bad day keeps the draft warm for a good one.',
    sections: [
      {
        h: 'Lower the bar on purpose',
        p: [
          'Choose a target so small it feels silly: one paragraph, ten minutes, a single sentence rewritten. Starting is the hard part, and a tiny target makes starting possible.',
        ],
      },
      {
        h: 'Do the work that isn’t drafting',
        p: [
          'Reread yesterday’s pages, tidy your notes, sketch the next scene as a list. These jobs move the book forward without asking for fresh invention.',
        ],
      },
      {
        h: 'Change the setting',
        p: [
          'Try a different room, a notebook instead of a laptop, or a walk with a voice memo. A new setting often loosens what the usual one has locked.',
        ],
      },
      {
        h: 'Know when to stop',
        p: [
          'Rest is not failure. If you are ill, grieving or worn out, the kindest editorial decision is to set the book down and come back when you can.',
        ],
      },
    ],
  },
  {
    slug: 'editorial-letter',
    title: 'What a good editorial letter looks like',
    category: 'Revision',
    photo: 'typewriter',
    topics: ['feedback', 'editor', 'notes', 'priorities'],
    dek: 'An editorial letter should leave you clear and energised about what to do next — not flattened by a list of faults.',
    quoteAfter: 2,
    quote: 'The best notes describe the book you were trying to write, then show you the gap.',
    sections: [
      {
        h: 'It starts with what the book is',
        p: [
          'A strong letter opens by describing the book at its best: what it is about, who it is for and what it is reaching for. You should recognise your own ambition in that paragraph.',
        ],
      },
      {
        h: 'It ranks the problems',
        p: [
          'Not every note matters equally. A useful letter separates the two or three structural issues from the smaller ones, so you know where your energy should go.',
        ],
      },
      {
        h: 'It explains why, not just what',
        p: [
          '“The middle drags” is an observation. “The middle drags because the central question is settled in chapter nine” is something you can act on.',
        ],
      },
      {
        h: 'It leaves room for your solution',
        p: [
          'A good editor suggests possibilities rather than rewriting the book. The fix should still sound like you, even when the diagnosis came from someone else.',
        ],
      },
      {
        h: 'Read it twice, a week apart',
        p: ['The first reading is emotional; the second is practical. Give it a few days before deciding which notes to take.'],
      },
    ],
  },
  {
    slug: 'next-book-notebook',
    title: 'Keep a notebook for the next book',
    category: 'Writing life',
    photo: 'notebook',
    topics: ['ideas', 'notebook', 'focus', 'habits'],
    dek: 'Ideas for the next project tend to arrive mid-draft. Give them somewhere to go so they stop pulling you away.',
    quoteAfter: 2,
    quote: 'Write it down, close the notebook, return to the book in front of you.',
    sections: [
      {
        h: 'Capture, don’t chase',
        p: ['When a new idea interrupts, write two or three lines about it and stop. The aim is to keep it safe, not to develop it today.'],
      },
      {
        h: 'Date every entry',
        p: [
          'A date turns scattered notes into a record. Months later you can see which ideas kept returning — a good sign they deserve a book of their own.',
        ],
      },
      {
        h: 'Review it between drafts',
        p: ['Read the notebook when a draft is finished, not while one is under way. New ideas are most useful when there is room to act on them.'],
      },
      {
        h: 'Let some ideas go',
        p: [
          'Not every note is a book. Many are a scene, a character or a single line that belongs somewhere else, and that is still worth keeping.',
        ],
      },
    ],
  },
  {
    slug: 'synopsis-map',
    title: 'A synopsis is a map, not a summary',
    category: 'Publishing',
    photo: 'shelf',
    topics: ['synopsis', 'submissions', 'plot', 'ending'],
    dek: 'A synopsis doesn’t need every subplot. It needs to show the story has a shape — and that you know where it ends.',
    quoteAfter: 2,
    quote: 'Name the turning points. Leave the scenery out.',
    sections: [
      {
        h: 'Lead with the person and the problem',
        p: ['Open with who the story follows and what disrupts their life. One paragraph is enough to start the engine.'],
      },
      {
        h: 'Follow the turns, not the events',
        p: [
          'List the moments where the direction of the story changes and build the synopsis around them. Whatever happens in between can usually shrink to a clause.',
        ],
      },
      {
        h: 'Give away the ending',
        p: [
          'Unlike jacket copy, a synopsis reveals how the book ends. The people reading it want proof that the story lands, not a cliffhanger.',
        ],
      },
      {
        h: 'Write it plainly',
        p: [
          'This is not the place for your finest sentences. Short, clear lines in the present tense let a busy reader see the structure at a glance.',
        ],
      },
    ],
  },
  {
    slug: 'querying-nerve',
    title: 'Querying without losing your nerve',
    category: 'Publishing',
    photo: 'leather',
    topics: ['agents', 'query letter', 'submissions', 'tracking'],
    dek: 'Sending a book out is a long process with little feedback. A simple system protects your energy as much as your manuscript.',
    quoteAfter: 2,
    quote: 'Treat querying as a project with batches, not a verdict on your worth.',
    sections: [
      {
        h: 'Send in small batches',
        p: [
          'Query a handful of agents at a time rather than everyone at once. If a batch brings back only silence, you can revise the letter or the sample pages before the next round.',
        ],
      },
      {
        h: 'Keep a plain tracker',
        p: [
          'A spreadsheet of names, dates, what you sent and what came back turns a vague worry into a list. It also prevents accidental double submissions.',
        ],
      },
      {
        h: 'Personalise one line, not the whole letter',
        p: [
          'Agents want to know why you chose them. One specific sentence is enough; the rest of the letter should stay about the book.',
        ],
      },
      {
        h: 'Decide your pause points early',
        p: [
          'Before you start, choose when you will stop and reassess. Decisions made in advance are easier to keep than ones made at the end of a hard week.',
        ],
      },
    ],
  },
  {
    slug: 'cut-first',
    title: 'The chapter you should cut first',
    category: 'Structure',
    photo: 'window',
    topics: ['cutting', 'pace', 'structure', 'backstory'],
    dek: 'Most drafts carry one chapter that reassures the writer rather than moving the reader. Find it before anyone else does.',
    quoteAfter: 2,
    quote: 'If a chapter only proves you did the research, it belongs in your notes.',
    sections: [
      {
        h: 'Look for the chapter you defend',
        p: [
          'Ask which chapter you would argue hardest to keep. That instinct is a clue: we defend the pages that cost us the most, not always the ones the story needs.',
          'Write one sentence about what changes for the reader by the end of it. If the sentence is hard to write, you have found your candidate.',
        ],
      },
      {
        h: 'Check what breaks without it',
        p: [
          'Remove the chapter from a copy of the manuscript and read its neighbours side by side. Note every moment that stops making sense. Usually it comes down to two or three facts, and facts can travel.',
        ],
      },
      {
        h: 'Move the facts, not the scenes',
        p: [
          'A line of dialogue, a detail in a later description or a single remembered moment can carry what the reader truly needs from the cut pages.',
        ],
      },
      {
        h: 'Keep a cuttings file',
        p: [
          'Cutting is easier when nothing is lost. Paste removed pages into a dated document. Few writers ever return to it, but knowing it exists makes the decision lighter.',
        ],
      },
    ],
  },
];

const words = a => [a.title, a.dek, a.quote, ...a.sections.flatMap(s => [s.h, ...s.p])].join(' ').split(/\s+/).length;

// Read time is computed from the sample text itself (~200 words per minute).
export const ARTICLES = RAW_ESSAYS.map((a, i) => ({
  ...a,
  index: i,
  minutes: Math.max(2, Math.round(words(a) / 200)),
}));

export const FEATURED = ['three-passes', 'opening-question', 'days-you-cant'];

export const SERVICES = [
  {
    id: 'assessment',
    title: 'Manuscript assessment',
    line: 'A clear read of where your draft stands.',
    includes: [
      'A full read of the manuscript',
      'A written report on structure, character and pace',
      'The three changes that would help most',
      'A follow-up call to talk it through',
    ],
    bestFor: 'Finished drafts, before you commit to a full edit.',
  },
  {
    id: 'developmental',
    title: 'Developmental edit',
    line: 'Deep work on the shape of the book.',
    includes: [
      'An editorial letter with ranked priorities',
      'Margin notes throughout the manuscript',
      'A chapter-by-chapter revision plan',
      'A second read of the revised draft',
    ],
    bestFor: 'Writers who are ready to revise seriously.',
  },
  {
    id: 'coaching',
    title: 'Book coaching',
    line: 'Steady support while the book is being written.',
    includes: [
      'Regular sessions on your pages and plans',
      'Notes on new chapters as you write them',
      'Help with outlines, goals and deadlines',
      'Company through the long middle',
    ],
    bestFor: 'Writers working towards a first complete draft.',
  },
];

export const ANATOMY = [
  {
    id: 'premise',
    title: 'Premise',
    line: 'The sentence the whole book grows from.',
    points: ['Names who it follows and what they want.', 'Holds a problem, not just a situation.', 'Fits in a single breath.'],
  },
  {
    id: 'structure',
    title: 'Structure',
    line: 'Where the story turns, and why.',
    points: ['Each act ends on a change.', 'The middle raises the stakes.', 'No chapter repeats another’s job.'],
  },
  {
    id: 'voice',
    title: 'Voice',
    line: 'How the book sounds on every page.',
    points: ['Sentences vary in length and rhythm.', 'Point of view holds steady.', 'Unmistakable within a page.'],
  },
  {
    id: 'ending',
    title: 'Ending',
    line: 'The promise of page one, kept.',
    points: ['Answers what the opening asked.', 'Earns its final image.', 'Leaves one thing to carry away.'],
  },
];

export const FORMATS = ['Online', 'In person', 'Retreat'];

export const TALKS = [
  {
    id: 'first-fifty',
    title: 'The first fifty pages clinic',
    text: 'Bring the opening of your manuscript. We read passages aloud, mark where attention drifts and rework the first page together.',
    formats: ['Online', 'In person'],
  },
  {
    id: 'one-wall',
    title: 'Your book on one wall',
    text: 'Index cards, a long table and a quiet day: lay out the whole plot and find the chapters that sag or repeat.',
    formats: ['In person', 'Retreat'],
  },
  {
    id: 'revision-dread',
    title: 'Revision without dread',
    text: 'Two evening sessions on planning revision in passes, so the work has a clear beginning, middle and end.',
    formats: ['Online'],
  },
];

export const CONTACT_TOPICS = ['Manuscript assessment', 'Developmental edit', 'Book coaching', 'Not sure yet'];
