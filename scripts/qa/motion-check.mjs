// Motion QA: checks smooth scrolling is active, that scroll glides after the wheel stops,
// logs page-colour/theme changes while wheel-scrolling, captures frames and console errors.
// Usage: node scripts/qa/motion-check.mjs <route> [outDir] [--base=http://localhost:5173] [--w=1440] [--h=900]
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const [route0 = '/', outDir] = args.filter(a => !a.startsWith('--'));
const route = route0.replace(/\\/g, '/').replace(/^[A-Za-z]:\/+Program Files\/+Git/, '') || '/';
const base = flags.base || 'http://localhost:5173';

const b = await chromium.launch({ channel: 'msedge', headless: true });
const p = await b.newPage({ viewport: { width: +(flags.w || 1440), height: +(flags.h || 900) } });
const errors = [];
p.on('pageerror', e => errors.push('pageerror: ' + e.message));
p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text().slice(0, 200)); });
await p.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(1800);

const state = () => p.evaluate(() => {
  const root = document.querySelector('[data-scroll-theme]');
  return {
    y: Math.round(scrollY),
    lenis: document.documentElement.classList.contains('lenis'),
    bg: getComputedStyle(document.body).backgroundColor,
    theme: root?.dataset.scrollTheme || '-',
  };
});

const s0 = await state();
console.log(`lenis active: ${s0.lenis}`);

// Glide test: one wheel burst, then sample scrollY while it settles.
for (let i = 0; i < 4; i++) await p.mouse.wheel(0, 120);
const glide = [];
for (let i = 0; i < 10; i++) { await p.waitForTimeout(80); glide.push((await state()).y); }
console.log(`glide after burst (80ms samples): ${glide.join(' → ')}`);

// Full scroll: log colour/theme changes and capture frames.
const total = await p.evaluate(() => document.documentElement.scrollHeight);
let last = '', frame = 0;
for (let y = 0; y < total + 900; y += 360) {
  for (let i = 0; i < 3; i++) { await p.mouse.wheel(0, 120); await p.waitForTimeout(20); }
  await p.waitForTimeout(900);
  const s = await state();
  const sig = `${s.bg} ${s.theme}`;
  if (sig !== last) { console.log(`y=${s.y}  page=${s.bg}  theme=${s.theme}`); last = sig; }
  if (outDir) await p.screenshot({ path: `${outDir}/m${String(frame++).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 62 });
}
console.log(errors.length ? 'CONSOLE:\n' + [...new Set(errors)].slice(0, 12).join('\n') : 'console clean');
await b.close();
