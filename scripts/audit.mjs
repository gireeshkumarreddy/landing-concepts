// Route × viewport audit: horizontal overflow, console errors, failed requests,
// broken images, heading/landmark basics and unlabeled controls.
// Usage: node scripts/audit.mjs [baseUrl=http://localhost:5173] [--routes=/a,/b] [--reduced]
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
const base = args.find(a => !a.startsWith('--')) || 'http://localhost:5173';
const ROUTES = flags.routes ? String(flags.routes).split(',') : ['/', '/sagewell', '/vantline', '/tidings', '/emberpost', '/creative-portfolio', '/maren-holt', '/does-not-exist'];
const VIEWPORTS = [[375, 812], [390, 844], [768, 1024], [1366, 768], [1440, 900], [1920, 1080]];

const browser = await chromium.launch({ channel: 'msedge', headless: true });
let problems = 0;

for (const route of ROUTES) {
  for (const [w, h] of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: flags.reduced ? 'reduce' : 'no-preference' });
    const errors = [];
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 160)); });
    page.on('response', r => { if (r.status() >= 400 && !r.url().includes('does-not-exist')) errors.push(`${r.status()} ${r.url().slice(0, 120)}`); });
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => errors.push('goto: ' + e.message));
    const report = await page.evaluate(async () => {
      const step = innerHeight * 0.7;
      let maxOverflow = 0;
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        scrollTo({ top: y, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 90));
        maxOverflow = Math.max(maxOverflow, document.documentElement.scrollWidth - document.documentElement.clientWidth);
      }
      scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 600));
      const imgs = [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.style.visibility !== 'hidden' && i.getAttribute('loading') !== 'lazy');
      const unnamed = [...document.querySelectorAll('button, a[href], [role="button"], input:not([type=hidden]), select, textarea')]
        .filter(el => el.offsetParent !== null)
        .filter(el => {
          const label = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.title || el.textContent.trim() || el.getAttribute('placeholder') || el.getAttribute('value');
          const hasLabelEl = el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
          const wrapped = el.closest('label');
          const imgAlt = el.querySelector('img[alt]:not([alt=""])');
          return !label && !hasLabelEl && !wrapped && !imgAlt;
        })
        .map(el => el.outerHTML.slice(0, 90));
      const deadLinks = [...document.querySelectorAll('a[href="#"], a:not([href])')].filter(a => a.offsetParent !== null && !a.getAttribute('role')).length;
      const missingTargets = [...document.querySelectorAll('a[href^="#"]')]
        .map(a => a.getAttribute('href').slice(1))
        .filter(id => id && !document.getElementById(decodeURIComponent(id)));
      return {
        maxOverflow,
        h1: document.querySelectorAll('h1').length,
        main: !!document.querySelector('main'),
        brokenImgs: imgs.map(i => i.src.slice(0, 100)),
        unnamed: unnamed.slice(0, 5),
        deadLinks,
        missingTargets: [...new Set(missingTargets)],
      };
    });
    const issues = [];
    if (report.maxOverflow > 0) issues.push(`overflow ${report.maxOverflow}px`);
    if (route !== '/does-not-exist' && report.h1 !== 1) issues.push(`h1 count ${report.h1}`);
    if (!report.main) issues.push('no <main>');
    if (report.brokenImgs.length) issues.push(`broken imgs: ${report.brokenImgs.join(' | ')}`);
    if (report.unnamed.length) issues.push(`unnamed controls: ${report.unnamed.join(' | ')}`);
    if (report.deadLinks) issues.push(`${report.deadLinks} links without real href`);
    if (report.missingTargets.length) issues.push(`missing anchor targets: #${report.missingTargets.join(', #')}`);
    issues.push(...errors.slice(0, 6));
    problems += issues.length;
    console.log(`${issues.length ? '✗' : '✓'} ${route} @ ${w}x${h}${issues.length ? '\n    - ' + issues.join('\n    - ') : ''}`);
    await page.close();
  }
}
await browser.close();
console.log(problems ? `\n${problems} issue(s) found.` : '\nAll routes clean at all viewports.');
process.exitCode = problems ? 1 : 0;
