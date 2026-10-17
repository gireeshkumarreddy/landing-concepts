// Interaction test for /maren-holt. Usage: node scripts/qa/maren-holt-test.mjs <outDir>
import { chromium } from 'playwright-core';

const OUT = process.argv[2] || '.';
const URL = 'http://localhost:5173/maren-holt';
const results = [];
const errors = [];
const ok = (name, cond, extra = '') => results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`);
const sleep = ms => new Promise(r => setTimeout(r, ms));
// Smooth scrolling + scroll reveals: bring an element into view and let its reveal settle before clicking.
const into = async (page, sel, block = 'center') => {
  await page.locator(sel).first().evaluate((el, b) => el.scrollIntoView({ block: b }), block);
  await sleep(1400);
};

const browser = await chromium.launch({ channel: 'msedge', headless: true });

async function open(viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, reducedMotion: opts.reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`[${viewport.width}] pageerror: ${e.message}`));
  page.on('console', m => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${viewport.width}] ${m.type()}: ${m.text()}`);
  });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 180000 });
  await page.waitForSelector('.ch-h1', { timeout: 120000 });
  // Let the hero typewriter finish (keycaps fade in as they are typed).
  await page.waitForFunction(() => [...document.querySelectorAll('.ch-h1 .ch-key')].every(k => getComputedStyle(k).visibility === 'visible' && getComputedStyle(k).opacity === '1'), null, { timeout: 60000 });
  await sleep(2200);
  return { ctx, page };
}

/* ---------------- Desktop ---------------- */
{
  const { ctx, page } = await open({ width: 1440, height: 900 });
  const shot = n => page.screenshot({ path: `${OUT}/t-${n}.png` });

  // Keycap press
  const key = page.locator('.ch-key--white').first();
  const kb = await key.boundingBox();
  await page.mouse.move(kb.x + kb.width / 2, kb.y + kb.height / 2);
  await page.mouse.down();
  ok('keycap presses on pointerdown', await key.evaluate(e => e.classList.contains('is-pressed')));
  await page.mouse.up();
  ok('keycap releases on pointerup', !(await key.evaluate(e => e.classList.contains('is-pressed'))));

  // Newsletter
  await page.click('.ch-news__btn');
  ok('newsletter empty → error', (await page.locator('.ch-news__error').textContent())?.includes('Add your email'));
  ok('newsletter input aria-invalid', (await page.getAttribute('#ch-newsletter-email', 'aria-invalid')) === 'true');
  await page.fill('#ch-newsletter-email', 'nope@');
  ok('newsletter live re-validate after submit', (await page.locator('.ch-news__error').textContent())?.includes('incomplete'));
  await page.fill('#ch-newsletter-email', 'reader@example.com');
  ok('newsletter error clears when valid', (await page.locator('.ch-news__error').count()) === 0);
  await page.click('.ch-news__btn');
  await sleep(250);
  ok('newsletter loading state', (await page.locator('.ch-news__btn').textContent())?.includes('Adding you'));
  await sleep(1200);
  const done = await page.locator('.ch-news__done').textContent();
  ok('newsletter success says demo', done?.includes('no email was stored or sent'));
  await shot('newsletter-success');
  await page.click('.ch-news__done button');
  await sleep(500);
  ok('newsletter undo restores form', (await page.locator('#ch-newsletter-email').count()) === 1);

  // Search via button
  await page.click('button[aria-label="Search essays"]');
  await page.waitForSelector('.ch-palette');
  await sleep(350);
  ok('search opens, input focused', await page.evaluate(() => document.activeElement?.id === 'ch-search-input'));
  ok('search lists all 8 when empty', (await page.locator('.ch-opt').count()) === 8);
  await page.keyboard.type('synopsis');
  await sleep(150);
  const n1 = await page.locator('.ch-opt').count();
  ok('search filters by query', n1 >= 1 && n1 < 8, `${n1} results`);
  ok('search highlights matches', (await page.locator('.ch-opt mark').count()) > 0);
  await page.fill('#ch-search-input', 'agents');
  await sleep(150);
  ok('search matches topics', (await page.locator('.ch-opt__topic').count()) > 0);
  await page.fill('#ch-search-input', 'zzzz');
  await sleep(150);
  ok('search empty state', (await page.locator('.ch-palette__empty').count()) === 1);
  await page.click('.ch-palette__try button >> nth=1');
  await sleep(150);
  ok('search suggestion fills query', (await page.inputValue('#ch-search-input')) === 'revision');
  await page.fill('#ch-search-input', '');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  ok('arrow keys move active option', (await page.getAttribute('#ch-search-input', 'aria-activedescendant')) === 'ch-search-opt-2');
  await shot('search');
  const expected = await page.locator('#ch-search-opt-2 .ch-opt__title').textContent();
  await page.keyboard.press('Enter');
  await page.waitForSelector('.ch-reader');
  await sleep(700);
  ok('enter opens reader on chosen article', (await page.locator('#ch-reader-title').textContent()) === expected, expected);
  ok('search closed after pick', (await page.locator('.ch-palette').count()) === 0);
  ok('reader labelled as sample', (await page.locator('.ch-reader__sample').textContent())?.includes('Sample essay'));
  ok('page scroll locked', await page.evaluate(() => document.body.style.overflow === 'hidden'));
  await page.locator('.ch-reader__scroll').evaluate(el => el.scrollTo(0, (el.scrollHeight - el.clientHeight) / 2));
  await sleep(200);
  const prog = await page.locator('.ch-reader__progress span').evaluate(el => el.style.transform);
  ok('reading progress updates', /scaleX\(0\.[1-9]/.test(prog), prog);
  ok('page smooth scroll paused while reader open', await page.evaluate(() => document.documentElement.classList.contains('lenis-stopped')));
  {
    const y0 = await page.evaluate(() => scrollY);
    const r0 = await page.locator('.ch-reader__scroll').evaluate(el => el.scrollTop);
    const box = await page.locator('.ch-reader__scroll').boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, 500);
    await sleep(500);
    const r1 = await page.locator('.ch-reader__scroll').evaluate(el => el.scrollTop);
    const y1 = await page.evaluate(() => scrollY);
    ok('wheel scrolls the reader, not the page', r1 > r0 && y1 === y0, `reader ${r0}→${r1}, page ${y0}→${y1}`);
  }
  await shot('reader');
  const t1 = await page.locator('#ch-reader-title').textContent();
  await page.locator('.ch-pn--next').click();
  await sleep(700);
  const t2 = await page.locator('#ch-reader-title').textContent();
  ok('reader next article', t1 !== t2, `${t1} → ${t2}`);
  ok('reader scroll resets on next', (await page.locator('.ch-reader__scroll').evaluate(el => el.scrollTop)) < 5);
  // focus trap: tab many times stays inside
  for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
  ok('focus trapped in reader', await page.evaluate(() => !!document.activeElement?.closest('.ch-reader')));
  await page.keyboard.press('Escape');
  await sleep(600);
  ok('escape closes reader', (await page.locator('.ch-reader').count()) === 0);
  ok('page smooth scroll resumes after reader', await page.evaluate(() => !document.documentElement.classList.contains('lenis-stopped')));
  ok('scroll unlocked', await page.evaluate(() => document.body.style.overflow === ''));

  // "/" shortcut
  await page.locator('body').click({ position: { x: 20, y: 400 } });
  await page.keyboard.press('/');
  await sleep(400);
  ok('"/" opens search', (await page.locator('.ch-palette').count()) === 1);
  await page.keyboard.press('Escape');
  await sleep(400);
  ok('escape closes search', (await page.locator('.ch-palette').count()) === 0);

  // Sign in
  await page.click('.ch-signin');
  await page.waitForSelector('.ch-modal');
  await sleep(300);
  await page.click('.ch-modal button[type=submit]');
  ok('sign-in empty → error', (await page.locator('#ch-signin-email-err').textContent())?.length > 0);
  ok('sign-in focus to invalid field', await page.evaluate(() => document.activeElement?.id === 'ch-signin-email'));
  await page.fill('#ch-signin-email', 'me@example.com');
  await page.click('.ch-modal button[type=submit]');
  await sleep(1300);
  ok('sign-in demo message', (await page.locator('.ch-modal').textContent())?.includes('switched off in this concept'));
  ok('sign-in has no password field', (await page.locator('.ch-modal input[type=password]').count()) === 0);
  await shot('signin');
  await page.click('.ch-modal__done .ch-btn');
  await sleep(500);
  ok('sign-in closes', (await page.locator('.ch-modal').count()) === 0);
  ok('focus returns to Sign in', await page.evaluate(() => document.activeElement?.classList.contains('ch-signin')));

  // Featured card opens reader
  await page.click('.ch-fcard >> nth=1');
  await page.waitForSelector('.ch-reader');
  await sleep(600);
  ok('featured card opens its essay', (await page.locator('#ch-reader-title').textContent()) === 'Why your opening needs a question, not an answer');
  await page.click('button[aria-label="Close essay"]');
  await sleep(600);
  ok('close button closes reader', (await page.locator('.ch-reader').count()) === 0);

  // Nav links + active state
  for (const id of ['essays', 'services', 'workshops', 'about', 'contact']) {
    await page.click(`.ch-pill a[href="#${id}"]`);
    await sleep(1900);
    const top = await page.evaluate(i => Math.round(document.getElementById(i).getBoundingClientRect().top), id);
    const active = await page.evaluate(() => document.querySelector('.ch-pill__link.is-active')?.getAttribute('href'));
    ok(`nav → #${id}`, Math.abs(top - 88) < 60 || (id === 'contact' && top < 500), `top=${top} active=${active}`);
  }
  await shot('nav-contact');

  // Articles filter
  await page.click('a.ch-textlink[href="#essays"]');
  await sleep(1200);
  await page.click('.ch-articles .ch-chip:has-text("Publishing")');
  await sleep(700);
  ok('filter Publishing → 2', (await page.locator('.ch-agrid .ch-acard').count()) === 2);
  ok('chip aria-pressed', (await page.getAttribute('.ch-articles .ch-chip:has-text("Publishing")', 'aria-pressed')) === 'true');
  await shot('filter');
  await page.click('.ch-articles .ch-chip:has-text("All")');
  await sleep(700);
  ok('filter All → 8', (await page.locator('.ch-agrid .ch-acard').count()) === 8);
  await into(page, '.ch-acard >> nth=3');
  await page.click('.ch-acard >> nth=3');
  await page.waitForSelector('.ch-reader');
  await sleep(500);
  ok('article card opens reader', (await page.locator('.ch-reader').count()) === 1);
  await page.keyboard.press('Escape');
  await sleep(500);

  // Authors accordion
  await into(page, '#ch-svc-btn-developmental');
  const b2 = page.locator('#ch-svc-btn-developmental');
  await b2.click();
  await sleep(500);
  ok('accordion expands row 2', (await b2.getAttribute('aria-expanded')) === 'true');
  ok('accordion collapses row 1', (await page.getAttribute('#ch-svc-btn-assessment', 'aria-expanded')) === 'false');
  await page.click('#ch-svc-panel-developmental .ch-btn');
  await sleep(1500);
  ok('ask about this → contact topic', (await page.locator('.ch-topic.is-on').textContent()) === 'Developmental edit');
  ok('ask about this → name focused', await page.evaluate(() => document.activeElement?.id === 'ch-contact-name'));

  // Books flip
    await into(page, '#anatomy');
  await page.click('.ch-anat__item >> nth=0');
  await sleep(900);
  ok('page re-tints charcoal while Anatomy is centred', (await page.getAttribute('.ch', 'data-scroll-theme')) === 'dark');
  ok('anatomy card flips', await page.locator('.ch-anat__item >> nth=0').evaluate(e => e.classList.contains('is-flipped')));
  await page.locator('#anatomy').evaluate(el => el.scrollIntoView({ block: 'center' }));
  await sleep(400);
  await shot('books-flipped');
  ok('flip moves focus to back', await page.evaluate(() => !!document.activeElement?.closest('.ch-anat__back')));
  await page.keyboard.press('Enter');
  await sleep(900);
  ok('anatomy flips back via keyboard', !(await page.locator('.ch-anat__item >> nth=0').evaluate(e => e.classList.contains('is-flipped'))));

  // Workshops
  await into(page, '#workshops', 'start');
  await page.click('.ch-speaking .ch-chip:has-text("In person")');
  await sleep(700);
  ok('format filter In person → 2', (await page.locator('.ch-talk').count()) === 2);
  await page.click('.ch-speaking .ch-chip:has-text("Every format")');
  await sleep(700);
  await page.click('.ch-talk >> nth=1 >> .ch-textbtn');
  await sleep(900);
  ok('request this one preselects workshop', (await page.inputValue('#ch-talk-topic')) === 'one-wall');
  await page.click('.ch-formcard button[type=submit]');
  await sleep(200);
  const errs = await page.locator('.ch-formcard .ch-field__error').count();
  ok('workshop form empty → errors', errs === 5, `${errs} errors`);
  await page.locator('.ch-formcard').evaluate(el => el.scrollIntoView({ block: 'center' }));
  await shot('talk-errors');
  await page.fill('#ch-talk-name', 'Sam Reader');
  await page.fill('#ch-talk-email', 'sam@example.com');
  await page.fill('#ch-talk-event', 'Harbourside Writers');
  await page.fill('#ch-talk-date', '2020-01-01');
  await page.selectOption('#ch-talk-audience', { index: 2 });
  ok('past date rejected', (await page.locator('#ch-talk-date-err').textContent())?.includes('already passed'));
  await page.fill('#ch-talk-date', '2027-03-14');
  await page.click('.ch-formcard button[type=submit]');
  await sleep(1400);
  ok('workshop form success (demo)', (await page.locator('.ch-formcard').textContent())?.includes('Nothing was sent'));
  await shot('talk-success');
  await page.click('.ch-formcard__done .ch-btn');
  await sleep(300);

  // About CTA → newsletter
  await into(page, '#about');
  ok('page back to light theme after Anatomy', (await page.getAttribute('.ch', 'data-scroll-theme')) === 'light');
  ok('About statement is split for the scroll fill', (await page.locator('.ch-statement [style*="opacity"]').count()) > 10);
  await page.click('.ch-about__ctas .ch-btn--raised');
  await sleep(1300);
  ok('get the Sunday notes → focuses email', await page.evaluate(() => document.activeElement?.id === 'ch-newsletter-email'));

  // Contact
  await into(page, '#contact');
  await page.click('.ch-contact button[type=submit]');
  ok('contact empty → 3 errors', (await page.locator('.ch-contact .ch-field__error').count()) === 3);
  await page.click('.ch-topic:has-text("Book coaching")');
  ok('contact topic radio', (await page.locator('.ch-topic.is-on').textContent()) === 'Book coaching');
  await page.fill('#ch-contact-name', 'Sam');
  await page.fill('#ch-contact-email', 'sam@example.com');
  await page.fill('#ch-contact-msg', 'Short');
  ok('message min length', (await page.locator('#ch-contact-msg-err').textContent())?.includes('12'));
  await page.fill('#ch-contact-msg', 'I have a draft and a launch date.');
  await page.click('.ch-contact button[type=submit]');
  await sleep(1400);
  ok('contact success (demo)', (await page.locator('.ch-contact').textContent())?.includes('No message was sent'));
  await page.locator('#contact').evaluate(el => el.scrollIntoView({ block: 'center' }));
  await shot('contact-success');

  // Footer link to index
  await page.click('.ch-footer__back');
  await sleep(800);
  ok('All concepts → /', new globalThis.URL(page.url()).pathname === '/');
  await ctx.close();
}

/* ---------------- Mobile ---------------- */
{
  const { ctx, page } = await open({ width: 390, height: 844 });
  ok('mobile: menu button visible', await page.locator('.ch-menubtn').isVisible());
  await page.click('.ch-menubtn');
  await page.waitForSelector('#ch-menu');
  await sleep(400);
  ok('mobile: aria-expanded true', (await page.getAttribute('.ch-menubtn', 'aria-expanded')) === 'true');
  await page.screenshot({ path: `${OUT}/t-m-menu.png` });
  await page.keyboard.press('Escape');
  await sleep(400);
  ok('mobile: escape closes menu', (await page.locator('#ch-menu').count()) === 0);
  ok('mobile: focus back on menu button', await page.evaluate(() => document.activeElement?.classList.contains('ch-menubtn')));
  await page.click('.ch-menubtn');
  await sleep(400);
  await page.click('.ch-menu__link:has-text("Workshops")');
  await sleep(2200);
  const top = await page.evaluate(() => Math.round(document.getElementById('workshops').getBoundingClientRect().top));
  ok('mobile: menu link navigates & closes', (await page.locator('#ch-menu').count()) === 0 && Math.abs(top - 88) < 60, `top=${top}`);
  // featured carousel scrolls horizontally
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(600);
  const track = page.locator('.ch-tray__track');
  const sw = await track.evaluate(el => el.scrollWidth - el.clientWidth);
  ok('mobile: featured tray is a carousel', sw > 100, `scrollable ${sw}px`);
  // reader full-screen
  await page.click('.ch-fcard >> nth=0');
  await page.waitForSelector('.ch-reader');
  await sleep(700);
  const rb = await page.locator('.ch-reader').boundingBox();
  ok('mobile: reader is full-screen', rb.width === 390 && rb.x === 0, JSON.stringify(rb));
  await page.screenshot({ path: `${OUT}/t-m-reader.png` });
  await page.keyboard.press('Escape');
  await sleep(500);
  // search on mobile
  await page.click('button[aria-label="Search essays"]');
  await sleep(400);
  await page.keyboard.type('notebook');
  await sleep(200);
  await page.screenshot({ path: `${OUT}/t-m-search.png` });
  await page.keyboard.press('Escape');
  await ctx.close();
}

/* ---------------- Reduced motion ---------------- */
{
  const { ctx, page } = await open({ width: 1440, height: 900 }, { reduced: true });
  const vis = await page.evaluate(() => {
    const cs = [...document.querySelectorAll('.ch-c, .ch-key, .ch-news, .ch-featured')].map(e => getComputedStyle(e));
    return cs.every(c => c.opacity === '1' && c.visibility === 'visible');
  });
  ok('reduced motion: headline & hero fully visible', vis);
  await page.screenshot({ path: `${OUT}/t-reduced.png` });
  await ctx.close();
}

await browser.close();
console.log(results.join('\n'));
console.log(`\n${results.filter(r => r.startsWith('PASS')).length}/${results.length} passed`);
console.log(errors.length ? 'Console:\n' + errors.join('\n') : 'Console: clean');
