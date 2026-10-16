// Interaction test for /vantline. usage: node scripts/qa/vantline-test.mjs <shotDir>
import { chromium } from 'playwright-core';

const dir = process.argv[2] || '.';
const base = 'http://localhost:5173';
const results = [];
const ok = (name, cond, extra = '') => {
  results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`);
};
const wait = ms => new Promise(r => setTimeout(r, ms));

const browser = await chromium.launch({ channel: 'msedge', headless: true });

async function open(width, height, opts = {}) {
  const page = await browser.newPage({ viewport: { width, height }, ...opts });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text());
  });
  await page.goto(base + '/vantline', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  await page.waitForTimeout(1200);
  return { page, errors };
}
const topOf = (page, sel) => page.evaluate(s => Math.round(document.querySelector(s).getBoundingClientRect().top), sel);
const activeInfo = page => page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim().slice(0, 40), label: document.activeElement?.getAttribute('aria-label') }));

/* ---------------- Desktop 1440 ---------------- */
{
  const { page, errors } = await open(1440, 900);

  // Title + landmarks
  ok('document title', (await page.title()).startsWith('Vantline'));
  ok('one h1', (await page.locator('h1').count()) === 1);
  ok('landmarks', (await page.locator('header').count()) >= 1 && (await page.locator('main#main').count()) === 1 && (await page.locator('footer').count()) === 1);

  // Hero nav links scroll to their sections
  for (const [label, id] of [['Product', '#product'], ['Workflows', '#workflows'], ['Principles', '#principles'], ['Plans', '#plans']]) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await page.locator('.au-nav__center a', { hasText: label }).click();
    await page.waitForTimeout(500);
    const t = await topOf(page, id);
    ok(`hero nav "${label}" scrolls to ${id}`, Math.abs(t - 88) < 40, `top=${t}`);
  }

  // Floating nav visible after scrolling
  const floatVisible = await page.evaluate(() => document.querySelector('.au-float').classList.contains('is-visible'));
  ok('floating nav visible past hero', floatVisible);
  await page.locator('.au-float__links a', { hasText: 'Product' }).click();
  await page.waitForTimeout(500);
  ok('floating nav link works', Math.abs((await topOf(page, '#product')) - 88) < 40);

  // "Start free" (hero) opens drawer, Escape closes, focus returns
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.locator('.au-nav__signup').click();
  await page.waitForTimeout(800);
  ok('Start free opens dialog', await page.locator('[role="dialog"][aria-modal="true"]').isVisible());
  const focusInDialog = await page.evaluate(() => !!document.activeElement.closest('[role="dialog"]'));
  ok('focus moves into dialog', focusInDialog);
  // Tab cycles inside
  for (let i = 0; i < 20; i++) await page.keyboard.press('Tab');
  ok('focus trapped after 20 tabs', await page.evaluate(() => !!document.activeElement.closest('[role="dialog"]')));
  const bodyLocked = await page.evaluate(() => getComputedStyle(document.body).overflow === 'hidden');
  ok('scroll locked while open', bodyLocked);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
  ok('Escape closes dialog', (await page.locator('[role="dialog"][aria-modal="true"]').count()) === 0);
  const af = await activeInfo(page);
  ok('focus returns to Start free', af.text === 'Start free', JSON.stringify(af));

  // Hero CTA → form validation flow
  await page.locator('.au-hero__cta').click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${dir}/t-drawer-open.png` });
  await page.locator('.au-form button[type="submit"]').click();
  await page.waitForTimeout(300);
  const errCount = await page.locator('.au-field__error').count();
  ok('empty submit shows 3 errors', errCount === 3, `errors=${errCount}`);
  const invalid = await page.locator('[aria-invalid="true"]').count();
  ok('aria-invalid on 3 fields', invalid === 3);
  const describedOk = await page.evaluate(() =>
    [...document.querySelectorAll('[aria-invalid="true"]')].every(el => document.getElementById(el.getAttribute('aria-describedby'))));
  ok('aria-describedby points to error text', describedOk);
  ok('focus on first invalid field', (await page.evaluate(() => document.activeElement.id)).includes('name'));
  await page.screenshot({ path: `${dir}/t-drawer-errors.png` });
  await page.locator('.au-form input[type="text"]').fill('Ines Okafor');
  await page.locator('.au-form input[type="email"]').fill('mara@');
  await page.locator('.au-form select').focus();
  await page.waitForTimeout(150);
  const emailErr = await page.locator('.au-field__error').allTextContents();
  ok('blur validates email after first submit', emailErr.some(t => t.includes('email')), emailErr.join(' | '));
  ok("name error cleared once valid", !emailErr.some(t => t.includes("Please enter your name")));
  await page.locator('.au-form input[type="email"]').fill('ines@harbourlane.co');
  await page.locator('.au-form select').selectOption({ index: 2 });
  await page.locator('.au-form textarea').fill('Activation rate and weekly churn.');
  await page.locator('.au-form button[type="submit"]').click();
  await page.waitForTimeout(250);
  const loadingText = await page.locator('.au-form button[type="submit"]').textContent();
  ok('loading state shown', /Saving/.test(loadingText), loadingText);
  await page.waitForTimeout(1400);
  const doneText = await page.locator('.au-done').textContent().catch(() => '');
  ok('success says demo only, no account', /demo only/.test(doneText) && /no account was created/i.test(doneText));
  await page.screenshot({ path: `${dir}/t-drawer-success.png` });
  await page.locator('.au-done .au-btn').click();
  await page.waitForTimeout(800);
  ok('success Close button closes', (await page.locator('[role="dialog"][aria-modal="true"]').count()) === 0);

  // Scrim click closes
  await page.locator('.au-hero__cta').click();
  await page.waitForTimeout(800);
  ok('form resets on reopen', (await page.locator('.au-form').count()) === 1);
  await page.mouse.click(200, 450);
  await page.waitForTimeout(800);
  ok('scrim click closes', (await page.locator('[role="dialog"][aria-modal="true"]').count()) === 0);

  // Fan deck
  await page.evaluate(() => document.querySelector('#workflows').scrollIntoView());
  await page.waitForTimeout(1800);
  const cur = () => page.evaluate(() => document.querySelector('.au-fan__item.is-active .au-fan__title').textContent);
  ok('deck starts on Connect sources', (await cur()) === 'Connect sources');
  await page.locator('button[aria-label="Next stage"]').click();
  await page.waitForTimeout(1000);
  ok('next → Spot the shift', (await cur()) === 'Spot the shift');
  await page.screenshot({ path: `${dir}/t-fan-next.png` });
  await page.locator('.au-fan__item.is-active .au-fan__card').focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(900);
  ok('ArrowRight → Explain the cause', (await cur()) === 'Explain the cause');
  ok('focus follows active card', await page.evaluate(() => document.activeElement.closest('.au-fan__item')?.classList.contains('is-active')));
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(900);
  ok('ArrowLeft x2 → Connect sources', (await cur()) === 'Connect sources');
  // click a side card (the one 2 to the right)
  await page.locator('.au-fan__item', { hasText: 'Explain the cause' }).locator('button').click({ force: true });
  await page.waitForTimeout(1000);
  ok('click side card brings it to centre', (await cur()) === 'Explain the cause');
  await page.locator('button[aria-label="Previous stage"]').click();
  await page.waitForTimeout(900);
  ok('prev → Spot the shift', (await cur()) === 'Spot the shift');
  await page.screenshot({ path: `${dir}/t-fan-click.png` });
  await page.locator('a.au-pill', { hasText: 'Walk through the loop' }).click();
  await page.waitForTimeout(500);
  ok('"Walk through the loop" scrolls to #product', Math.abs((await topOf(page, '#product')) - 88) < 40);

  // Chart
  await page.evaluate(() => document.querySelector('.au-chart').scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(2600);
  const dBefore = await page.locator('.au-chart__line').getAttribute('d');
  await page.locator('.au-seg__btn', { hasText: '1W' }).click();
  await page.waitForTimeout(1100);
  const dAfter = await page.locator('.au-chart__line').getAttribute('d');
  ok('1W changes the line', dBefore !== dAfter);
  ok('1W aria-pressed', (await page.locator('.au-seg__btn', { hasText: '1W' }).getAttribute('aria-pressed')) === 'true');
  await page.locator('.au-seg__btn', { hasText: '1Q' }).click();
  await page.waitForTimeout(1100);
  const box = await page.locator('.au-chart__plot').boundingBox();
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5);
  await page.waitForTimeout(200);
  const tip = await page.locator('.au-chart__tip').textContent().catch(() => '');
  ok('hover shows tooltip with date + value', /\w{3}, \w{3} \d+/.test(tip) && /accounts/.test(tip), tip);
  await page.locator('.au-switch').click();
  await page.waitForTimeout(1100);
  ok('baseline switch on', (await page.locator('.au-switch').getAttribute('aria-checked')) === 'true');
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.5);
  await page.waitForTimeout(200);
  const tip2 = await page.locator('.au-chart__tip').textContent().catch(() => '');
  ok('tooltip includes last quarter when comparing', /Last quarter/.test(tip2), tip2);
  await page.screenshot({ path: `${dir}/t-chart.png` });
  await page.mouse.move(10, 10);
  await page.locator('.au-chart__plot').focus();
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(150);
  ok('keyboard inspect shows tooltip', await page.locator('.au-chart__tip').isVisible());

  // Slider
  const range = page.locator('.au-range');
  await range.focus();
  await page.keyboard.press('End');
  await page.waitForTimeout(100);
  const r1 = await page.locator('.au-depth__readout').textContent();
  await page.keyboard.press('Home');
  await page.waitForTimeout(100);
  const r2 = await page.locator('.au-depth__readout').textContent();
  ok('slider max → Full investigation · ~45s', r1 === 'Full investigation · ~45s', r1);
  ok('slider min → Skim · ~3s', r2 === 'Skim · ~3s', r2);
  await range.fill('45');
  await page.waitForTimeout(100);
  ok('slider mid → Cross-check', (await page.locator('.au-depth__readout').textContent()).startsWith('Cross-check'));
  await page.screenshot({ path: `${dir}/t-slider.png` });

  // Billing toggle + Choose buttons preselect the plan
  await page.evaluate(() => document.querySelector('#plans').scrollIntoView());
  await page.waitForTimeout(1600);
  await page.locator('#plans .au-billing__opt', { hasText: 'Yearly' }).click();
  await page.waitForTimeout(1000);
  const prices = await page.locator('.au-plan__amount').allTextContents();
  ok('yearly prices', prices[0] === '$19.20' && prices[1] === '$51.20', prices.join(', '));
  await page.screenshot({ path: `${dir}/t-pricing-yearly.png` });
  await page.locator('.au-plan--business .au-plan__cta').click();
  await page.waitForTimeout(800);
  const proChecked = await page.locator('.au-pick__input[value="business"]').isChecked();
  const drawerYearly = await page.locator('.au-drawer .au-billing__opt[aria-checked="true"]').textContent();
  ok('Choose Business preselects Business', proChecked);
  ok('drawer billing synced (Yearly)', /Yearly/.test(drawerYearly), drawerYearly);
  const pickPrice = await page.locator('.au-pick.is-on .au-pick__price').textContent();
  ok('drawer shows yearly Business price', pickPrice.startsWith('$51.20'), pickPrice);
  await page.screenshot({ path: `${dir}/t-drawer-business.png` });
  // switch plan + billing inside drawer
  await page.locator('.au-pick', { hasText: 'Team' }).click();
  await page.locator('.au-drawer .au-billing__opt', { hasText: 'Monthly' }).click();
  await page.waitForTimeout(300);
  await page.locator('.au-drawer__close').click();
  await page.waitForTimeout(900);
  const prices2 = await page.locator('.au-plan__amount').allTextContents();
  ok('drawer billing change syncs back to pricing', prices2[0] === '$24.00', prices2.join(', '));
  await page.locator('.au-plan--team .au-plan__cta').click();
  await page.waitForTimeout(700);
  ok('Choose Team preselects Team', await page.locator('.au-pick__input[value="team"]').isChecked());
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);

  // Background scrub reaches deep at the CTA band
  await page.evaluate(() => { const b = document.querySelector('.au-cta'); window.scrollTo(0, b.getBoundingClientRect().top + scrollY - innerHeight * 0.3); });
  await page.waitForTimeout(1500);
  const bg = await page.evaluate(() => getComputedStyle(document.querySelector('.au')).backgroundColor);
  ok('page background scrubbed to near-black', bg === 'rgb(17, 21, 17)', bg);
  await page.locator('.au-cta .au-pill').click();
  await page.waitForTimeout(700);
  ok('CTA band button opens drawer', await page.locator('[role="dialog"][aria-modal="true"]').isVisible());
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);

  // Footer
  await page.locator('.au-footer button', { hasText: 'Request the Business plan' }).click();
  await page.waitForTimeout(700);
  ok('footer "Request the Business plan" opens with Business', await page.locator('.au-pick__input[value="business"]').isChecked());
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);
  await page.locator('.au-footer a', { hasText: 'Back to top' }).click();
  await page.waitForTimeout(400);
  ok('Back to top', (await page.evaluate(() => scrollY)) < 20);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(400);
  await page.locator('.au-footer a', { hasText: 'All concepts' }).click();
  await page.waitForTimeout(800);
  ok('All concepts goes to index', new URL(page.url()).pathname === '/');
  await page.goBack();
  await page.waitForTimeout(1200);
  ok('back to /vantline renders', (await page.locator('.au-hero__title').count()) === 1);

  // Skip link
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.keyboard.press('Tab');
  const skip = await activeInfo(page);
  ok('first Tab reaches skip link', skip.text === 'Skip to content', JSON.stringify(skip));

  ok('desktop console clean', errors.length === 0, errors.slice(0, 5).join(' | '));
  await page.close();
}

/* ---------------- Mobile 390 ---------------- */
{
  const { page, errors } = await open(390, 844, { isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const btn = page.locator('.au-nav__menu');
  ok('menu button visible on mobile', await btn.isVisible());
  ok('menu aria-expanded false', (await btn.getAttribute('aria-expanded')) === 'false');
  await btn.click();
  await page.waitForTimeout(700);
  ok('menu opens', await page.locator('#au-menu [role="dialog"]').isVisible());
  ok('menu aria-expanded true', (await btn.getAttribute('aria-expanded')) === 'true');
  await page.screenshot({ path: `${dir}/t-m-menu.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
  ok('Escape closes menu', (await page.locator('#au-menu [role="dialog"]').count()) === 0);
  ok('focus back on menu button', (await activeInfo(page)).label === 'Open menu');
  await btn.click();
  await page.waitForTimeout(700);
  await page.locator('.au-menu__list a', { hasText: 'Plans' }).click();
  await page.waitForTimeout(900);
  ok('menu link closes menu', (await page.locator('#au-menu [role="dialog"]').count()) === 0);
  const pt = await topOf(page, '#plans');
  ok('menu link scrolls to #plans', Math.abs(pt - 88) < 60, `top=${pt}`);

  // Carousel
  await page.evaluate(() => document.querySelector('#workflows').scrollIntoView());
  await page.waitForTimeout(800);
  const cur = () => page.evaluate(() => document.querySelector('.au-fan__item.is-active .au-fan__title').textContent);
  ok('carousel starts at stage 1', (await cur()) === 'Connect sources');
  ok('prev disabled at start', await page.locator('button[aria-label="Previous stage"]').isDisabled());
  await page.locator('button[aria-label="Next stage"]').click();
  await page.waitForTimeout(900);
  ok('carousel next → stage 2', (await cur()) === 'Spot the shift');
  const sl = await page.evaluate(() => document.querySelector('.au-fan__list').scrollLeft);
  ok('carousel scrolled', sl > 50, `scrollLeft=${sl}`);
  await page.screenshot({ path: `${dir}/t-m-carousel.png` });

  // Drawer full-screen
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.locator('.au-nav__signup').click();
  await page.waitForTimeout(900);
  const pb = await page.locator('.au-drawer__panel').boundingBox();
  ok('drawer is full-screen sheet on mobile', pb && pb.width >= 389 && pb.x <= 1, JSON.stringify(pb));
  await page.screenshot({ path: `${dir}/t-m-drawer.png` });
  await page.locator('.au-drawer__close').click();
  await page.waitForTimeout(800);

  // Menu "Try Vantline free" opens drawer
  await btn.click();
  await page.waitForTimeout(700);
  await page.locator('.au-menu .au-pill').click();
  await page.waitForTimeout(900);
  ok('menu CTA opens drawer', await page.locator('.au-drawer__panel').isVisible());
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok('mobile no horizontal overflow', overflow === 0, `overflow=${overflow}`);
  ok('mobile console clean', errors.length === 0, errors.slice(0, 5).join(' | '));
  await page.close();
}

/* ---------------- Reduced motion ---------------- */
{
  const { page, errors } = await open(1440, 900, { reducedMotion: 'reduce' });
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('[data-au-reveal], .au-hero__line, .au-plan, .au-prism, .au-fan__item, [data-au-cta]')].filter(
      el => parseFloat(getComputedStyle(el).opacity) < 0.99
    ).length);
  ok('reduced motion: everything visible without scrolling', hidden === 0, `hidden=${hidden}`);
  const fanSpread = await page.evaluate(() => [...document.querySelectorAll('.au-fan__item')].map(e => e.style.transform).filter(Boolean).length);
  ok('reduced motion: fan laid out', fanSpread === 5);
  ok('reduced console clean', errors.length === 0, errors.slice(0, 5).join(' | '));
  await page.close();
}

await browser.close();
console.log(results.join('\n'));
console.log(`\n${results.filter(r => r.startsWith('PASS')).length}/${results.length} passed`);
