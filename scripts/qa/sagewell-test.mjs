// Interaction test for /sagewell. Usage: node scripts/qa/sagewell-test.mjs <outDir>
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const OUT = process.argv[2] || '.';
mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:5173/sagewell';
const results = [];
const errors = [];
const ok = (name, cond, extra = '') => results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`);
const wait = ms => new Promise(r => setTimeout(r, ms));

const browser = await chromium.launch({ channel: 'msedge', headless: true });

async function newPage(viewport, init) {
  const ctx = await browser.newContext({ viewport, permissions: ['clipboard-read', 'clipboard-write'] });
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`[${viewport.width}] pageerror: ${e.message}`));
  page.on('console', m => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${viewport.width}] ${m.type()}: ${m.text()}`);
  });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);
  return page;
}
const shot = (page, name) => page.screenshot({ path: `${OUT}/t-${name}.png` });
const clip = page => page.evaluate(() => navigator.clipboard.readText().catch(() => ''));

/* ---------------- Desktop ---------------- */
const page = await newPage({ width: 1440, height: 900 });
const ta = page.locator('#cr-prompt');
const send = page.getByRole('button', { name: 'Ask Sagewell' });

ok('page title is Sagewell', (await page.title()).startsWith('Sagewell'));
ok('h1 copy', (await page.locator('h1').innerText()).replace(/\s+/g, ' ').trim() === 'The model that thinks before it speaks.');

// Composer basics
ok('send disabled when empty', await send.isDisabled());
await ta.click();
await page.keyboard.type('first line');
await page.keyboard.press('Shift+Enter');
await page.keyboard.type('second line');
ok('shift+enter adds newline', (await ta.inputValue()).includes('\n'));
for (let i = 0; i < 8; i++) {
  await page.keyboard.press('Shift+Enter');
  await page.keyboard.type('more ' + i);
}
const grow = await ta.evaluate(el => ({ h: el.clientHeight, oy: getComputedStyle(el).overflowY }));
ok('textarea auto-grows then caps at ~5 lines', grow.h <= 5 * 22 + 4 && grow.h >= 100 && grow.oy === 'auto', JSON.stringify(grow));
ok('send enabled with text', !(await send.isDisabled()));
await ta.fill('');

// Sample chip fills composer
await page.getByRole('button', { name: 'Try the sample question: Which of these three suppliers is the riskiest, and why?' }).click();
ok('chip fills composer', (await ta.inputValue()) === 'Which of these three suppliers is the riskiest, and why?');
ok('chip focuses composer', await ta.evaluate(el => document.activeElement === el));
await ta.fill('');

// Plus popover
const plus = page.getByRole('button', { name: 'Add a document or change thinking depth' });
await plus.click();
await wait(100);
ok('popover opens', await page.locator('#cr-composer-menu').isVisible());
ok('popover moves focus inside', await page.evaluate(() => !!document.activeElement.closest('#cr-composer-menu')));
await shot(page, 'popover');
await page.keyboard.press('Escape');
ok('popover closes on Escape', !(await page.locator('#cr-composer-menu').count()));
ok('focus returns to plus', await plus.evaluate(el => document.activeElement === el));
await plus.click();
await page.locator('#cr-composer-menu label', { hasText: 'Thorough' }).click();
ok('depth chip appears', await page.getByText('Thorough depth').isVisible());
await page.mouse.click(200, 300);
ok('popover closes on outside click', !(await page.locator('#cr-composer-menu').count()));
await plus.click();
const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.locator('.cr-pop__item').click()]);
await chooser.setFiles({ name: 'harbour-survey.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(48213, 1) });
await wait(100);
ok('file chip shows name and size', await page.getByText('harbour-survey.pdf').isVisible(), (await page.locator('.cr-chip-in').first().innerText()).replace(/\s+/g, ' '));

// Submit a scripted example (Thorough depth, with a document)
await ta.fill('How would tides work on a planet with two moons?');
await page.keyboard.press('Enter');
await wait(1800);
ok('reasoning panel opens', await page.locator('.cr-reason').isVisible());
ok('demo label present', await page.getByText('Design demo · scripted reply, no live model').isVisible());
ok('document noted as not read', await page.getByText(/Document: harbour-survey\.pdf \(not read by this demo\)/).isVisible());
await shot(page, 'reasoning-mid');
await page.waitForSelector('.cr-reason__actions >> text=Copy reply', { timeout: 25000 });
const answer = await page.locator('.cr-answer').innerText();
ok('tides reply is the scripted one', /synodic/.test(answer) && /distance cubed/.test(answer));
await page.locator('.cr-reason').scrollIntoViewIfNeeded();
await shot(page, 'reasoning-done');
await page.getByRole('button', { name: 'Copy reply' }).click();
await wait(200);
ok('copy reply puts text on clipboard', (await clip(page)).includes('synodic'));
ok('copy shows Copied', await page.getByRole('button', { name: 'Copied' }).isVisible());
await page.getByRole('button', { name: 'New question' }).click();
ok('new question closes panel', !(await page.locator('.cr-reason').count()));
ok('new question focuses composer', await ta.evaluate(el => document.activeElement === el));

await page.getByRole('button', { name: 'Remove harbour-survey.pdf' }).click();
await page.getByRole('button', { name: 'Reset thinking depth to Standard' }).click();
ok('chips removable', !(await page.locator('.cr-chip-in').count()));

// Halt mid-run
await ta.fill('Why does my list re-render on every keystroke?');
await send.click();
await wait(1500);
await page.getByRole('button', { name: 'Halt' }).click();
ok('halt stops the run', await page.getByText(/Halted at/).isVisible());
await page.getByRole('button', { name: 'New question' }).click();

// Unknown question → honest fallback with scripted questions
await ta.fill('What is the best pizza topping?');
await page.keyboard.press('Enter');
await page.waitForSelector('.cr-reason__examples', { timeout: 10000 });
ok('fallback explains demo limits', /design demo/i.test(await page.locator('.cr-answer').innerText()));
await page.locator('.cr-reason').scrollIntoViewIfNeeded();
await shot(page, 'reasoning-fallback');
await page.locator('.cr-reason__examples button', { hasText: 'Why does my list re-render' }).click();
ok('fallback chip loads question', (await ta.inputValue()) === 'Why does my list re-render on every keystroke?');
ok('panel cleared after picking', !(await page.locator('.cr-reason').count()));
await ta.fill('');

// Dictation (real API in Edge; may error in headless — record what happens)
await page.getByRole('button', { name: /Dictate a question/ }).click();
await wait(1200);
const mic = await page.evaluate(() => ({
  pressed: document.querySelector('.cr-mic').getAttribute('aria-pressed'),
  note: document.querySelector('.cr-composer__note').textContent,
}));
ok('mic responds (listening or explains)', mic.pressed === 'true' || mic.note.length > 0, JSON.stringify(mic));
if (mic.pressed === 'true') await page.getByRole('button', { name: 'Stop dictation' }).click();

// Badge → release note
await page.evaluate(() => window.scrollTo(0, 0));
await page.getByRole('button', { name: /Sagewell 2 reads a million tokens/ }).click();
await page.waitForSelector('[role="dialog"] >> text=Introducing Sagewell 2', { timeout: 4000 }).catch(() => {});
ok('badge opens the release note', await page.locator('[role="dialog"]').getByText('Introducing Sagewell 2').first().isVisible());
await shot(page, 'note-reader');
await page.getByRole('button', { name: /^Read next:/ }).click();
ok('next entry navigates', (await page.locator('#cr-reader-title').innerText()).includes('Reading a reasoning trace'));
await page.keyboard.press('Escape');
await wait(400);
ok('reader closes on Escape', !(await page.locator('[role="dialog"]').count()));
ok('focus returns to journal row', await page.evaluate(() => document.activeElement?.id === 'note-introducing'));

// Floating nav
await page.evaluate(() => window.scrollTo(0, 1600));
await wait(600);
ok('floating nav visible after hero', await page.locator('.cr-float').isVisible());
await page.locator('.cr-float').getByRole('link', { name: 'Pricing' }).click();
await wait(1600);
const pricingTop = await page.evaluate(() => document.getElementById('pricing').getBoundingClientRect().top);
ok('floating nav link scrolls to section', pricingTop >= 0 && pricingTop < 220, `top=${pricingTop}`);
await shot(page, 'float-nav-pricing');

// Pricing estimator
const num = () => page.locator('.cr-calc__num').innerText();
ok('default estimate', (await num()) === '$510', await num());
await page.locator('.cr-calc label', { hasText: 'sagewell-2-swift' }).click();
await wait(900);
ok('estimate updates for swift', (await num()) === '$63', await num());
await page.locator('#cr-calc-req').fill('9');
await wait(900);
ok('questions slider updates total', (await num()) === '$1,260', await num());

// Getting started tabs
await page.evaluate(() => document.getElementById('developers').scrollIntoView());
await wait(500);
await page.getByRole('tab', { name: /Ask with a trail/ }).click();
ok('step click updates terminal', (await page.locator('.cr-term__file').innerText()) === 'ask.ts');
await page.keyboard.press('ArrowUp');
await wait(400);
ok('arrow keys move between steps', (await page.locator('.cr-qs [role=tab][aria-selected=true]').innerText()).includes('Add the client'));
await page.locator('.cr-term__copy').click();
await wait(150);
ok('terminal copy copies commands', (await clip(page)).includes('pnpm add @sagewell/client'));

// Playground
await page.evaluate(() => document.getElementById('playground').scrollIntoView());
await wait(400);
await page.getByRole('tab', { name: 'TypeScript', exact: true }).click();
ok('TypeScript tab', (await page.locator('#cr-code-panel').innerText()).includes('await sw.answers.create({'));
await page.keyboard.press('ArrowRight');
ok('arrow keys reach HTTP tab', (await page.locator('#cr-code-panel').innerText()).includes('curl https://api.sagewell.example/v2/answers'));
await page.locator('.cr-code select').selectOption('sagewell-2-swift');
await page.locator('#cr-depth').fill('2');
const code = await page.locator('#cr-code-panel').innerText();
ok('model + depth rewrite the request', code.includes('"sagewell-2-swift"') && code.includes('"depth": "thorough"'));
await page.locator('.cr-code__copy').click();
await wait(150);
ok('playground copy feedback', (await page.locator('.cr-code__copy').innerText()).includes('Copied'));
await shot(page, 'playground');

// Research: kinetic pass pills
await page.evaluate(() => document.querySelector('.cr-pills').scrollIntoView({ block: 'center' }));
await wait(500);
await shot(page, 'pills-mid');
await wait(2600);
const pills = await page.evaluate(() =>
  [...document.querySelectorAll('.cr-pill')].map(li => {
    const bg = getComputedStyle(li.querySelector('.cr-pill__bg'));
    const chip = getComputedStyle(li.querySelector('.cr-pill__chip'));
    return {
      word: li.querySelector('.cr-pill__word').textContent.replace(/^Pass \d+: /, ''),
      side: li.dataset.side,
      settled: bg.opacity === '1' && (bg.transform === 'none' || bg.transform === 'matrix(1, 0, 0, 1, 0, 0)') && chip.opacity === '1',
    };
  })
);
ok('four pass pills in order', pills.map(p => p.word).join(' · ') === 'Plan · Investigate · Cross-check · Conclude', pills.map(p => p.word).join(' · '));
ok('pills alternate sides', pills.map(p => p.side).join('') === 'lrlr');
ok('pills slide in and settle at full width', pills.every(p => p.settled));
const dots = await page.evaluate(() => {
  const all = [...document.querySelectorAll('.cr-pills__dot')];
  return { n: all.length, visible: all.filter(d => getComputedStyle(d).opacity === '1').length };
});
ok('dotted connector drawn', dots.n > 20 && dots.visible === dots.n, JSON.stringify(dots));
await shot(page, 'pills-end');

// In practice → composer, then run it
await page.evaluate(() => document.getElementById('use-cases').scrollIntoView());
await wait(1400);
await page.getByRole('button', { name: /Ask this: send “Should we build our own billing/ }).click();
await wait(1600);
ok('use case loads composer', (await ta.inputValue()) === 'Should we build our own billing system or buy one?');
ok('use case scrolls to top', (await page.evaluate(() => window.scrollY)) < 40);
await page.keyboard.press('Enter');
await page.waitForSelector('.cr-reason__actions >> text=Copy reply', { timeout: 20000 });
ok('use-case question has a scripted reply', (await page.locator('.cr-answer').innerText()).includes('Buy by default'));
await page.getByRole('button', { name: 'New question' }).click();

// Request access modal
await page.locator('.cr-header__cta').click();
await wait(500);
const dialog = page.locator('[role="dialog"]');
ok('access modal opens', await dialog.getByText('Request early access').isVisible());
await dialog.getByRole('button', { name: 'Save my request' }).click();
const errs = await dialog.locator('.cr-form__err').count();
ok('empty submit shows 4 errors', errs === 4, String(errs));
ok('first invalid field focused', await page.evaluate(() => document.activeElement?.id === 'cr-f-name'));
ok('aria-describedby wired', (await page.locator('#cr-f-email').getAttribute('aria-describedby')) === 'cr-f-email-err');
await shot(page, 'access-errors');
await page.locator('#cr-f-name').fill('Rowan Tide');
await page.locator('#cr-f-email').fill('rowan@');
await page.locator('#cr-f-company').focus();
ok('email re-validated on blur', /looks incomplete/.test(await dialog.innerText()));
await page.locator('#cr-f-email').fill('rowan@harbour.studio');
await page.locator('#cr-f-build').selectOption('Engineering tools');
await page.locator('#cr-f-agree').check();
await dialog.getByRole('button', { name: 'Save my request' }).click();
ok('loading state', await dialog.getByText('Saving…').isVisible());
await page.waitForSelector('text=nothing was sent', { timeout: 3000 });
ok('success says demo only', await dialog.getByText('Request saved in this demo only — no account was created and nothing was sent.').isVisible());
const key = await dialog.locator('.cr-key__value').innerText();
ok('masked demo key', /^sw_demo_/.test(key) && key.includes('•'), key);
await dialog.getByRole('button', { name: 'Copy' }).click();
await wait(150);
ok('demo key copies in full', /^sw_demo_[0-9a-f]{24}$/.test(await clip(page)));
await shot(page, 'access-success');
await dialog.getByRole('button', { name: 'Back to the page' }).click();
await wait(400);
ok('access modal closes', !(await page.locator('[role="dialog"]').count()));

ok('footer links to concept index', (await page.locator('.cr-footer a[href="/"]').count()) >= 1);
ok('footer concept line', await page.getByText('Sagewell is a concept product for a design portfolio.', { exact: false }).isVisible());
await page.context().close();

/* ---------------- No speech support ---------------- */
const p2 = await newPage({ width: 1440, height: 900 }, () => {
  delete window.SpeechRecognition;
  delete window.webkitSpeechRecognition;
  window.webkitSpeechRecognition = undefined;
});
await p2.getByRole('button', { name: 'Dictate a question' }).click();
await wait(200);
ok('unsupported browser shows note', (await p2.locator('.cr-composer__note').innerText()).includes('can’t take dictation'));
await p2.context().close();

/* ---------------- Mobile ---------------- */
const m = await newPage({ width: 390, height: 844 });
const menuBtn = m.locator('.cr-header .cr-menu-btn');
await menuBtn.click();
await wait(400);
ok('mobile menu opens', await m.locator('#cr-menu').isVisible());
ok('menu button aria-expanded', (await menuBtn.getAttribute('aria-expanded')) === 'true');
await m.screenshot({ path: `${OUT}/t-m-menu.png` });
await m.keyboard.press('Escape');
await wait(400);
ok('mobile menu closes on Escape', !(await m.locator('#cr-menu').count()));
await menuBtn.click();
await wait(400);
await m.locator('#cr-menu').getByRole('link', { name: /Pricing/ }).click();
await wait(2200);
const mp = await m.evaluate(() => document.getElementById('pricing').getBoundingClientRect().top);
ok('menu link closes and scrolls', !(await m.locator('#cr-menu').count()) && mp >= 0 && mp < 220, `top=${mp}`);
await m.evaluate(() => window.scrollTo(0, 0));
await wait(300);
await m.locator('#cr-prompt').fill('What are the real trade-offs of a four-day work week?');
await m.keyboard.press('Enter');
await m.waitForSelector('.cr-reason__actions >> text=Copy reply', { timeout: 20000 });
await m.locator('.cr-reason').scrollIntoViewIfNeeded();
await m.screenshot({ path: `${OUT}/t-m-reasoning.png` });
const ov = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
ok('no horizontal overflow on mobile with panel open', ov === 0, String(ov));
await m.locator('.cr-header .cr-menu-btn').click();
await wait(300);
await m.locator('#cr-menu').getByRole('button', { name: 'Request access' }).click();
await wait(700);
ok('access opens as bottom sheet on mobile', (await m.locator('.cr-modal--sheet').count()) === 1);
await m.screenshot({ path: `${OUT}/t-m-sheet.png` });
await m.context().close();

await browser.close();
console.log(results.join('\n'));
console.log(`\n${results.filter(r => r.startsWith('PASS')).length}/${results.length} passed`);
console.log(errors.length ? 'Console:\n' + errors.join('\n') : 'Console: no errors or warnings');
