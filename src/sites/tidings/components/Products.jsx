import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import SectionHead from './SectionHead.jsx';
import { Avatar, Ticks } from './Phone.jsx';
import { copyText, useTidings, useProgress } from '../hooks.jsx';
import { PEOPLE, fmt, money } from '../data.js';
import { IconCart, IconCheck, IconClock, IconCopy, IconReplay, IconSend, Spinner } from '../icons.jsx';

const clamp01 = v => Math.max(0, Math.min(1, v));
const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/* ---------- 1. Broadcasts ---------- */
function Broadcast() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [run, setRun] = useState(0);
  const p = useProgress(inView, 5200, run);
  const total = 15240;
  const aud = easeInOut(clamp01(p / 0.22));
  const sendP = easeInOut(clamp01((p - 0.18) / 0.72));
  const sent = Math.round(total * sendP);
  const delivered = Math.round(total * 0.97 * easeInOut(clamp01((p - 0.24) / 0.7)));
  const read = Math.round(total * 0.812 * easeInOut(clamp01((p - 0.34) / 0.66)));
  const done = p >= 1;
  return (
    <div className="ar-vig ar-bc" ref={ref}>
      <div className="ar-bc-panel">
        <div className="ar-bc-head">
          <span className="ar-bc-name">Spring linen drop · Fern &amp; Field</span>
          <span className={`ar-bc-state ${done ? 'is-done' : ''}`}>
            {done ? (
              <>
                <IconCheck size={13} sw={2.6} /> Sent
              </>
            ) : p > 0.18 ? (
              'Sending'
            ) : (
              'Queued'
            )}
          </span>
        </div>
        <div className="ar-bc-aud">
          <span className="ar-bc-count">{fmt(total * aud)}</span>
          <span className="ar-bc-unit">unique contacts</span>
        </div>
        <ul className="ar-bc-segs" role="list" aria-label="Segments">
          <li>Regulars · 2,180</li>
          <li>Recent orders · 4,320</li>
          <li>Newsletter list · 9,600</li>
        </ul>
        <div
          className="ar-bc-bar"
          role="progressbar"
          aria-label="Broadcast progress (sample)"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(sendP * 100)}
        >
          <span style={{ transform: `scaleX(${sendP})` }} />
        </div>
        <dl className="ar-bc-stats">
          <div>
            <dt>Sent</dt>
            <dd>{fmt(sent)}</dd>
          </div>
          <div>
            <dt>Delivered</dt>
            <dd>{fmt(delivered)}</dd>
          </div>
          <div>
            <dt>Read</dt>
            <dd>{fmt(read)}</dd>
          </div>
        </dl>
      </div>
      <button type="button" className="ar-replay" onClick={() => setRun(r => r + 1)} disabled={!done}>
        <IconReplay size={14} sw={2} /> Replay
      </button>
    </div>
  );
}

/* ---------- 2. Product messages ---------- */
function Links() {
  const [copied, setCopied] = useState(false);
  const url = 'casaverde.example/spring?c=hannah';
  const timer = useRef();
  const copy = async () => {
    const ok = await copyText(`https://${url}`);
    setCopied(ok ? 'ok' : 'fail');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  };
  return (
    <div className="ar-vig ar-links">
      <div className="ar-wa-wall">
        <div className="ar-mini-msg is-me">
          <div className="ar-lp">
            <div className="ar-lp-thumb" aria-hidden="true">
              <span className="ar-lp-pct">£58</span>
              <span className="ar-lp-tag">Six courses</span>
            </div>
            <div className="ar-lp-text">
              <span className="ar-lp-title">Spring tasting menu</span>
              <span className="ar-lp-desc">Six courses, from £58 a head. Thursdays to Sundays.</span>
              <span className="ar-lp-domain">casaverde.example</span>
            </div>
          </div>
          <p>
            Hannah, the new spring menu starts this week. Book a table here: <span className="ar-fake-link">{url}</span>
          </p>
          <span className="ar-msg-meta">
            09:30 <Ticks animate={false} />
          </span>
        </div>
      </div>
      <div className="ar-copy-row">
        <span className="ar-copy-url">{url}</span>
        <button type="button" className={`ar-copy-btn ${copied === 'ok' ? 'is-ok' : ''}`} onClick={copy}>
          {copied === 'ok' ? <IconCheck size={15} sw={2.4} /> : <IconCopy size={15} sw={2} />}
          <span aria-live="polite">{copied === 'ok' ? 'Copied' : copied === 'fail' ? 'Copy failed' : 'Copy link'}</span>
        </button>
      </div>
    </div>
  );
}

/* ---------- 3. Pay in chat ---------- */
function Checkout() {
  const { region } = useTidings();
  const [state, setState] = useState('idle');
  const timer = useRef();
  const items = [
    { name: 'Linen camp shirt', meta: 'Sage · M', price: 58 },
    { name: 'Woven market basket', meta: 'Natural', price: 24 },
  ];
  const sub = items.reduce((s, i) => s + i.price, 0);
  const off = sub * 0.1;
  const total = sub - off;
  const m = v => money(v, region, { decimals: 2 });
  const pay = () => {
    setState('paying');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('paid'), 1100);
  };
  return (
    <div className="ar-vig ar-co">
      <div className="ar-co-bubble">
        <div className="ar-co-head">
          <span className="ar-co-ico" aria-hidden="true">
            <IconCart size={16} sw={2} />
          </span>
          <span>
            <span className="ar-co-title">Ready to pay</span>
            <span className="ar-co-sub">Fern &amp; Field · Order #7320</span>
          </span>
        </div>
        <ul className="ar-co-items" role="list">
          {items.map(i => (
            <li key={i.name}>
              <span>
                <span className="ar-co-name">{i.name}</span>
                <span className="ar-co-meta">{i.meta} · Qty 1</span>
              </span>
              <span className="ar-co-price">{m(i.price)}</span>
            </li>
          ))}
        </ul>
        <dl className="ar-co-sum">
          <div>
            <dt>Loyalty reward (10%)</dt>
            <dd className="is-off">−{m(off)}</dd>
          </div>
          <div>
            <dt>Delivery</dt>
            <dd>Free</dd>
          </div>
          <div className="is-total">
            <dt>Total</dt>
            <dd>{m(total)}</dd>
          </div>
        </dl>
        <button type="button" className={`ar-co-pay is-${state}`} onClick={state === 'paid' ? () => setState('idle') : pay} disabled={state === 'paying'}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={state}
              className="ar-co-pay-label"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {state === 'idle' && <>Pay {m(total)}</>}
              {state === 'paying' && (
                <>
                  <Spinner size={15} /> Processing…
                </>
              )}
              {state === 'paid' && (
                <>
                  <IconCheck size={15} sw={2.6} /> Paid · Reset demo
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <p className="ar-co-note" aria-live="polite">
        {state === 'paid' ? 'Demo checkout — no card was charged.' : 'Cards and wallets, without leaving the conversation.'}
      </p>
    </div>
  );
}

/* ---------- 4. Journeys ---------- */
const WAITS = [
  { id: '30m', label: '30 min', long: '30 minutes', left: '18m' },
  { id: '2h', label: '2 hours', long: '2 hours', left: '1h 12m' },
  { id: '24h', label: '24 hours', long: '24 hours', left: '21h' },
];

function Automation() {
  const [wait, setWait] = useState('2h');
  const [run, setRun] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const { region } = useTidings();
  const w = WAITS.find(x => x.id === wait);
  const runs = [
    { p: PEOPLE.daniel, cart: 64, status: 'Won back', tone: 'ok' },
    { p: PEOPLE.lena, cart: 38, status: `Nudge in ${w.left}`, tone: 'wait' },
    { p: PEOPLE.rafael, cart: 112, status: 'Nudge sent', tone: 'sent' },
  ];
  const nodes = [
    { k: 'When', t: 'Basket is left', s: 'From your shop or the API', I: IconCart },
    { k: 'Pause', t: `Wait ${w.long}`, s: 'Never during quiet hours', I: IconClock },
    { k: 'Then', t: 'Send a nudge', s: 'Cart reminder template', I: IconSend },
  ];
  return (
    <div className="ar-vig ar-flow" ref={ref}>
      <ol className="ar-flow-nodes" key={run} data-run={inView ? 'on' : 'off'}>
        {nodes.map((n, i) => (
          <li key={n.k} className="ar-flow-node" style={{ '--i': i }}>
            <span className="ar-flow-ico" aria-hidden="true">
              <n.I size={17} sw={2} />
            </span>
            <span className="ar-flow-k">{n.k}</span>
            <span className="ar-flow-t">{n.t}</span>
            <span className="ar-flow-s">{n.s}</span>
          </li>
        ))}
      </ol>
      <div className="ar-flow-ctrl">
        <span className="ar-flow-ctrl-label" id="ar-flow-wait">
          Pause before the nudge
        </span>
        <div className="ar-seg is-dark" role="radiogroup" aria-labelledby="ar-flow-wait">
          {WAITS.map(x => (
            <label key={x.id} className={`ar-seg-opt ${wait === x.id ? 'is-on' : ''}`}>
              <input
                type="radio"
                name="ar-flow-wait"
                className="sr-only"
                checked={wait === x.id}
                onChange={() => {
                  setWait(x.id);
                  setRun(r => r + 1);
                }}
              />
              {x.label}
            </label>
          ))}
        </div>
      </div>
      <div className="ar-runs">
        <p className="ar-runs-title">
          Latest journeys <span>sample</span>
        </p>
        <ul role="list">
          {runs.map(r => (
            <li key={r.p.id}>
              <Avatar person={r.p} size={28} />
              <span className="ar-runs-who">
                {r.p.first} · basket {money(r.cart, region)}
              </span>
              <span className={`ar-runs-st is-${r.tone}`}>{r.status}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="ar-flow-foot">The journey ends on its own as soon as the customer orders or replies.</p>
    </div>
  );
}

export default function Products() {
  return (
    <section id="products" className="ar-section ar-products" aria-labelledby="ar-products-title">
      <div className="ar-wrap">
        <SectionHead
          id="ar-products-title"
          eyebrow="Platform"
          title={
            <>
              Everything a <span className="ar-blue-text">chat‑first shop</span> needs
            </>
          }
          lead="Four connected tools on one opted-in audience — the message, the product, the payment and the follow-up all live in the same thread."
        />
        <div className="ar-bento" data-reveal="stagger" data-reveal-stagger="0.1" data-reveal-start="top 82%">
          <article id="product-broadcasts" className="ar-bento-card is-broadcast">
            <div className="ar-bento-copy">
              <span className="ar-bento-num">01</span>
              <h3 className="ar-h3">Broadcasts</h3>
              <p>Reach your whole opted-in list in one go, with every message personalised and sent at a pace WhatsApp is comfortable with.</p>
            </div>
            <Broadcast />
          </article>
          <article id="product-messages" className="ar-bento-card is-links">
            <div className="ar-bento-copy">
              <span className="ar-bento-num">02</span>
              <h3 className="ar-h3">Product messages</h3>
              <p>Share a card with photo, price and a button — plus a tracked short link that is unique to each customer.</p>
            </div>
            <Links />
          </article>
          <article id="product-pay" className="ar-bento-card is-checkout">
            <div className="ar-bento-copy">
              <span className="ar-bento-num">03</span>
              <h3 className="ar-h3">Pay in chat</h3>
              <p>Send a ready-to-pay order that customers settle in a couple of taps, right where the conversation happened.</p>
            </div>
            <Checkout />
          </article>
          <article id="product-journeys" className="ar-bento-card is-auto">
            <div className="ar-bento-copy">
              <span className="ar-bento-num">04</span>
              <h3 className="ar-h3">Journeys</h3>
              <p>Set a trigger, a pause and a message once — Tidings follows up on baskets, bookings and restocks for you.</p>
            </div>
            <Automation />
          </article>
        </div>
      </div>
    </section>
  );
}
