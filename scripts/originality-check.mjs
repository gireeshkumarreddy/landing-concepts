// Fails if any text, brand name, person name or sample data visible in the six reference
// screenshots is still in the source. (Colours and layout intentionally follow the references.)
// Usage: node scripts/originality-check.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['src', 'index.html'];

// Phrases and names visible in the reference screenshots.
const PHRASES = [
  // 1 — AI reasoning reference
  'crucible', 'built for what matters', 'dinosaurs went extinct', 'get api access',
  // 2 — analytics reference
  'auralis', 'understand where you are', 'analyze, reflect', 'start your practice', 'scroll to explore',
  'from information to insight', 'built for clarity', 'every step', 'designed to support', 'every decision',
  'pricing that scales', 'scales with you', 'smarter workflows', 'act with confidence', 'reason & explain',
  'gather context', 'understand patterns', 'recommend actions', 'context-driven', 'designed around people',
  'adaptive reasoning', 'ai-driven understanding', 'expert-guided', 'progress over time', 'how the auralis works',
  'intelligence & expertise',
  // 3 — WhatsApp marketing reference
  'armin', 'whatsapp marketing', 'made easy for businesses', 'integrates with any api', 'start your campaign',
  'max williams', 'suman', 'black friday', 'bfdisc50', 'bali', 'holiday package', 'visit store now', 'check details',
  // 4 — email reference
  'talanoa', 'inbox that', 'works for you', 'productivity on steroids', 'get early access', 'case studies',
  'emily johnson', 'sarah miller', 'jessica taylor', 'daniel scott', 'ashley brown', 'rayan lewis',
  'quick follow-up', 'website project', 'meeting opportunity', 'amazon web services', 'chargebee', 'dataform',
  // 5 — portfolio reference
  'ezra', 'fix it in post', 'actually happen', 'happy clients', 'book a call', "video editor you've", 'video editor you’ve',
  'proudly edited', 'sam watson', 'paramount', 'activision',
  // 6 — editorial reference
  'charlie', 'hoehn', 'legendary books', '1m copies', 'bestselling editor', 'i help bestselling',
  'featured articles', 'author alliance', 'elevate their books',
  // Second batch of references (animation studies)
  'reimagine reality', 'trusted by leaders', 'from various industries', 'read success stories',
  'customer journeys', 'stunning ai generated', 'start generating now', 'realistic results', 'fast generation',
  'diverse styles', 'we deliver what counts', 'top class results', 'creative mines', 'make this',
  "let,s do it", 'plasma one', 'the one app for your money', 'unique rewards', 'countries covered',
];
// Word-boundary match for short names that could appear inside other words.
const WORDS = ['julie', 'nyt', 'reve'];


const files = [];
for (const r of ROOTS) {
  const walk = p => {
    const st = fs.statSync(p);
    if (st.isDirectory()) fs.readdirSync(p).forEach(f => walk(path.join(p, f)));
    else if (/\.(jsx?|css|html|md)$/.test(p)) files.push(p);
  };
  walk(r);
}

const hits = [];
for (const f of files) {
  if (f.endsWith('originality-check.mjs')) continue;
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const low = line.toLowerCase();
    for (const p of PHRASES) if (low.includes(p)) hits.push(`${f}:${i + 1}  phrase "${p}"  → ${line.trim().slice(0, 110)}`);
    for (const w of WORDS) if (new RegExp(`\\b${w}\\b`, 'i').test(line)) hits.push(`${f}:${i + 1}  name "${w}"  → ${line.trim().slice(0, 110)}`);
  });
}

if (hits.length) {
  console.log(hits.join('\n'));
  console.log(`\n${hits.length} possible copies found in ${files.length} files.`);
  process.exitCode = 1;
} else {
  console.log(`Originality check passed: ${files.length} files, ${PHRASES.length + WORDS.length} reference phrases and names, no matches.`);
}
