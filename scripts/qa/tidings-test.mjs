// Interaction test for /tidings. usage: node scripts/qa/tidings-test.mjs <outDir>
import { chromium } from 'playwright-core';

const out = process.argv[2] || '.';
const base = process.env.SHOT_BASE || 'http://localhost:5173';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const results = [];
const errors = [];
const ok = (name, cond, extra = '') => {
  results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`);
};

async function newPage(width, height, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: opts.reduced ? 'reduce' : 'no-preference', permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`[${width}] pageerror: ${e.message}`));
  page.on('console', m => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${width}] ${m.type()}: ${m.text()}`);
  });
  await page.goto(base + '/tidings', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  return page;
}
const shot = (page, name, full = false) => page.screenshot({ path: `${out}/t-${name}.png`, fullPage: full });
const inView = (page, sel) =>
  page.evaluate(s => {
    const r = document.querySelector(s).getBoundingClientRect();
    return r.top > -40 && r.top < innerHeight * 0.5;
  }, sel);

/* ================= Desktop ================= */
const page = await newPage(1440, 900);
try {

// --- Nav dropdowns
await page.getByRole('button', { name: 'Platform' }).click();
await page.waitForTimeout(300);
ok('Platform dropdown opens', await page.locator('.ar-dd-panel').isVisible());
await shot(page, 'nav-products');
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
ok('Escape closes dropdown', (await page.locator('.ar-dd-panel').count()) === 0);
ok('Focus returns to trigger', await page.evaluate(() => document.activeElement?.textContent?.includes('Platform')));
await page.getByRole('button', { name: 'Platform' }).click();
await page.locator('.ar-dd-panel').getByText('Pay in chat').click();
await page.waitForTimeout(1300);
ok('Dropdown link scrolls to #product-pay', await inView(page, '#product-pay'));
await page.getByRole('button', { name: 'Learn' }).click();
await page.locator('.ar-dd-panel').getByText('FAQ').click();
await page.waitForTimeout(1300);
ok('Learn > FAQ scrolls', await inView(page, '#faq'));
ok('Nav becomes sticky blurred bar', await page.locator('.ar-nav.is-scrolled').count() === 1);
await shot(page, 'nav-scrolled');

// --- Region switch
await page.locator('.ar-region-btn').first().click();
await page.getByRole('menuitemradio', { name: /United States/ }).click();
await page.waitForTimeout(500);
await page.evaluate(() => document.getElementById('pricing').scrollIntoView());
await page.waitForTimeout(800);
const starterUS = await page.locator('.ar-plan').first().locator('.ar-plan-amount').innerText();
ok('Region US → $ pricing', starterUS.includes('$19'), starterUS);
await page.locator('.ar-price-ctrls label', { hasText: 'EUR' }).click();
await page.waitForTimeout(500);
const growthEU = await page.locator('.ar-plan.is-featured .ar-plan-amount').innerText();
ok('Pricing currency control → €', growthEU.includes('€57'), growthEU);
await page.getByRole('button', { name: /Yearly/ }).click();
await page.waitForTimeout(600);
const growthYearly = await page.locator('.ar-plan.is-featured .ar-plan-amount').innerText();
ok('Yearly toggle → monthly-equivalent price', growthYearly.includes('€48'), growthYearly);
await shot(page, 'pricing-eu-yearly');
const navRegion = await page.locator('.ar-region-btn').first().innerText();
ok('Nav region reflects EU', navRegion.includes('EU'), navRegion);
await page.locator('.ar-price-ctrls label', { hasText: 'GBP' }).click();
await page.getByRole('button', { name: 'Monthly' }).click();

// --- Pricing CTA → wizard with plan preselected
await page.getByRole('button', { name: /Start on Starter/ }).click();
await page.waitForTimeout(500);
ok('Start on Starter opens wizard', await page.getByRole('dialog', { name: 'Launch a campaign' }).isVisible());
await page.keyboard.press('Escape');
await page.waitForTimeout(900);
ok('Untouched wizard closes on Escape', (await page.getByRole('dialog').count()) === 0);

// --- Scale → contact dialog
await page.getByRole('button', { name: /Talk to sales/ }).first().click();
await page.waitForTimeout(500);
const contact = page.getByRole('dialog', { name: 'Talk to sales' });
ok('Talk to sales opens contact dialog', await contact.isVisible());
await contact.getByRole('button', { name: /Send to the sales team/ }).click();
await page.waitForTimeout(200);
ok('Contact empty submit shows 3 errors', (await contact.locator('.ar-error').count()) === 3);
ok('Focus moved to first invalid field', await page.evaluate(() => document.activeElement?.id === 'ar-c-name'));
await contact.getByLabel('Your name').fill('Priya Shah');
await contact.getByLabel('Work email').fill('priya@');
await contact.getByLabel('Monthly volume').selectOption({ index: 2 });
await page.waitForTimeout(150);
ok('Invalid email error after first submit', (await contact.locator('#ar-c-email-err').innerText()).includes('valid'));
await shot(page, 'contact-errors');
await contact.getByLabel('Work email').fill('priya@example.com');
await contact.getByRole('button', { name: /Send to the sales team/ }).click();
await page.waitForTimeout(1300);
ok('Contact success says demo', (await contact.innerText()).includes('not sent'));
await shot(page, 'contact-success');
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// --- FAQ accordion
await page.evaluate(() => document.getElementById('faq').scrollIntoView());
await page.waitForTimeout(500);
const q3 = page.locator('#ar-faq-q2');
await q3.click();
await page.waitForTimeout(600);
ok('FAQ item opens', (await q3.getAttribute('aria-expanded')) === 'true');
ok('Only one FAQ open', (await page.locator('.ar-acc-btn[aria-expanded="true"]').count()) === 1);
await shot(page, 'faq');

// --- Login dialog
await page.evaluate(() => scrollTo(0, 0));
await page.getByRole('button', { name: 'Sign in' }).click();
await page.waitForTimeout(400);
const login = page.getByRole('dialog', { name: 'Welcome back to Tidings' });
ok('Sign in opens dialog', await login.isVisible());
ok('Login email autofocused', await page.evaluate(() => document.activeElement?.id === 'ar-login-email'));
await login.getByRole('button', { name: /sign-in link/ }).click();
ok('Login empty → error', (await login.locator('.ar-error').count()) === 1);
ok('aria-invalid set', (await login.getByLabel('Work email').getAttribute('aria-invalid')) === 'true');
await login.getByLabel('Work email').fill('sam@shop.co');
await login.getByRole('button', { name: /sign-in link/ }).click();
await page.waitForTimeout(1100);
ok('Login success says switched off in demo', (await login.innerText()).includes('switched off in this demo'));
await shot(page, 'login-success');
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
ok('Escape closes login', (await page.getByRole('dialog').count()) === 0);

// --- Wizard full flow (Get Started)
await page.getByRole('button', { name: 'Book a demo' }).click();
await page.waitForTimeout(500);
const wiz = page.getByRole('dialog', { name: 'Launch a campaign' });
await wiz.getByRole('button', { name: /Next/ }).click();
await page.waitForTimeout(200);
ok('Wizard step 1 empty → errors', (await wiz.locator('.ar-error').count()) >= 2);
await wiz.getByLabel('Business name').fill('Fern & Field');
await wiz.getByLabel('WhatsApp Business number').fill('07700 900');
await wiz.getByRole('button', { name: /Next/ }).click();
await page.waitForTimeout(200);
ok('Phone validation (E.164-ish)', (await wiz.locator('#ar-w-phone-err').innerText()).includes('+'));
await shot(page, 'wizard-step1-errors');
await wiz.getByLabel('WhatsApp Business number').fill('+44 7700 900123');
await wiz.getByRole('button', { name: /Next/ }).click();
await page.waitForTimeout(600);
ok('Wizard → step 2', await wiz.getByText('Pick a message and a list size').isVisible());
await wiz.getByRole('button', { name: /Next/ }).click();
await page.waitForTimeout(200);
ok('Step 2 empty → errors', (await wiz.locator('.ar-error').count()) === 2);
await wiz.locator('label.ar-tpl', { hasText: 'Reservation confirmed' }).click();
await wiz.locator('label.ar-aud', { hasText: '1,000 – 10,000' }).click();
await shot(page, 'wizard-step2');
// Escape when dirty → confirm
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
ok('Dirty Escape → discard confirm', await page.getByRole('alertdialog').isVisible());
await shot(page, 'wizard-confirm');
await page.getByRole('button', { name: 'Keep editing' }).click();
await page.waitForTimeout(300);
await wiz.getByRole('button', { name: /Next/ }).click();
await page.waitForTimeout(600);
ok('Wizard → review', await wiz.getByText('Check the details').isVisible());
const nameVal = await wiz.getByLabel('Campaign name').inputValue();
ok('Campaign name prefilled', nameVal.includes('Reservation confirmed'), nameVal);
await wiz.getByLabel('Campaign name').fill('Friday supper club');
await shot(page, 'wizard-review');
await wiz.getByRole('button', { name: /Save draft/ }).click();
await page.waitForTimeout(1500);
ok('Wizard success copy', (await wiz.innerText()).includes('nothing was sent and no account was created'));
await shot(page, 'wizard-saved');
await wiz.getByRole('button', { name: 'Done' }).click();
await page.waitForTimeout(500);

// --- Hero phone: signature 3D float/tilt/turn
const phoneTransform = () => page.evaluate(() => getComputedStyle(document.querySelector('.ar-phone-scroll')).transform);
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(1400);
const tTop = await phoneTransform();
await page.evaluate(() => scrollTo(0, 520));
await page.waitForTimeout(1600);
const tScrolled = await phoneTransform();
ok('Phone turns/rises on scroll (transform changes)', tTop !== tScrolled && tScrolled !== 'none', `${tTop} → ${tScrolled.slice(0, 60)}`);
await page.evaluate(() => scrollTo(0, 260));
await page.waitForTimeout(1200);
// rest the pointer on the phone (it holds still while hovered), then check tilt + hit-testing
const pb = await page.locator('.ar-phone--hero').boundingBox();
await page.mouse.move(pb.x + pb.width * 0.85, pb.y + 120);
await page.waitForTimeout(1300);
const tilt = await page.evaluate(() => getComputedStyle(document.querySelector('.ar-phone-tilt')).transform);
ok('Pointer tilts the phone', tilt !== 'none' && tilt.startsWith('matrix3d'), tilt.slice(0, 40));
const hit = await page.evaluate(() => {
  const row = document.querySelector('.ar-chat[data-chat="tomas"]');
  const r = row.getBoundingClientRect();
  return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest('.ar-chat') === row;
});
ok('Tilted phone keeps hit-testing (chat row under pointer)', hit);
await page.mouse.move(pb.x + pb.width / 2, pb.y + 160);
await page.waitForTimeout(1300);
await page.fill('#ar-chat-search', 'hannah');
await page.waitForTimeout(300);
ok('Chat search filters', (await page.locator('.ar-chat').count()) === 1);
await page.fill('#ar-chat-search', 'zzz');
ok('Chat search empty state', await page.getByText('No chats match').isVisible());
await page.getByRole('button', { name: 'Clear search' }).click();
ok('Clear search restores list', (await page.locator('.ar-chat').count()) === 6);
await page.locator('.ar-chat[data-chat="priya"]').click();
await page.waitForTimeout(700);
ok('Conversation opens + focus on back', await page.evaluate(() => document.activeElement?.classList.contains('ar-conv-back')));
await shot(page, 'phone-typing');
await page.waitForTimeout(3600);
ok('Messages animate in', (await page.locator('.ar-conv-log .ar-msg').count()) === 3);
ok('Quick-reply chips shown', (await page.locator('.ar-chip').count()) === 3);
await shot(page, 'phone-conversation');
await page.locator('.ar-chip').first().click();
await page.waitForTimeout(2600);
ok('Chip sends reply + gets answer', (await page.locator('.ar-conv-log .ar-msg').count()) === 5);
await page.locator('.ar-hero .ar-msg-action', { hasText: 'Reserve mine' }).click();
await page.waitForTimeout(500);
ok('Promo CTA opens in-phone link sheet', await page.locator('.ar-psheet').isVisible());
await shot(page, 'phone-sheet');
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
ok('Escape closes in-phone sheet', (await page.locator('.ar-psheet').count()) === 0);
await page.fill('#ar-compose-priya', 'See you soon!');
await page.keyboard.press('Enter');
await page.waitForTimeout(400);
ok('Composer sends message', (await page.locator('.ar-conv-log .ar-msg').count()) === 6);
await page.getByRole('button', { name: 'Back to chats' }).click();
await page.waitForTimeout(600);
ok('Back returns to list + focus on chat', await page.evaluate(() => document.activeElement?.dataset?.chat === 'priya'));
ok('Unread badge cleared for Priya', (await page.locator('.ar-chat[data-chat="priya"] .ar-chat-badge').count()) === 0);
await page.locator('.ar-fcard-link', { hasText: 'View booking' }).click({ force: true });
await page.waitForTimeout(3800);
ok('Booking card opens Tomás conversation', (await page.locator('.ar-hero .ar-conv-name').innerText()) === 'Tomás Ortega');
await shot(page, 'phone-tomas');
await page.locator('.ar-fcard-link', { hasText: 'Reserve mine' }).click({ force: true });
await page.waitForTimeout(800);
ok('Restock card opens Priya conversation', (await page.locator('.ar-hero .ar-conv-name').last().innerText()) === 'Priya Nair');
await page.getByRole('button', { name: 'Back to chats' }).click();

// --- Hero CTA
await page.getByRole('button', { name: /Launch a campaign/ }).first().click();
await page.waitForTimeout(400);
ok('Hero CTA opens wizard', await page.getByRole('dialog', { name: 'Launch a campaign' }).isVisible());
await page.keyboard.press('Escape');
await page.waitForTimeout(400);

// --- Products vignettes
await page.evaluate(() => document.getElementById('products').scrollIntoView());
await page.waitForTimeout(6200);
ok('Broadcast completes', (await page.locator('.ar-bc-state').innerText()).includes('Sent'));
await page.getByRole('button', { name: /Replay/ }).click();
await page.waitForTimeout(400);
ok('Replay restarts broadcast', !(await page.locator('.ar-bc-state').innerText()).includes('Sent'));
await page.getByRole('button', { name: /Copy link/ }).click();
await page.waitForTimeout(300);
ok('Copy link → Copied', (await page.locator('.ar-copy-btn').innerText()).includes('Copied'));
const clip = await page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
ok('Clipboard has link', clip.includes('casaverde.example'), clip);
await page.evaluate(() => document.getElementById('product-pay').scrollIntoView());
await page.locator('.ar-co-pay').click();
await page.waitForTimeout(1500);
ok('Pay → paid demo state', (await page.locator('.ar-co-note').innerText()).includes('no card was charged'));
await page.locator('.ar-flow-ctrl label', { hasText: '24 hours' }).click();
await page.waitForTimeout(300);
ok('Journey wait updates node', (await page.locator('.ar-flow-node').nth(1).innerText()).includes('24 hours'));
await shot(page, 'products-states');

// --- Builder
await page.evaluate(() => document.getElementById('builder').scrollIntoView());
await page.waitForTimeout(900);
await page.selectOption('#ar-b-tpl', 'reservation');
await page.waitForTimeout(200);
ok('Template fills textarea', (await page.inputValue('#ar-b-msg')).includes('Casa Verde'));
await page.click('#ar-b-msg');
await page.keyboard.press('Control+Home');
await page.locator('.ar-var-btn', { hasText: 'first_name' }).click();
ok('Variable inserted at cursor', (await page.inputValue('#ar-b-msg')).startsWith('{{first_name}}'));
await page.locator('.ar-check-chip', { hasText: 'Newsletter list' }).click();
await page.locator('.ar-check-chip', { hasText: 'Recent orders' }).click();
await page.waitForTimeout(200);
const est = await page.locator('.ar-ctl .ar-hint').first().innerText();
ok('Recipients estimate updates', est.includes('3,320'), est);
await page.locator('label.ar-seg-opt', { hasText: 'Pick a time' }).click();
await page.waitForTimeout(400);
ok('Datetime input appears', await page.locator('#ar-b-when').isVisible());
await page.locator('label.ar-person', { hasText: 'Tomás' }).click();
await page.waitForTimeout(200);
ok('Preview as Tomás', (await page.locator('.ar-builder-stage .ar-conv-name').innerText()) === 'Tomás Ortega');
ok('Variables substituted', (await page.locator('.ar-bmsg.is-draft').innerText()).includes('Tomás'));
await page.getByRole('button', { name: /Send test message/ }).click();
await page.waitForTimeout(500);
ok('Toast shown', (await page.locator('.ar-toast').innerText()).includes('nothing was sent'));
ok('Sent message appears in preview', (await page.locator('.ar-builder-stage .ar-conv-log .ar-msg').count()) === 1);
await page.waitForTimeout(1500);
await shot(page, 'builder-sent');
await page.fill('#ar-b-msg', '');
await page.getByRole('button', { name: /Send test message/ }).click();
ok('Empty message error', (await page.locator('#ar-b-err').innerText()).includes('Write a message'));

// --- Analytics tabs
await page.evaluate(() => document.getElementById('analytics').scrollIntoView());
await page.waitForTimeout(1500);
const before = await page.locator('.ar-frow-val').first().innerText();
await page.getByRole('tab', { name: 'Weekend table offer' }).click();
await page.waitForTimeout(1300);
const after = await page.locator('.ar-frow-val').first().innerText();
ok('Campaign tab changes funnel', before !== after && after.includes('5,860'), `${before} → ${after}`);
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(300);
ok('Arrow key moves tab', (await page.getByRole('tab', { name: 'Loyalty double points' }).getAttribute('aria-selected')) === 'true');
await page.locator('.ar-spark-plot').hover({ position: { x: 60, y: 40 } });
await page.waitForTimeout(1200);
await shot(page, 'analytics');

// --- How it works line drawn after scroll
await page.evaluate(() => document.getElementById('how').scrollIntoView());
await page.waitForTimeout(400);
await page.evaluate(() => scrollBy(0, 500));
await page.waitForTimeout(1200);
ok('How steps light up on scroll', (await page.locator('.ar-how-step.is-on').count()) >= 2);
await shot(page, 'how');

// --- Footer link back to index exists
ok('Footer has All concepts link', (await page.locator('footer a[href="/"]').count()) === 1);
} catch (e) {
  results.push('ERROR desktop: ' + e.message.split(String.fromCharCode(10))[0]);
  await shot(page, 'desktop-error');
}
await page.close();

/* ================= Mobile ================= */
const m = await newPage(390, 844);
try {
await m.getByRole('button', { name: 'Open menu' }).click();
await m.waitForTimeout(500);
ok('Mobile menu opens', await m.locator('#ar-mobile-menu').isVisible());
ok('Menu button aria-expanded', (await m.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded')) === 'true');
await shot(m, 'm-menu');
await m.keyboard.press('Escape');
await m.waitForTimeout(500);
ok('Escape closes mobile menu', (await m.locator('#ar-mobile-menu').count()) === 0);
await m.getByRole('button', { name: 'Open menu' }).click();
await m.waitForTimeout(400);
await m.locator('#ar-mobile-menu label', { hasText: 'US' }).click();
await m.locator('#ar-mobile-menu a', { hasText: 'Pricing' }).click();
await m.waitForTimeout(2400);
ok('Menu link closes menu + scrolls', (await m.locator('#ar-mobile-menu').count()) === 0 && (await inView(m, '#pricing')));
ok('Mobile region switch → $', (await m.locator('.ar-plan').first().locator('.ar-plan-amount').innerText()).includes('$'));
await m.evaluate(() => scrollTo(0, 0));
await m.waitForTimeout(400);
const mpb = await m.locator('.ar-phone--hero').boundingBox();
await m.mouse.move(mpb.x + mpb.width / 2, mpb.y + 150);
await m.waitForTimeout(1300);
await m.locator('.ar-chat[data-chat="tomas"]').click();
await m.waitForTimeout(4200);
await m.evaluate(() => scrollTo(0, 420));
await m.waitForTimeout(300);
await shot(m, 'm-phone-conv');
await m.getByRole('button', { name: 'Book a demo' }).click();
await m.waitForTimeout(500);
await shot(m, 'm-wizard');
await m.keyboard.press('Escape');
} catch (e) {
  results.push('ERROR mobile: ' + e.message.split(String.fromCharCode(10))[0]);
  await shot(m, 'mobile-error');
}
await m.close();

/* ================= Reduced motion ================= */
const r = await newPage(1440, 900, { reduced: true });
const hidden = await r.evaluate(() => [...document.querySelectorAll('main [data-reveal], .ar-h1-line, .ar-rise-card, .ar-rise-phone')].filter(e => getComputedStyle(e).opacity < 0.9).length);
ok('Reduced motion: nothing hidden', hidden === 0, `hidden=${hidden}`);
await r.locator('.ar-chat[data-chat="priya"]').click();
await r.waitForTimeout(300);
ok('Reduced motion: messages appear immediately', (await r.locator('.ar-conv-log .ar-msg').count()) === 3);
await r.close();

await browser.close();
console.log(results.join('\n'));
console.log(`\n${results.filter(x => x.startsWith('PASS')).length}/${results.length} passed`);
console.log(errors.length ? 'Console:\n' + [...new Set(errors)].slice(0, 20).join('\n') : 'Console: clean');
