// Screenshot helper for visual QA.
// Usage: node scripts/shot.mjs <url-or-route> <out.png> [width=1440] [height=900] [--full] [--scroll=px] [--wait=ms] [--dark] [--reduced]
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const [target, out, w = '1440', h = '900'] = args.filter(a => !a.startsWith('--'));
if (!target || !out) { console.error('usage: shot.mjs <url|/route> <out.png> [w] [h] [--full] [--scroll=px] [--wait=ms]'); process.exit(1); }
const base = process.env.SHOT_BASE || 'http://localhost:5173';
// Git Bash rewrites '/route' into a Windows path; undo that, and accept bare 'route' too.
let route = target.replace(/\\/g, '/').replace(/^[A-Za-z]:\/+Program Files\/+Git/, '');
if (!route.startsWith('/')) route = '/' + route;
const url = /^(https?|file):/.test(target) ? target : base + route;

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({
  viewport: { width: +w, height: +h },
  deviceScaleFactor: 1,
  reducedMotion: flags.reduced ? 'reduce' : 'no-preference',
  colorScheme: flags.dark ? 'dark' : 'light',
});
const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => errors.push('goto: ' + e.message));
if (flags.full) {
  // Walk the page so scroll-triggered reveals fire before a full-page capture.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 140)); }
    window.scrollTo({ top: 0, behavior: 'instant' }); await new Promise(r => setTimeout(r, 400));
  });
}
if (flags.scroll) { await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), +flags.scroll); }
await page.waitForTimeout(+(flags.wait || 1600));
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const jpeg = /\.jpe?g$/i.test(out);
await page.screenshot({ path: out, fullPage: !!flags.full, ...(jpeg ? { type: 'jpeg', quality: +(flags.quality || 78) } : {}) });
await browser.close();
console.log(`saved ${out} (${w}x${h}${flags.full ? ', full' : ''}) horizontal-overflow=${overflow}px`);
if (errors.length) console.log(errors.slice(0, 15).join('\n'));
