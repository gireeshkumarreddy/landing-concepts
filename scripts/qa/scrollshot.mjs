// Scrolls with the mouse wheel (so scroll-linked animations run) to a target, then captures the viewport.
// Usage: node scripts/qa/scrollshot.mjs <route> <out> <w> <h> <targetY|#id|bottom>
import { chromium } from 'playwright-core';

const [route0, out, w = '1440', h = '900', target = 'bottom'] = process.argv.slice(2);
const route = route0.replace(/\\/g, '/').replace(/^[A-Za-z]:\/+Program Files\/+Git/, '');
const b = await chromium.launch({ channel: 'msedge', headless: true });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto('http://localhost:5173' + route, { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
const y = await p.evaluate(
  t => (t === 'bottom' ? document.documentElement.scrollHeight : t.startsWith('#') ? document.querySelector(t).getBoundingClientRect().top + scrollY - 40 : +t),
  target
);
for (let cur = 0; cur < y; cur += 120) {
  await p.mouse.wheel(0, Math.min(120, y - cur));
  await p.waitForTimeout(25);
}
await p.waitForTimeout(1500);
await p.screenshot({ path: out });
console.log('scrollY', await p.evaluate(() => scrollY));
await b.close();
