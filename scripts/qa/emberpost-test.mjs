// Interaction test for /emberpost. Usage: node scripts/qa/emberpost-test.mjs <outDir>
import { chromium } from 'playwright-core';
import path from 'node:path';

const out = process.argv[2] || '.';
const BASE = 'http://localhost:5173/emberpost';
const results = [];
const ok = (name, cond, extra = '') => results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  (' + extra + ')' : ''}`);
const shot = (p, name) => p.screenshot({ path: path.join(out, `t-${name}.png`) });

const browser = await chromium.launch({ channel: 'msedge', headless: true });

/* ------------------------------------------------------------ desktop */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => (m.type() === 'error' || m.type() === 'warning') && errors.push(m.type() + ': ' + m.text()));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);

  const selected = () => page.$eval('.ta-main__title strong', el => el.textContent).catch(() => null);

  // Auto notification (before any interaction resets nothing; timer runs while hero visible)
  await page.waitForTimeout(7600);
  const cards = await page.$$eval('.ta-ncard strong', els => els.map(e => e.textContent));
  ok('auto notification card appears after ~8s', cards.includes('Amara Osei'), cards.join(', '));
  await shot(page, 'd01-auto-notification');

  // Notification card opens conversation and clears
  await page.click('.ta-slot--left .ta-ncard').catch(() => {});
  await page.waitForTimeout(700);
  const afterCard = await selected();
  ok('clicking a notification card opens that conversation', ['Sofia Reyes', 'Amara Osei'].includes(afterCard), afterCard);
  const focusIsWin = await page.evaluate(() => document.activeElement?.classList.contains('ta-win'));
  ok('focus moves to inbox region after card click', focusIsWin);

  // Pause toggle
  const live = page.locator('.ta-live');
  await live.click();
  ok('live feed pause toggle', (await live.getAttribute('aria-pressed')) === 'false');
  await live.click();
  ok('live feed resume toggle', (await live.getAttribute('aria-pressed')) === 'true');

  // Sidebar row selection + unread clearing
  await page.click('.ta-side .ta-row[data-row="theo"]');
  await page.waitForTimeout(500);
  ok('sidebar row selects conversation', (await selected()) === 'Theo Lindqvist');
  const theoCount = await page.$('.ta-side .ta-row[data-row="theo"] .ta-row__count');
  ok('unread count clears when opened', theoCount === null);

  // Section collapse
  const head = page.locator('.ta-side__head').first();
  await head.click();
  ok('section header collapses', (await head.getAttribute('aria-expanded')) === 'false');
  await page.waitForTimeout(400);
  await shot(page, 'd02-collapsed');
  await head.click();
  ok('section header expands', (await head.getAttribute('aria-expanded')) === 'true');

  // Keyboard J / K inside the window region only
  await page.focus('.ta-win');
  const before = await selected();
  await page.keyboard.press('j');
  await page.waitForTimeout(300);
  const afterJ = await selected();
  ok('J moves to next conversation', afterJ !== before, `${before} -> ${afterJ}`);
  await page.keyboard.press('k');
  await page.waitForTimeout(300);
  ok('K moves back', (await selected()) === before, await selected());
  // Page-level keys are not hijacked
  await page.focus('.ta-hero__cta');
  await page.keyboard.press('j');
  await page.waitForTimeout(200);
  ok('J outside the window does nothing', (await selected()) === before);

  // Mark done with E + undo
  await page.focus('.ta-win');
  await page.keyboard.press('e');
  await page.waitForTimeout(500);
  const toast = await page.$eval('.ta-toast', el => el.textContent).catch(() => null);
  ok('E marks done and shows toast', !!toast && toast.includes('Marked done'), toast);
  const goneRow = await page.$(`.ta-side .ta-row[data-row="theo"]`);
  await page.waitForTimeout(300);
  ok('done conversation leaves the list', goneRow === null || !(await goneRow.isVisible()));
  await shot(page, 'd03-marked-done');
  await page.click('.ta-toast button');
  await page.waitForTimeout(500);
  ok('Undo restores the conversation', (await selected()) === before && !!(await page.$('.ta-side .ta-row[data-row="theo"]')));

  // Mark done via button
  await page.click('.ta-main__actions button[aria-label^="Mark done"]');
  await page.waitForTimeout(400);
  ok('mark done button works', !!(await page.$('.ta-toast')));
  await page.click('.ta-toast button');
  await page.waitForTimeout(400);

  // Marcus via hero tile
  await page.click('.ta-ftile--l');
  await page.waitForTimeout(500);
  ok('left avatar tile opens Marcus', (await selected()) === 'Marcus Bell');

  // Earlier messages
  const nBefore = await page.$$eval('.ta-msg', els => els.length);
  await page.click('.ta-earlier');
  await page.waitForTimeout(400);
  const nAfter = await page.$$eval('.ta-msg', els => els.length);
  ok('show earlier messages expands thread', nAfter > nBefore, `${nBefore} -> ${nAfter}`);

  // The thread is an inner scroller: the wheel scrolls it, not the page (smooth scroll is on)
  const thread = await page.$('.ta-thread');
  const tb = await thread.boundingBox();
  await page.mouse.move(tb.x + tb.width / 2, tb.y + 40);
  const pageY0 = await page.evaluate(() => scrollY);
  const st0 = await thread.evaluate(el => el.scrollTop);
  await page.mouse.wheel(0, 240);
  await page.waitForTimeout(700);
  const st1 = await thread.evaluate(el => el.scrollTop);
  const pageY1 = await page.evaluate(() => scrollY);
  ok('inbox thread scrolls natively under smooth scroll', st1 > st0 && Math.abs(pageY1 - pageY0) < 4, `thread ${st0}->${st1}, page ${pageY0}->${pageY1}`);
  await thread.evaluate(el => (el.scrollTop = 0));

  // Send empty
  await page.click('.ta-send');
  const note = await page.$eval('.ta-composer__note', el => el.textContent);
  ok('send empty shows hint', note.includes('Type a reply'), note);

  // Draft a reply typewriter
  await page.click('.ta-ghost:has-text("Draft a reply")');
  await page.waitForTimeout(250);
  const partial = await page.$eval('#ta-reply', el => el.value);
  await page.waitForTimeout(3600);
  const full = await page.$eval('#ta-reply', el => el.value);
  ok('draft a reply types a draft', partial.length > 0 && full.length > partial.length, `${partial.length} -> ${full.length}`);
  await shot(page, 'd04-suggested');

  // R focuses reply; Ctrl+Enter sends
  await page.focus('.ta-win');
  await page.keyboard.press('r');
  ok('R focuses reply', await page.evaluate(() => document.activeElement?.id === 'ta-reply'));
  await page.keyboard.press('Control+Enter');
  await page.waitForTimeout(600);
  const lastMsg = await page.$$eval('.ta-msg', els => els[els.length - 1].textContent);
  ok('Ctrl+Enter sends as You with demo label', lastMsg.includes('You') && lastMsg.includes('Sent · demo'), lastMsg.slice(0, 60));
  await page.waitForTimeout(300);
  await shot(page, 'd05-sent');

  // Nav links
  await page.click('.ta-nav__links a[href="#workflows"]');
  await page.waitForTimeout(1900);
  const csTop = await page.$eval('#workflows', el => Math.round(el.getBoundingClientRect().top));
  ok('nav Workflows scrolls to section', csTop > -60 && csTop < 140, `top=${csTop}`);
  await page.click('.ta-nav__links a[href="#manifesto"]');
  await page.waitForTimeout(1900);
  const abTop = await page.$eval('#manifesto', el => Math.round(el.getBoundingClientRect().top));
  ok('nav Manifesto scrolls to section', abTop > -60 && abTop < 140, `top=${abTop}`);

  // Dark interlude while the manifesto is centred
  const theme = await page.evaluate(() => document.querySelector('.ta').dataset.scrollTheme);
  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  ok('manifesto turns the page dark', theme === 'dark', `${theme} ${bodyBg}`);
  await shot(page, 'd05b-manifesto-dark');

  // Join the waitlist (nav) focuses the form
  await page.click('.ta-nav__cta');
  await page.waitForTimeout(1900);
  ok('nav CTA focuses waitlist email', await page.evaluate(() => document.activeElement?.id === 'ta-ea-email'));
  ok('waitlist form highlights', await page.$eval('#ta-ea-form', el => el.classList.contains('is-flash')));
  await shot(page, 'd06-waitlist-focus');

  // People toggle
  await page.locator('#people').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, document.getElementById('people').offsetTop + 120));
  await page.waitForTimeout(1200);
  await page.click('.ta-seg__btn:has-text("Emberpost")');
  await page.waitForTimeout(250);
  await shot(page, 'd07-people-mid');
  await page.waitForTimeout(1000);
  const cardsN = await page.$$eval('.ta-pcard', els => els.length);
  ok('Emberpost toggle regroups into 3 people cards', cardsN === 3);
  await shot(page, 'd08-people-grouped');
  await page.click('.ta-seg__btn:has-text("Classic inbox")');
  await page.waitForTimeout(1000);
  ok('Classic toggle restores 8 rows', (await page.$$eval('.ta-classic__list li', e => e.length)) === 8);

  // Screener
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.ta-feat--screener').getBoundingClientRect().top + scrollY - 100));
  await page.waitForTimeout(1200);
  await page.click('button[aria-label="Let in Nora Fitzgerald"]');
  await page.click('button[aria-label="Turn away Growth Weekly"]');
  await page.waitForTimeout(900);
  const allowed = await page.$$eval('.ta-scr__bucket--allowed .ta-scr__chip', e => e.map(x => x.textContent));
  const blocked = await page.$$eval('.ta-scr__bucket--blocked .ta-scr__chip', e => e.map(x => x.textContent));
  ok('screener allow moves sender', allowed.some(t => t.includes('Nora')));
  ok('screener block moves sender', blocked.some(t => t.includes('Growth')));
  await shot(page, 'd09-screener');
  await page.click('button[aria-label^="Undo, send Nora"]');
  await page.waitForTimeout(700);
  ok('screener undo returns sender', (await page.$$eval('.ta-scr__col--wait .ta-scr__item', e => e.length)) === 3);

  // Split inbox tabs
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.ta-feat--split').getBoundingClientRect().top + scrollY - 100));
  await page.waitForTimeout(1000);
  await page.click('#ta-tab-notifications');
  await page.waitForTimeout(500);
  ok('split tab click filters list', (await page.$eval('.ta-split__list', el => el.textContent)).includes('Billing'));
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(500);
  ok('split tabs arrow keys', (await page.getAttribute('#ta-tab-people', 'aria-selected')) === 'true' &&
    (await page.evaluate(() => document.activeElement?.id)) === 'ta-tab-people');

  // Follow-up reminders
  await page.click('.ta-chip:has-text("Monday 9:00")');
  await page.waitForTimeout(500);
  ok('reminder preset adds pill', (await page.$eval('.ta-mail__pill', el => el.textContent).catch(() => '')).includes('Mon 16 Mar'));
  await page.click('.ta-chip:has-text("Pick a time")');
  await page.waitForTimeout(400);
  await page.click('.ta-custom button[type="submit"]');
  ok('custom reminder empty shows error', (await page.$eval('#ta-custom-err', el => el.textContent).catch(() => '')).length > 0);
  await page.fill('#ta-custom-at', '2026-01-26T14:30');
  await page.click('.ta-custom button[type="submit"]');
  await page.waitForTimeout(500);
  const pill = await page.$eval('.ta-mail__pill', el => el.textContent).catch(() => '');
  ok('custom reminder sets pill', pill.includes('26'), pill);
  await shot(page, 'd10-followup');
  await page.click('.ta-mail__pill button');
  await page.waitForTimeout(500);
  ok('reminder clears', !(await page.$('.ta-mail__pill')));

  // Keyboard first
  const keys = page.locator('.ta-feat--keys');
  await keys.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const kb = await keys.boundingBox();
  await page.mouse.move(kb.x + 20, kb.y + 20);
  await page.mouse.move(kb.x + kb.width / 2, kb.y + kb.height / 2, { steps: 4 });
  await page.waitForTimeout(200);
  await page.keyboard.down('e');
  await page.waitForTimeout(80);
  const down = await page.$eval('.ta-key[aria-label^="E:"]', el => el.classList.contains('is-down'));
  await shot(page, 'd11-keys-down');
  await page.keyboard.up('e');
  ok('keycap depresses on real key press while hovered', down);
  ok('keyboard readout shows action', (await page.$eval('.ta-keys__readout', el => el.textContent)).includes('Mark done'));
  await page.click('.ta-key[aria-label^="R:"]');
  await page.waitForTimeout(300);
  ok('keycap click updates readout', (await page.$eval('.ta-keys__readout', el => el.textContent)).includes('Reply'));

  // People wall: hanging columns, parallax drift, 3D tilt + name chip on hover
  await page.evaluate(() => window.scrollTo(0, document.getElementById('people-wall').offsetTop - 200));
  await page.waitForTimeout(1600);
  const visCols = await page.$$eval('.ta-wall__col', els => els.filter(e => e.offsetParent !== null).length);
  ok('people wall shows 10 hanging columns at 1440', visCols === 10, `cols=${visCols}`);
  const imgsOk = await page.$$eval('.ta-wall__card img', els =>
    els.filter(i => i.complete && i.naturalWidth >= 100 && /w=224.*h=280.* 2x/.test(i.srcset)).length
  );
  ok('wall portraits load, with 2x sources', imgsOk >= 10, `loaded=${imgsOk}`);
  const ysA = await page.$$eval('.ta-wall__col', els => els.map(e => Math.round(e.getBoundingClientRect().top)));
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(1200);
  const ysB = await page.$$eval('.ta-wall__col', els => els.map(e => Math.round(e.getBoundingClientRect().top)));
  const moved = ysA.map((y, i) => ysB[i] - y);
  ok('wall columns drift at different speeds', new Set(moved.map(m => Math.round(m / 4))).size >= 3, moved.join(','));
  const target = page.locator('.ta-wall__col').nth(3).locator('.ta-wall__card').first();
  const tbx = await target.boundingBox();
  await page.mouse.move(tbx.x + tbx.width * 0.85, tbx.y + tbx.height * 0.2, { steps: 6 });
  await page.waitForTimeout(900);
  const tf = await target.evaluate(el => getComputedStyle(el).transform);
  ok('hovered wall card tilts in 3D', tf.startsWith('matrix3d'), tf.slice(0, 40));
  const chip = page.locator('.ta-wall__col').nth(3).locator('.ta-wall__chip').first();
  const chipOp = await chip.evaluate(el => +getComputedStyle(el).opacity);
  ok('hovered wall card shows name + role chip', chipOp > 0.9 && (await chip.textContent()).includes('Sofia Reyes'), `opacity=${chipOp}`);
  await shot(page, 'd11b-people-wall-hover');
  await page.mouse.move(5, 5);
  await page.waitForTimeout(1300);
  const settled = await target.evaluate(el => {
    const t = getComputedStyle(el).transform;
    if (t === 'none') return true;
    const m = t.replace(/^matrix(3d)?\(|\)$/g, '').split(',').map(Number);
    return m.length === 16 ? Math.abs(m[0] - 1) < 0.01 && Math.abs(m[2]) < 0.01 && Math.abs(m[6]) < 0.01 : Math.abs(m[0] - 1) < 0.01;
  });
  ok('wall card settles flat after hover', settled);

  // Workflows
  await page.evaluate(() => window.scrollTo(0, document.getElementById('workflows').offsetTop));
  await page.waitForTimeout(1200);
  await page.click('#ta-case-btn-services');
  await page.waitForTimeout(700);
  ok('case study expands', (await page.getAttribute('#ta-case-btn-services', 'aria-expanded')) === 'true' &&
    (await page.getAttribute('#ta-case-btn-studio', 'aria-expanded')) === 'false');
  await shot(page, 'd12-workflow');

  // Early access form
  await page.evaluate(() => window.scrollTo(0, document.getElementById('waitlist').offsetTop));
  await page.waitForTimeout(1200);
  await page.click('.ta-ea__submit');
  await page.waitForTimeout(300);
  const errs = await page.$$eval('.ta-ea .ta-err', e => e.map(x => x.textContent));
  ok('empty submit shows 3 errors', errs.length === 3, errs.join(' | '));
  ok('email aria-invalid', (await page.getAttribute('#ta-ea-email', 'aria-invalid')) === 'true');
  ok('focus moved to first invalid', await page.evaluate(() => document.activeElement?.id === 'ta-ea-email'));
  await shot(page, 'd13-form-errors');
  await page.fill('#ta-ea-email', 'jo@');
  await page.focus('#ta-ea-size');
  await page.waitForTimeout(200);
  ok('blur validates after first submit', (await page.$eval('#ta-ea-email-err', el => el.textContent).catch(() => '')).includes('complete'));
  await page.fill('#ta-ea-email', 'jo@studio.com');
  await page.selectOption('#ta-ea-size', '2–10 people');
  await page.click('.ta-eachip:has-text("Outlook")');
  await page.click('.ta-ea__submit');
  await page.waitForTimeout(200);
  ok('loading state', (await page.$eval('.ta-ea__submit', el => el.textContent)).includes('Holding'));
  await page.waitForTimeout(1300);
  const done = await page.$eval('.ta-ea__done', el => el.textContent).catch(() => '');
  ok('success state says demo', done.includes('demo list') && done.includes('doesn’t send emails'));
  await shot(page, 'd14-form-success');
  await page.click('.ta-ea__done .ta-btn');
  await page.waitForTimeout(300);
  ok('start over resets form', !!(await page.$('#ta-ea-email')));

  // Footer link back
  ok('footer has All concepts link', (await page.getAttribute('.ta-footer__back', 'href')) === '/');

  ok('desktop console clean', errors.length === 0, errors.slice(0, 5).join(' || '));
  await page.close();
}

/* ------------------------------------------------------------ mobile */
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => (m.type() === 'error' || m.type() === 'warning') && errors.push(m.type() + ': ' + m.text()));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const menuBtn = page.locator('.ta-nav__menu');
  await menuBtn.click();
  await page.waitForTimeout(300);
  ok('mobile menu opens', (await menuBtn.getAttribute('aria-expanded')) === 'true');
  ok('focus moves into menu', await page.evaluate(() => !!document.activeElement?.closest('.ta-nav__ring')));
  await shot(page, 'm01-menu');
  const lockY0 = await page.evaluate(() => scrollY);
  await page.mouse.move(195, 600);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(600);
  ok('open menu pauses page scrolling', Math.abs((await page.evaluate(() => scrollY)) - lockY0) < 4);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  ok('Escape closes menu', (await menuBtn.getAttribute('aria-expanded')) === 'false');
  await menuBtn.click();
  await page.waitForTimeout(300);
  await page.click('.ta-menu a[href="#features"]');
  await page.waitForTimeout(1900);
  ok('menu link closes menu', (await menuBtn.getAttribute('aria-expanded')) === 'false');
  const fTop = await page.$eval('#features', el => Math.round(el.getBoundingClientRect().top));
  ok('menu link scrolls to section', fTop > -60 && fTop < 140, `top=${fTop}`);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.click('.ta-strip__item:has-text("Sofia")');
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, document.getElementById('people-wall').offsetTop));
  await page.waitForTimeout(1200);
  ok('mobile wall shows 4 columns', (await page.$$eval('.ta-wall__col', els => els.filter(e => e.offsetParent !== null).length)) === 4);
  await shot(page, 'm03-people-wall');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  ok('mobile people strip switches conversation', (await page.$eval('.ta-main__title strong', el => el.textContent)) === 'Sofia Reyes');
  await page.evaluate(() => window.scrollTo(0, document.querySelector('.ta-win').getBoundingClientRect().top + scrollY - 80));
  await page.waitForTimeout(400);
  await shot(page, 'm02-inbox');

  await page.click('.ta-nav__cta');
  await page.waitForTimeout(1900);
  ok('mobile waitlist CTA focuses form', await page.evaluate(() => document.activeElement?.id === 'ta-ea-email'));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok('mobile no horizontal overflow', overflow === 0, `overflow=${overflow}`);
  ok('mobile console clean', errors.length === 0, errors.slice(0, 5).join(' || '));
  await page.close();
}

/* ------------------------------------------------------------ reduced motion */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, document.getElementById('people-wall').offsetTop));
  await page.waitForTimeout(800);
  const st = await page.$$eval('.ta-wall__col, .ta-wall__item', els => els.map(e => [getComputedStyle(e).transform, +getComputedStyle(e).opacity]));
  ok('reduced motion: wall is static and visible', st.every(([t, o]) => t === 'none' && o === 1), JSON.stringify(st.find(([t, o]) => t !== 'none' || o !== 1) || ''));
  await page.close();
}

await browser.close();
console.log(results.join('\n'));
console.log(`\n${results.filter(r => r.startsWith('PASS')).length}/${results.length} passed`);
