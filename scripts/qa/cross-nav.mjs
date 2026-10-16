// Client-side navigation across all sites in one page session: checks titles, leftover
// <html> state, console errors, and that each site looks the same as on a fresh load.
import { chromium } from 'playwright-core';

const base = process.argv[2] || 'http://localhost:4173';
const outDir = process.argv[3];
const basePath = new URL(base).pathname.replace(/\/$/, ''); // '' locally, '/landing-concepts' on Pages
const SLUGS = ['sagewell', 'vantline', 'tidings', 'emberpost', 'creative-portfolio', 'maren-holt'];
const b = await chromium.launch({ channel: 'msedge', headless: true });
const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => m.type() === 'error' && errors.push(m.text()));

const state = () =>
  page.evaluate(() => ({
    title: document.title,
    path: location.pathname,
    htmlStyle: document.documentElement.getAttribute('style') || '',
    bodyStyle: document.body.getAttribute('style') || '',
    site: document.documentElement.dataset.site || '',
    scrollY: Math.round(scrollY),
  }));

await page.goto(base + '/', { waitUntil: 'networkidle' });
for (const slug of SLUGS) {
  await page.click(`a[href="${basePath}/${slug}"]`);
  await page.waitForURL(`**/${slug}`);
  await page.waitForTimeout(2500);
  const s = await state();
  if (outDir) await page.screenshot({ path: `${outDir}/nav-${slug}.png` });
  console.log(`→ /${slug}: title="${s.title}" site=${s.site} scrollY=${s.scrollY} html="${s.htmlStyle}"`);
  // Scroll down, then return to the index through the site's own "All concepts" link.
  await page.mouse.wheel(0, 2400);
  await page.waitForTimeout(600);
  const back = page.locator(`a[href="${basePath || '/'}"], a[href="${basePath}/"]`).last();
  await back.scrollIntoViewIfNeeded();
  await back.click();
  await page.waitForURL(u => u.pathname.replace(/\/$/, '') === basePath);
  await page.waitForTimeout(900);
  const h = await state();
  console.log(`← /: title="${h.title}" site=${h.site} scrollY=${h.scrollY} html="${h.htmlStyle}" body="${h.bodyStyle}"`);
}
// Browser back/forward through history.
await page.goBack();
await page.waitForTimeout(1500);
console.log('back →', (await state()).path);
await page.goForward();
await page.waitForTimeout(1200);
console.log('forward →', (await state()).path);
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no console errors');
await b.close();
