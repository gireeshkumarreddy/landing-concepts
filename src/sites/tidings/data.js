// Sample data for the Tidings concept. Everything here is illustrative demo content.
// Two fictional sample businesses appear throughout: Fern & Field (a homeware and
// clothing shop) and Casa Verde (a neighbourhood restaurant).
import { unsplash } from '../../shared/img.js';

export const IMG_BISTRO = '1751011983324-fe9d30fe9efd'; // bistro table with wine glasses

export const avatar = (id, size = 96) => unsplash(id, { w: size, h: size, q: 70, crop: 'faces' });

export const PEOPLE = {
  priya: { id: 'priya', name: 'Priya Nair', first: 'Priya', img: '1609371497456-3a55a205d5eb' },
  tomas: { id: 'tomas', name: 'Tomás Ortega', first: 'Tomás', img: '1500648767791-00dcc994a43e' },
  hannah: { id: 'hannah', name: 'Hannah Okafor', first: 'Hannah', img: '1623717217554-72ca676de535' },
  lena: { id: 'lena', name: 'Lena Fischer', first: 'Lena', img: '1764971591006-b6eb67a8f0cb' },
  kenji: { id: 'kenji', name: 'Kenji Watanabe', first: 'Kenji', img: '1628619488538-f4ce88739f56' },
  amina: { id: 'amina', name: 'Amina Diallo', first: 'Amina', img: '1494790108377-be9c29b29330' },
  daniel: { id: 'daniel', name: 'Daniel Brooks', first: 'Daniel', img: '1758874574397-e56dfcfc116d' },
  rafael: { id: 'rafael', name: 'Rafael Costa', first: 'Rafael', img: '1592234789031-94bf65f630ed' },
};

/* ---------- Region & currency ---------- */
export const REGIONS = {
  UK: { code: 'UK', name: 'United Kingdom', currency: 'GBP', symbol: '£', rate: 1, locale: 'en-GB' },
  US: { code: 'US', name: 'United States', currency: 'USD', symbol: '$', rate: 1.27, locale: 'en-US' },
  EU: { code: 'EU', name: 'Eurozone', currency: 'EUR', symbol: '€', rate: 1.17, locale: 'en-IE' },
};
export const REGION_ORDER = ['UK', 'US', 'EU'];

const nf = new Intl.NumberFormat('en-GB');
export const fmt = n => nf.format(Math.round(n));

/** Converts a GBP sample amount into the region currency and formats it. */
export function money(gbp, region, { decimals = 0 } = {}) {
  const r = REGIONS[region];
  const v = gbp * r.rate;
  return r.symbol + v.toLocaleString(r.locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/* ---------- Navigation ---------- */
export const PLATFORM_LINKS = [
  { href: '#product-broadcasts', label: 'Broadcasts', note: 'One message, every opted-in customer' },
  { href: '#product-messages', label: 'Product messages', note: 'Photo, price and a button in the chat' },
  { href: '#product-pay', label: 'Pay in chat', note: 'Checkout without leaving the thread' },
  { href: '#product-journeys', label: 'Journeys', note: 'Follow-ups that run on their own' },
];
export const LEARN_LINKS = [
  { href: '#builder', label: 'Campaign builder', note: 'Draft and preview a message' },
  { href: '#analytics', label: 'Analytics', note: 'From delivered to converted' },
  { href: '#how', label: 'How it works', note: 'Number, list, launch' },
  { href: '#faq', label: 'FAQ', note: 'Opt-in, templates, data' },
];

/* ---------- Hero phone chats ---------- */
// `from: 'me'` = the business (outgoing), `from: 'them'` = the customer.
export const CHATS = [
  {
    id: 'priya',
    person: PEOPLE.priya,
    last: 'YES please, size M',
    time: '11:08',
    unread: 2,
    script: [
      { from: 'me', text: 'Hi Priya — the linen shirt you saved is back in your size.' },
      {
        from: 'me',
        kind: 'promo',
        eyebrow: 'Back in stock',
        title: 'Linen camp shirt · Sage · M',
        text: 'Reply *YES* and we’ll hold one for 24 hours. Nothing to pay yet.',
        button: 'Reserve mine',
        sheet: { title: 'Hold the linen shirt', url: 'fernandfield.example/hold/linen-m', note: 'Places a 24-hour hold under Priya’s number. Every tap is counted in Analytics.' },
      },
      { from: 'them', text: 'YES please, size M' },
    ],
    chips: [
      { say: 'Done — it’s held for you until 11:00 tomorrow.', reply: 'Perfect, I’ll collect it after work.' },
      { say: 'Prefer delivery? Here’s a secure pay link: fernandfield.example/pay/priya', reply: 'Paid, thank you!' },
      { say: 'The matching linen shorts are back too. Shall I hold a pair?', reply: 'Go on then, same size.' },
    ],
    chipLabels: ['Confirm the hold', 'Send a pay link', 'Suggest a match'],
  },
  {
    id: 'tomas',
    person: PEOPLE.tomas,
    last: 'Could we make it 8:30?',
    time: '10:24',
    unread: 0,
    script: [
      { from: 'me', text: 'Hi Tomás — your table for four at Casa Verde is confirmed for Friday at 8:00 pm.' },
      {
        from: 'me',
        kind: 'media',
        image: IMG_BISTRO,
        alt: 'A bistro table set with wine glasses',
        title: 'Casa Verde · Friday, 8:00 pm',
        text: 'Table for 4 · Terrace · Ref CV-2291',
        button: 'View booking',
        sheet: { title: 'Booking CV-2291', url: 'casaverde.example/b/CV-2291', note: 'Shows the booking, with options to change the time or party size.' },
      },
      { from: 'them', text: 'Could we make it 8:30?' },
    ],
    chips: [
      { say: 'No problem — you’re now booked for 8:30 pm.', reply: 'Brilliant, thank you!' },
      { say: 'Would you like to pre-order the six-course tasting menu?', reply: 'Yes, for all four of us.' },
    ],
    chipLabels: ['Move to 8:30', 'Offer tasting menu'],
  },
  {
    id: 'hannah',
    person: PEOPLE.hannah,
    last: 'Has my order shipped yet?',
    time: 'Yesterday',
    unread: 1,
    script: [
      { from: 'them', text: 'Has my order shipped yet?' },
      { from: 'me', text: 'Hi Hannah — order #7314 is packed and leaves the studio today.' },
      {
        from: 'me',
        kind: 'promo',
        eyebrow: 'Order #7314',
        title: 'Arrives Wednesday',
        text: 'Tracked delivery between 9:00 and 13:00.',
        button: 'Track order',
        sheet: { title: 'Track order #7314', url: 'fernandfield.example/track/7314', note: 'Opens live tracking for this parcel.' },
      },
    ],
    chips: [
      { say: 'Would you like a handwritten gift note added?', reply: 'Oh yes — “Happy birthday, Mum”.' },
      { say: 'Want a message when the driver is 30 minutes away?', reply: 'Yes please.' },
    ],
    chipLabels: ['Offer a gift note', 'Offer a driver alert'],
  },
  {
    id: 'lena',
    person: PEOPLE.lena,
    last: 'Does the code work on sale items?',
    time: 'Yesterday',
    unread: 0,
    script: [
      { from: 'me', text: 'Hi Lena — the speckled carafe is still waiting in your basket.' },
      {
        from: 'me',
        kind: 'promo',
        eyebrow: 'Your basket',
        title: 'Speckled ceramic carafe',
        text: 'Finish checkout today with *GARDEN10* for 10% off.',
        button: 'Return to basket',
        sheet: { title: 'Lena’s basket', url: 'fernandfield.example/basket/lena?code=GARDEN10', note: 'Restores the basket with the code applied.' },
      },
      { from: 'them', text: 'Does the code work on sale items?' },
    ],
    chips: [
      { say: 'It does — GARDEN10 works on everything until Sunday.', reply: 'Great, checking out now.' },
      { say: 'Here’s a pay link with the code applied: fernandfield.example/pay/lena', reply: 'Done, thank you!' },
    ],
    chipLabels: ['Explain the code', 'Send a pay link'],
  },
  {
    id: 'kenji',
    person: PEOPLE.kenji,
    last: 'See you Saturday then',
    time: 'Mon',
    unread: 3,
    script: [
      { from: 'me', text: 'Hi Kenji — you’re earning double points at Casa Verde this weekend.' },
      {
        from: 'me',
        kind: 'promo',
        eyebrow: 'Loyalty',
        title: 'Double points until Sunday',
        text: 'You’re 40 points away from a free dessert.',
        button: 'See my points',
        sheet: { title: 'Kenji’s rewards', url: 'casaverde.example/rewards/kenji', note: 'Shows the points balance and available rewards.' },
      },
      { from: 'them', text: 'See you Saturday then' },
    ],
    chips: [
      { say: 'See you Saturday, Kenji!', reply: 'Cheers!' },
      { say: 'We’re open from noon until 11:00 pm on Saturday.', reply: 'Perfect, thanks.' },
    ],
    chipLabels: ['Say see you', 'Share opening hours'],
  },
  {
    id: 'amina',
    person: PEOPLE.amina,
    last: 'Can I bring my own cake?',
    time: 'Sun',
    unread: 0,
    script: [
      { from: 'me', text: 'Hi Amina — thanks for booking the private room for 12 on the 14th.' },
      {
        from: 'me',
        kind: 'promo',
        eyebrow: 'Private room',
        title: 'Saturday 14th · 12 guests',
        text: 'Dinner from 7:00 pm. Your deposit has been received.',
        button: 'Manage booking',
        sheet: { title: 'Private room booking', url: 'casaverde.example/b/PR-0614', note: 'Lets Amina update numbers and dietary notes.' },
      },
      { from: 'them', text: 'Can I bring my own cake?' },
    ],
    chips: [
      { say: 'Of course — we’ll keep it chilled and bring it out with candles.', reply: 'You’re the best.' },
      { say: 'Our pastry chef can also make one. Shall I send some options?', reply: 'Yes, send them over.' },
    ],
    chipLabels: ['Say yes', 'Offer a dessert'],
  },
];

/* ---------- Builder ---------- */
export const TEMPLATES = [
  {
    id: 'restock',
    name: 'Back in stock',
    desc: 'Tell savers the moment it returns',
    item: 'linen camp shirt',
    domain: 'fernandfield.example',
    slug: 'hold',
    button: 'Reserve mine',
    glyph: 'In stock',
    tone: 'grad',
    body: 'Hi {{first_name}} — good news: the {{item}} you saved is back in your size.\n\nReply *YES* to hold one for 24 hours, or order here: {{link}}',
  },
  {
    id: 'cart',
    name: 'Cart reminder',
    desc: 'A gentle nudge for a left basket',
    item: 'speckled ceramic carafe',
    domain: 'fernandfield.example',
    slug: 'basket',
    button: 'Return to basket',
    glyph: 'Basket',
    tone: 'ink',
    body: 'Hi {{first_name}}, your {{item}} is still in your basket. We’ll keep it for you until tonight.\n\nPick up where you left off: {{link}}',
  },
  {
    id: 'reservation',
    name: 'Reservation confirmed',
    desc: 'Time, table and a manage link',
    item: 'table for four on Friday at 8:00 pm',
    domain: 'casaverde.example',
    slug: 'b',
    button: 'View booking',
    media: IMG_BISTRO,
    mediaAlt: 'A bistro table set with wine glasses',
    body: 'Hi {{first_name}} — your {{item}} at Casa Verde is confirmed.\n\nNeed to change something? Manage it here: {{link}}',
  },
  {
    id: 'loyalty',
    name: 'Loyalty reward',
    desc: 'Celebrate a reward they’ve earned',
    item: 'free dessert',
    domain: 'casaverde.example',
    slug: 'rewards',
    button: 'See my rewards',
    glyph: 'Reward',
    tone: 'soft',
    body: 'Hi {{first_name}}, you’ve unlocked a {{item}} — it’s waiting for you on your next visit.\n\nSee your points and rewards: {{link}}',
  },
];

export const templateLink = (t, person) => `${t.domain}/${t.slug}/${person.id}`;

export const SEGMENTS = [
  { id: 'regulars', label: 'Regulars', count: 2180 },
  { id: 'recent', label: 'Recent orders', count: 4320 },
  { id: 'browsed', label: 'Browsed, didn’t buy', count: 1140 },
  { id: 'news', label: 'Newsletter list', count: 9600 },
];

export const PREVIEW_CONTACTS = [PEOPLE.priya, PEOPLE.tomas, PEOPLE.hannah, PEOPLE.kenji];

export const MAX_CHARS = 1024;

/* ---------- Analytics (sample) ---------- */
export const STAGES = ['Sent', 'Delivered', 'Read', 'Tapped', 'Converted'];
export const CAMPAIGNS = [
  {
    id: 'linen',
    name: 'Spring linen drop',
    type: 'Broadcast · Fern & Field',
    date: 'Sent Thu 3 Apr, 10:00',
    funnel: { Sent: 15240, Delivered: 14806, Read: 12377, Tapped: 3962, Converted: 918 },
    revenue: 41310,
    taps: [30, 520, 690, 470, 360, 310, 270, 250, 280, 340, 410, 380, 300, 240, 170, 120, 90, 70, 60, 80, 150, 230, 260, 190],
  },
  {
    id: 'table',
    name: 'Weekend table offer',
    type: 'Broadcast · Casa Verde',
    date: 'Sent Fri 11 Apr, 12:00',
    funnel: { Sent: 5860, Delivered: 5712, Read: 4914, Tapped: 1322, Converted: 286 },
    revenue: 13960,
    taps: [12, 140, 230, 180, 120, 90, 70, 64, 80, 120, 160, 150, 110, 80, 60, 40, 30, 22, 18, 16, 20, 26, 30, 24],
  },
  {
    id: 'points',
    name: 'Loyalty double points',
    type: 'Journey · Casa Verde',
    date: 'Running since 1 Apr',
    funnel: { Sent: 3140, Delivered: 3081, Read: 2703, Tapped: 1105, Converted: 512 },
    revenue: 9470,
    taps: [34, 40, 46, 52, 58, 60, 66, 72, 70, 64, 60, 62, 68, 76, 82, 78, 70, 60, 50, 44, 40, 38, 36, 35],
  },
];

/* ---------- How it works ---------- */
export const STEPS = [
  {
    title: 'Connect your business number',
    text: 'Verify the number customers already message, or register a new one, with a single guided form.',
    chip: '+44 7700 900456 · Verified',
  },
  {
    title: 'Import or grow your list',
    text: 'Bring contacts in with their opt-in records, or collect new ones from your site, receipts and QR codes.',
    chip: '17,240 contacts · 4 segments',
  },
  {
    title: 'Launch, then learn',
    text: 'Send approved templates and watch deliveries, reads, taps and sales arrive on one dashboard.',
    chip: 'Sent → Read → Converted',
  },
];

/* ---------- Pricing ---------- */
export const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    blurb: 'For small shops sending their first campaigns.',
    price: { UK: 15, US: 19, EU: 18 },
    features: ['1 business number', 'Up to 2,500 contacts', 'Broadcasts & approved templates', 'Product messages with tracked links', 'Help centre & email support'],
    cta: 'Start on Starter',
  },
  {
    id: 'growth',
    name: 'Growth',
    blurb: 'For teams selling in the chat every week.',
    price: { UK: 49, US: 62, EU: 57 },
    featured: true,
    features: ['3 business numbers', 'Up to 20,000 contacts', 'Pay in chat', 'Journeys & automations', 'Campaign analytics', 'Priority support'],
    cta: 'Start on Growth',
  },
  {
    id: 'scale',
    name: 'Scale',
    blurb: 'For high-volume brands and multi-site groups.',
    price: null,
    features: ['Unlimited numbers & locations', 'Volume-based contact pricing', 'Higher API & webhook limits', 'SSO and audit log', 'Dedicated onboarding'],
    cta: 'Talk to sales',
  },
];

/* ---------- FAQ ---------- */
export const FAQS = [
  {
    q: 'Who am I allowed to message?',
    a: 'Only people who have agreed to hear from your business on WhatsApp. Tidings records where and when each person opted in, and every marketing template ends with a simple way to stop receiving messages.',
  },
  {
    q: 'Do my message templates need approval?',
    a: 'Templates that start a conversation are reviewed by Meta. You write and submit them from Tidings, and the status shows next to each one. Review times vary, so you can keep drafting while you wait.',
  },
  {
    q: 'Can I keep the number customers already know?',
    a: 'Usually, yes. If the number is not tied to another WhatsApp account, you can move it across during setup — or register a fresh number if you prefer to keep things separate.',
  },
  {
    q: 'How does Tidings connect to my shop or booking system?',
    a: 'Through a REST API and webhooks for contacts, orders, bookings and message events. Anything that can send an HTTP request can trigger a journey or update a contact.',
  },
  {
    q: 'Can I take my data with me?',
    a: 'Always. Contacts, opt-in records, campaign results and conversation history export as CSV from settings, or through the API, at any time.',
  },
  {
    q: 'Is there a long contract?',
    a: 'No. Plans run monthly, or yearly if you choose the discount. Cancel in settings and your account stays active until the end of the period, with exports available throughout.',
  },
];

/* ---------- About ---------- */
export const PRINCIPLES = [
  { title: 'Consent first', text: 'Every contact has a recorded opt-in, and every marketing message ends with an easy way to stop.' },
  { title: 'Fair pricing', text: 'A flat plan price, with Meta’s conversation fees passed through at cost and itemised on every invoice.' },
  { title: 'Useful over loud', text: 'Segments, timing and journeys help you send the message that matters — not one more message.' },
];

/* ---------- Wizard ---------- */
export const COUNTRIES = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'IE', name: 'Ireland' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'PT', name: 'Portugal' },
  { code: 'IN', name: 'India' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'OT', name: 'Somewhere else' },
];

export const AUDIENCE_SIZES = [
  { id: 'xs', label: 'Under 1,000', note: 'Just getting started' },
  { id: 'sm', label: '1,000 – 10,000', note: 'A loyal following' },
  { id: 'md', label: '10,000 – 50,000', note: 'A busy list' },
  { id: 'lg', label: '50,000+', note: 'Large and multi-site' },
];
