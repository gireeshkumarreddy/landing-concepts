// Interaction QA for /creative-portfolio. Usage: node scripts/qa/creative-portfolio-test.mjs <outDir>
import { chromium } from 'playwright-core';

const OUT = (process.argv[2] || '.').replace(/\\/g, '/');
const URL = 'http://localhost:5173/creative-portfolio';
const results = [];
const ok = (name, cond, extra = '') => results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`);
const wait = ms => new Promise(r => setTimeout(r, ms));

const browser = await chromium.launch({ channel: 'msedge', headless: true });

async function newPage(w, h, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    reducedMotion: opts.reduced ? 'reduce' : 'no-preference',
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', e => page.errors.push('pageerror: ' + e.message));
  page.on('console', m => (m.type() === 'error' || m.type() === 'warning') && page.errors.push(m.type() + ': ' + m.text()));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await wait(2600);
  return page;
}
const sectionTop = (page, id) => page.evaluate(id => Math.round(document.getElementById(id).getBoundingClientRect().top), id);

/* ---------------- Desktop ---------------- */
{
  const page = await newPage(1440, 900);

  // Autoplay
  // The dev server is shared, so allow a few seconds for the intro before autoplay begins.
  const f1 = +(await page.getAttribute('.pf-tl-track', 'aria-valuenow'));
  let f2 = f1;
  for (let i = 0; i < 25 && f2 <= f1; i++) {
    await wait(200);
    f2 = +(await page.getAttribute('.pf-tl-track', 'aria-valuenow'));
  }
  ok('timeline autoplays on load', f2 > f1, `${f1} → ${f2}`);

  // Drag scrub
  const box = await page.locator('.pf-tl-track').boundingBox();
  await page.mouse.move(box.x + box.width * 0.5, box.y + 40);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.6, box.y + 40, { steps: 6 });
  await page.mouse.move(box.x + box.width * 0.72, box.y + 40, { steps: 6 });
  await page.mouse.up();
  const f3 = +(await page.getAttribute('.pf-tl-track', 'aria-valuenow'));
  ok('dragging the playhead scrubs', Math.abs(f3 - 0.72 * 1499) < 20, `frame ${f3}`);
  const playLabel = await page.getAttribute('.pf-tl-play', 'aria-label');
  ok('scrubbing stops autoplay', playLabel === 'Play reel', playLabel);
  const monTitle = await page.textContent('.pf-mon-title');
  ok('monitor shows segment for scrub position', /BACKSTREET BLOOM|Backstreet Bloom/i.test(monTitle), monTitle);
  const vt = await page.getAttribute('.pf-tl-track', 'aria-valuetext');
  ok('slider valuetext is timecode', /^\d\d:\d\d:\d\d:\d\d, /.test(vt), vt);

  // Hover tooltip
  await page.mouse.move(box.x + box.width * 0.45, box.y + 56);
  await wait(250);
  const tip = await page.locator('.pf-tl-tip').textContent().catch(() => '');
  ok('hovering a clip segment names it', /Grandfather’s Hands|Coastline/.test(tip), tip);
  await page.screenshot({ path: `${OUT}/t-timeline-hover.png`, clip: { x: 200, y: 480, width: 1040, height: 300 } });

  // Keyboard
  await page.focus('.pf-tl-track');
  const k0 = +(await page.getAttribute('.pf-tl-track', 'aria-valuenow'));
  await page.keyboard.press('ArrowRight');
  const k1 = +(await page.getAttribute('.pf-tl-track', 'aria-valuenow'));
  ok('ArrowRight steps one second', k1 - k0 === 25, `${k0} → ${k1}`);
  await page.keyboard.press('Shift+ArrowLeft');
  const k2 = +(await page.getAttribute('.pf-tl-track', 'aria-valuenow'));
  ok('Shift+ArrowLeft steps one frame', k1 - k2 === 1, `${k1} → ${k2}`);
  await page.keyboard.press('PageDown');
  const k3 = +(await page.getAttribute('.pf-tl-track', 'aria-valuenow'));
  ok('PageDown jumps to next clip', k3 === 51 * 25, `frame ${k3}`);
  await page.keyboard.press('Home');
  ok('Home goes to start', +(await page.getAttribute('.pf-tl-track', 'aria-valuenow')) === 0);
  await page.keyboard.press('Space');
  await wait(600);
  ok('Space toggles playback', (await page.getAttribute('.pf-tl-play', 'aria-label')) === 'Pause reel');
  await page.click('.pf-tl-play');
  ok('play/pause button pauses', (await page.getAttribute('.pf-tl-play', 'aria-label')) === 'Play reel');
  await page.screenshot({ path: `${OUT}/t-timeline-focus.png`, clip: { x: 200, y: 480, width: 1040, height: 300 } });

  // Monitor opens case study
  await page.click('.pf-mon');
  await wait(700);
  ok('monitor opens case study modal', await page.isVisible('[role="dialog"].pf-case'));
  const t1 = await page.textContent('#pf-case-title');
  ok('modal shows current clip project', t1.trim() === 'Neon Hours', t1);
  ok('focus moved into dialog', await page.evaluate(() => !!document.activeElement.closest('.pf-case')));
  await page.screenshot({ path: `${OUT}/t-modal.png` });
  await page.click('button[aria-label^="Next project"]');
  await wait(700);
  const t2 = await page.textContent('#pf-case-title');
  ok('next project button', t2.trim() === 'Afterglow', t2);
  await page.click('button[aria-label^="Previous project"]');
  await wait(700);
  ok('previous project button', (await page.textContent('#pf-case-title')).trim() === 'Neon Hours');

  // Grade slider
  const knob = page.locator('.pf-grade-knob');
  await knob.scrollIntoViewIfNeeded();
  const gb = await page.locator('.pf-grade-box').boundingBox();
  await page.mouse.move(gb.x + gb.width * 0.5, gb.y + gb.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(gb.x + gb.width * 0.25, gb.y + gb.height * 0.5, { steps: 8 });
  await page.mouse.up();
  const g1 = +(await knob.getAttribute('aria-valuenow'));
  ok('grade slider drags', Math.abs(g1 - 25) <= 2, `value ${g1}`);
  await knob.focus();
  await page.keyboard.press('ArrowRight');
  ok('grade slider keyboard', +(await knob.getAttribute('aria-valuenow')) === g1 + 2);
  await page.keyboard.press('End');
  ok('grade slider End', +(await knob.getAttribute('aria-valuenow')) === 100);
  await page.keyboard.press('Home');
  await page.screenshot({ path: `${OUT}/t-modal-grade.png` });
  await page.keyboard.press('Escape');
  await wait(600);
  ok('Escape closes modal', !(await page.isVisible('.pf-case')));
  ok('focus returns to opener', await page.evaluate(() => document.activeElement?.classList.contains('pf-mon')));

  // Nav links
  for (const [label, id] of [['Process', 'process'], ['Reel', 'reel'], ['Studio', 'studio'], ['Contact', 'contact'], ['Index', 'index']]) {
    await page.click(`.pf-nav-links a:has-text("${label}")`);
    await wait(1400);
    const top = await sectionTop(page, id);
    ok(`nav "${label}" scrolls to #${id}`, Math.abs(top - 88) < 30 || (id === 'index' && (await page.evaluate(() => scrollY)) < 5), `top=${top}`);
    if (id !== 'index') {
      const cur = await page.getAttribute('.pf-nav-links a[aria-current]', 'href');
      ok(`nav highlights ${label}`, cur === `#${id}`, cur);
    }
  }

  // Hero CTA → contact + focus
  await page.click('.pf-hero-cta .pf-btn');
  await wait(1700);
  ok('hero CTA scrolls to contact', Math.abs((await sectionTop(page, 'contact')) - 88) < 30);
  ok('hero CTA focuses the name field', await page.evaluate(() => document.activeElement?.id === 'pf-f-name'));

  // Client strip chevron
  await page.evaluate(() => scrollTo(0, 0));
  await wait(300);
  await page.click('.pf-clients-jump');
  await wait(1400);
  ok('client strip chevron jumps to the reel', Math.abs((await sectionTop(page, 'reel')) - 88) < 30);

  // Work filters
  await page.click('.pf-chip:has-text("Music video")');
  await wait(900);
  ok('filter Music video shows 2', (await page.locator('.pf-card').count()) === 2);
  await page.screenshot({ path: `${OUT}/t-filter-music.png` });
  await page.click('.pf-chip:has-text("Documentary")');
  await wait(900);
  ok('filter Documentary shows 1', (await page.locator('.pf-card').count()) === 1);
  await page.click('.pf-chip:has-text("All")');
  await wait(900);
  ok('filter All shows 6', (await page.locator('.pf-card').count()) === 6);

  // Card hover + open
  const card = page.locator('.pf-card').nth(1);
  await card.hover();
  await wait(1200);
  const rec = await card.locator('.pf-card-rec span').textContent();
  ok('card hover runs REC timecode', rec !== '00:00:00:00', rec);
  await page.screenshot({ path: `${OUT}/t-card-hover.png` });
  await card.locator('.pf-card-btn').click();
  await wait(700);
  ok('card opens its case study', (await page.textContent('#pf-case-title')).trim() === 'Afterglow');
  await page.click('button[aria-label="Close project"]');
  await wait(600);
  ok('close button closes modal', !(await page.isVisible('.pf-case')));

  // Process steps
  await page.evaluate(() => document.getElementById('process').scrollIntoView());
  await wait(700);
  await page.click('.pf-step-btn:has-text("Story cut")');
  await wait(900);
  ok('step button selects stage', (await page.getAttribute('.pf-step-btn:has-text("Story cut")', 'aria-pressed')) === 'true');
  ok('timeline shows story cut', await page.locator('.pf-seq.is-story').count() === 1);
  await page.keyboard.press('ArrowDown');
  await wait(900);
  ok('arrow key moves to picture lock', (await page.getAttribute('.pf-step-btn:has-text("Picture lock")', 'aria-pressed')) === 'true');
  await page.screenshot({ path: `${OUT}/t-process-fine.png` });

  // Services accordion + enquire prefill
  await page.evaluate(() => document.getElementById('services').scrollIntoView());
  await wait(500);
  await page.click('#pf-svc-btn-music');
  await wait(600);
  ok('accordion opens row', (await page.getAttribute('#pf-svc-btn-music', 'aria-expanded')) === 'true');
  ok('accordion closes previous row', (await page.getAttribute('#pf-svc-btn-campaign', 'aria-expanded')) === 'false');
  await page.screenshot({ path: `${OUT}/t-services.png` });
  await page.click('#pf-svc-music a.pf-link-btn');
  await wait(1600);
  ok('enquire preselects project type', await page.isChecked('input[name="pf-type"][value="Music video"]'));

  // Contact form
  await page.evaluate(() => document.getElementById('contact').scrollIntoView());
  await page.click('input[name="pf-type"][value="Music video"]');
  await page.evaluate(() => {
    // reset type to test the empty submit path
  });
  await page.click('button[type="submit"]');
  await wait(300);
  const errs = await page.locator('.pf-err').count();
  ok('empty submit shows inline errors', errs >= 4, `${errs} errors`);
  ok('first invalid field focused', await page.evaluate(() => document.activeElement?.id === 'pf-f-name'));
  ok('aria-invalid set', (await page.getAttribute('#pf-f-email', 'aria-invalid')) === 'true');
  await page.screenshot({ path: `${OUT}/t-form-errors.png` });
  await page.fill('#pf-f-name', 'Maya Ortiz');
  await page.fill('#pf-f-email', 'maya@');
  await page.locator('#pf-f-email').blur();
  ok('blur re-validates email', /incomplete/.test((await page.textContent('#pf-e-email').catch(() => '')) || ''));
  await page.fill('#pf-f-email', 'maya@example.com');
  await page.selectOption('#pf-f-budget', { index: 2 });
  await page.fill('#pf-f-message', 'A three minute music video, shot on two cameras, due next month.');
  await page.click('button[type="submit"]');
  await wait(300);
  ok('loading state shown', /Sending/.test(await page.textContent('button[type="submit"]')));
  await wait(1400);
  const done = await page.textContent('.pf-done').catch(() => '');
  ok('success state says demo, not sent', /portfolio demo/.test(done) && /wasn’t sent/.test(done));
  await page.screenshot({ path: `${OUT}/t-form-success.png` });
  await page.click('.pf-done .pf-btn');
  await wait(500);
  ok('start over returns to form', await page.isVisible('#pf-f-name'));

  // Copy email
  await page.click('.pf-mail-copy');
  await wait(300);
  ok('copy email feedback', /Copied/.test(await page.textContent('.pf-mail-copy')));
  const clip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => '');
  ok('clipboard holds address', clip === 'studio@inesmorrow.film', clip);

  // Footer
  const clock1 = await page.textContent('.pf-foot-tc');
  await wait(1200);
  const clock2 = await page.textContent('.pf-foot-tc');
  ok('Lisbon clock ticks', clock1 !== clock2, `${clock1} → ${clock2}`);
  ok('footer has All concepts link', (await page.getAttribute('.pf-foot-all', 'href')) === '/');

  ok('desktop console clean', page.errors.length === 0, page.errors.join(' | '));
  await page.context().close();
}

/* ---------------- Mobile ---------------- */
{
  const page = await newPage(390, 844);
  await page.click('.pf-nav-menu[aria-label="Open menu"]');
  await wait(500);
  ok('menu opens', await page.isVisible('#pf-menu'));
  ok('menu button aria-expanded', (await page.getAttribute('.pf-nav-menu[aria-controls="pf-menu"]', 'aria-expanded')) === 'true');
  ok('focus inside menu', await page.evaluate(() => !!document.activeElement.closest('#pf-menu')));
  await page.screenshot({ path: `${OUT}/t-mobile-menu.png` });
  await page.keyboard.press('Escape');
  await wait(500);
  ok('Escape closes menu', !(await page.isVisible('#pf-menu')));
  await page.click('.pf-nav-menu[aria-label="Open menu"]');
  await wait(500);
  await page.click('#pf-menu a:has-text("Studio")');
  await wait(1500);
  ok('menu link closes menu', !(await page.isVisible('#pf-menu')));
  ok('menu link scrolls to studio', Math.abs((await sectionTop(page, 'studio')) - 88) < 40, `top=${await sectionTop(page, 'studio')}`);

  // Mobile modal
  await page.evaluate(() => document.getElementById('reel').scrollIntoView());
  await wait(600);
  await page.locator('.pf-card-btn').first().click();
  await wait(800);
  await page.screenshot({ path: `${OUT}/t-mobile-modal.png` });
  const mb = await page.locator('.pf-case').boundingBox();
  ok('modal is full-screen sheet on mobile', mb.width === 390 && mb.height >= 840, JSON.stringify(mb));
  await page.keyboard.press('Escape');
  await wait(500);

  // Mobile timeline touch-ish scrub with mouse
  await page.evaluate(() => scrollTo(0, 0));
  await wait(300);
  const tb = await page.locator('.pf-tl-track').boundingBox();
  await page.mouse.click(tb.x + tb.width * 0.9, tb.y + 40);
  await wait(200);
  const mf = +(await page.getAttribute('.pf-tl-track', 'aria-valuenow'));
  ok('mobile tap on timeline scrubs', Math.abs(mf - 0.9 * 1499) < 25, `frame ${mf}`);
  await page.screenshot({ path: `${OUT}/t-mobile-hero-scrubbed.png` });
  ok('mobile console clean', page.errors.length === 0, page.errors.join(' | '));
  await page.context().close();
}

/* ---------------- Reduced motion ---------------- */
{
  const page = await newPage(1440, 900, { reduced: true });
  const f1 = +(await page.getAttribute('.pf-tl-track', 'aria-valuenow'));
  await wait(1200);
  const f2 = +(await page.getAttribute('.pf-tl-track', 'aria-valuenow'));
  ok('no autoplay under reduced motion', f1 === f2 && f1 === 0);
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('.pf h1, .pf-hero-cta, .pf-reveal, .pf-badge, .pf-client')].filter(e => +getComputedStyle(e).opacity < 1).length,
  );
  ok('all content visible under reduced motion', hidden === 0, `${hidden} hidden`);
  await page.screenshot({ path: `${OUT}/t-reduced.png` });
  ok('reduced console clean', page.errors.length === 0, page.errors.join(' | '));
  await page.context().close();
}

await browser.close();
console.log(results.join('\n'));
console.log(`\n${results.filter(r => r.startsWith('PASS')).length}/${results.length} passed`);
