import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import Avatar from './Avatar.jsx';
import { GROUPS, KEYCAPS, LANES, NUDGE_PRESETS, PEOPLE, SCREENER } from '../data.js';
import { isMac } from '../lib.js';
import * as I from '../icons.jsx';

const ease = [0.2, 0.7, 0.2, 1];
const spring = { type: 'spring', bounce: 0, duration: 0.55 };

/* ------------------------------------------------------------------ Screener */
function Screener() {
  const [where, setWhere] = useState(() => Object.fromEntries(SCREENER.map(s => [s.id, 'waiting'])));
  const [said, setSaid] = useState('');
  const list = key => SCREENER.filter(s => where[s.id] === key);
  const name = s => s.name || PEOPLE[s.person].name;

  const moveTo = (s, to) => {
    setWhere(w => ({ ...w, [s.id]: to }));
    setSaid(
      to === 'allowed'
        ? `${name(s)} is let in. Their mail reaches you from now on.`
        : to === 'blocked'
          ? `${name(s)} is turned away. You won’t hear from them again.`
          : `${name(s)} is waiting in the Screener again.`
    );
  };

  const waiting = list('waiting');
  const decided = [
    { key: 'allowed', label: 'Let in', note: 'Their mail reaches you directly', items: list('allowed') },
    { key: 'blocked', label: 'Turned away', note: 'Silenced for good', items: list('blocked') },
  ];

  return (
    <article className="ta-feat ta-feat--screener" aria-labelledby="ta-f-screener">
      <div className="ta-feat__text">
        <p className="ta-feat__kicker">
          <I.Shield size={15} /> Screener
        </p>
        <h3 id="ta-f-screener" className="ta-h3">
          New senders knock before they come in.
        </h3>
        <p className="ta-feat__body">
          The first email from anyone new waits in the Screener. Let a sender in once and they reach you from then on;
          turn them away and they never ping you again.
        </p>
        <p className="ta-feat__hint">Try it: let someone in, turn someone away, then undo.</p>
      </div>

      <LayoutGroup id="ta-screener">
        <div className="ta-scr">
          <div className="ta-scr__col ta-scr__col--wait">
            <p className="ta-scr__label">
              At the door <span>{waiting.length}</span>
            </p>
            <ul className="ta-scr__list" role="list">
              <AnimatePresence initial={false} mode="popLayout">
                {waiting.map(s => (
                  <motion.li
                    key={s.id}
                    layoutId={`ta-scr-${s.id}`}
                        layout="position"
                    transition={spring}
                    className="ta-scr__item"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {s.person ? (
                      <Avatar id={s.person} size={34} />
                    ) : (
                      <Avatar person={{ name: s.name, service: true }} size={34} />
                    )}
                    <span className="ta-scr__who">
                      <strong>{name(s)}</strong>
                      <span className="ta-scr__mail">{s.email}</span>
                      <span className="ta-scr__subj">{s.subject}</span>
                    </span>
                    <span className="ta-scr__actions">
                      <button type="button" className="ta-pillbtn ta-pillbtn--yes" onClick={() => moveTo(s, 'allowed')} aria-label={`Let in ${name(s)}`}>
                        <I.Check size={13} /> Let in
                      </button>
                      <button type="button" className="ta-pillbtn" onClick={() => moveTo(s, 'blocked')} aria-label={`Turn away ${name(s)}`}>
                        <I.Ban size={13} /> Turn away
                      </button>
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
              {waiting.length === 0 && (
                <li className="ta-scr__empty">Nobody is knocking right now.</li>
              )}
            </ul>
          </div>

          <div className="ta-scr__col ta-scr__col--done">
            {decided.map(d => (
              <div key={d.key} className={`ta-scr__bucket ta-scr__bucket--${d.key}`}>
                <p className="ta-scr__label">
                  <span className="ta-scr__lt">
                    {d.label}
                    <small>{d.note}</small>
                  </span>
                  <span>{d.items.length}</span>
                </p>
                <ul className="ta-scr__list" role="list">
                  <AnimatePresence initial={false} mode="popLayout">
                    {d.items.map(s => (
                      <motion.li
                        key={s.id}
                        layoutId={`ta-scr-${s.id}`}
                        layout="position"
                        transition={spring}
                        className="ta-scr__chip"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {s.person ? (
                          <Avatar id={s.person} size={22} />
                        ) : (
                          <Avatar person={{ name: s.name, service: true }} size={22} />
                        )}
                        <span>{name(s)}</span>
                        <button type="button" onClick={() => moveTo(s, 'waiting')} aria-label={`Undo, send ${name(s)} back to the Screener`}>
                          <I.Undo size={13} />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                  {d.items.length === 0 && <li className="ta-scr__none">No one so far</li>}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </LayoutGroup>
      <p className="sr-only" aria-live="polite">
        {said}
      </p>
    </article>
  );
}

/* ------------------------------------------------------------------ Lanes */
function SplitInbox() {
  const [tab, setTab] = useState('people');
  const refs = useRef({});
  const ids = GROUPS.map(g => g.id);

  const onKey = e => {
    const i = ids.indexOf(tab);
    let next = null;
    if (e.key === 'ArrowRight') next = ids[(i + 1) % ids.length];
    if (e.key === 'ArrowLeft') next = ids[(i - 1 + ids.length) % ids.length];
    if (e.key === 'Home') next = ids[0];
    if (e.key === 'End') next = ids[ids.length - 1];
    if (next) {
      e.preventDefault();
      setTab(next);
      refs.current[next]?.focus();
    }
  };

  return (
    <article className="ta-feat ta-feat--split" aria-labelledby="ta-f-split">
      <p className="ta-feat__kicker">
        <I.Inbox size={15} /> Lanes
      </p>
      <h3 id="ta-f-split" className="ta-h3">
        Colleagues, people, alerts: each in its own lane.
      </h3>
      <p className="ta-feat__body">
        Your team, the people you work with and the automated mail each get a lane, so an invoice never lands between
        you and someone waiting for an answer.
      </p>

      <div className="ta-split">
        <div className="ta-tabs" role="tablist" aria-label="Inbox lanes">
          {GROUPS.map(g => (
            <button
              key={g.id}
              ref={el => (refs.current[g.id] = el)}
              type="button"
              role="tab"
              id={`ta-tab-${g.id}`}
              aria-selected={tab === g.id}
              aria-controls="ta-tabpanel"
              tabIndex={tab === g.id ? 0 : -1}
              className={`ta-tab${tab === g.id ? ' is-on' : ''}`}
              onClick={() => setTab(g.id)}
              onKeyDown={onKey}
            >
              {tab === g.id && <motion.span layoutId="ta-tab-hl" className="ta-tab__hl" transition={spring} />}
              <span>{g.label}</span>
              <span className="ta-tab__n">{LANES[g.id].length}</span>
            </button>
          ))}
        </div>
        <div className="ta-split__panel" role="tabpanel" id="ta-tabpanel" aria-labelledby={`ta-tab-${tab}`} tabIndex={0}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={tab}
              role="list"
              className="ta-split__list"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.26, ease }}
            >
              {LANES[tab].map(item => (
                <li key={item.who + item.text} className="ta-split__item">
                  <Avatar id={item.who} size={30} letter={tab === 'notifications'} shape={tab === 'notifications' ? 'square' : 'circle'} />
                  <span className="ta-split__txt">
                    <strong>{PEOPLE[item.who].name}</strong>
                    <span>{item.text}</span>
                  </span>
                  <time>{item.time}</time>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ Nudges */
function FollowUp() {
  const [choice, setChoice] = useState(null);
  const [custom, setCustom] = useState('');
  const [error, setError] = useState('');
  const [pill, setPill] = useState(null);

  const pick = preset => {
    setChoice(preset.id);
    setError('');
    if (preset.pill) setPill(preset.pill);
  };

  const setCustomReminder = e => {
    e.preventDefault();
    if (!custom) {
      setError('Choose a date and a time first.');
      return;
    }
    const d = new Date(custom);
    if (Number.isNaN(d.getTime())) {
      setError('That date can’t be read. Try again.');
      return;
    }
    setError('');
    setPill(
      d.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    );
  };

  const clear = () => {
    setPill(null);
    setChoice(null);
    setCustom('');
    setError('');
  };

  return (
    <article className="ta-feat ta-feat--follow" aria-labelledby="ta-f-follow">
      <p className="ta-feat__kicker">
        <I.Clock size={15} /> Nudges
      </p>
      <h3 id="ta-f-follow" className="ta-h3">
        Silence brings it back to the top.
      </h3>
      <p className="ta-feat__body">Add a nudge to anything you send. If no reply arrives, the conversation climbs back to the top right on time.</p>

      <div className="ta-follow">
        <div className="ta-mail">
          <div className="ta-mail__top">
            <Avatar id="you" size={26} letter />
            <span className="ta-mail__meta">
              <span>
                To <strong>Theo Lindqvist</strong>
              </span>
              <time>Sent today, 09:05</time>
            </span>
            <AnimatePresence>
              {pill && (
                <motion.span
                  className="ta-mail__pill"
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <I.Clock size={12} />
                  {pill}
                  <button type="button" onClick={clear} aria-label="Remove nudge">
                    <I.Close size={11} />
                  </button>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <p className="ta-mail__subj">Signed contract, one last question</p>
          <p className="ta-mail__body">
            Hi Theo, the signed copy is attached. One question on the late fee: does it apply to partial deliveries as
            well?
          </p>
          <p className="ta-mail__status" aria-live="polite">
            {pill ? `Returns to the top ${pill} if Theo hasn’t answered.` : 'No nudge set yet.'}
          </p>
        </div>

        <div className="ta-chips" role="group" aria-label="Nudge me">
          {NUDGE_PRESETS.map(p => (
            <button
              key={p.id}
              type="button"
              className={`ta-chip${choice === p.id ? ' is-on' : ''}`}
              aria-pressed={choice === p.id}
              onClick={() => pick(p)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {choice === 'custom' && (
            <motion.form
              className="ta-custom"
              onSubmit={setCustomReminder}
              noValidate
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease }}
            >
              <label htmlFor="ta-custom-at">Your own time</label>
              <div className="ta-custom__row">
                <input
                  id="ta-custom-at"
                  type="datetime-local"
                  value={custom}
                  onChange={e => {
                    setCustom(e.target.value);
                    setError('');
                  }}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'ta-custom-err' : undefined}
                />
                <button type="submit" className="ta-btn ta-btn--ink ta-btn--sm">
                  Set
                </button>
              </div>
              {error && (
                <p id="ta-custom-err" className="ta-err">
                  {error}
                </p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ Keyboard */
function KeyboardFirst() {
  const [active, setActive] = useState(false);
  const [down, setDown] = useState({});
  const [last, setLast] = useState(null);
  const [mod, setMod] = useState('Ctrl');
  const hover = useRef(false);
  const focus = useRef(false);
  const timers = useRef({});

  useEffect(() => setMod(isMac() ? '⌘' : 'Ctrl'), []);
  const sync = () => setActive(hover.current || focus.current);

  useEffect(() => {
    if (!active) {
      setDown({});
      return;
    }
    const keyOf = e => (e.key === 'Enter' && (e.metaKey || e.ctrlKey) ? 'send' : e.key.toLowerCase());
    const kd = e => {
      if (e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      const k = keyOf(e);
      const cap = k === 'send' ? { key: 'send', cap: `${mod} ↵`, action: 'Send' } : KEYCAPS.find(c => c.key === k);
      if (!cap || (k !== 'send' && (e.metaKey || e.ctrlKey || e.altKey))) return;
      e.preventDefault();
      setDown(d => ({ ...d, [k]: true }));
      setLast(cap);
    };
    const ku = e => {
      const k = e.key.toLowerCase();
      setDown(d => ({ ...d, [k]: false, ...(k === 'enter' || k === 'control' || k === 'meta' ? { send: false } : {}) }));
    };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, [active, mod]);

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  const tap = cap => {
    setDown(d => ({ ...d, [cap.key]: true }));
    setLast(cap);
    clearTimeout(timers.current[cap.key]);
    timers.current[cap.key] = setTimeout(() => setDown(d => ({ ...d, [cap.key]: false })), 170);
  };

  const caps = [...KEYCAPS, { key: 'send', cap: `${mod} ↵`, action: 'Send', wide: true }];

  return (
    <article
      className={`ta-feat ta-feat--keys${active ? ' is-active' : ''}`}
      aria-labelledby="ta-f-keys"
      onPointerEnter={() => {
        hover.current = true;
        sync();
      }}
      onPointerLeave={() => {
        hover.current = false;
        sync();
      }}
      onFocus={() => {
        focus.current = true;
        sync();
      }}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          focus.current = false;
          sync();
        }
      }}
    >
      <div className="ta-keys__text">
        <p className="ta-feat__kicker">
          <span className="ta-kbd-glyph" aria-hidden="true">
            J
          </span>{' '}
          Keyboard
        </p>
        <h3 id="ta-f-keys" className="ta-h3">
          Every action is one key away.
        </h3>
        <p className="ta-feat__body">
          Move between people, reply, file and nudge without reaching for the trackpad. Give the keycaps a try.
        </p>
        <p className="ta-keys__state" aria-live="polite">
          <span className="ta-keys__dot" aria-hidden="true" />
          {active ? 'Ready: press J, K, E, R, H or / on your keyboard' : 'Tap a key, or point here and type'}
        </p>
      </div>

      <div className="ta-keys">
        <ul className="ta-keys__grid" role="list">
          {caps.map(c => (
            <li key={c.key} className={c.wide ? 'is-wide' : ''}>
              <button
                type="button"
                className={`ta-key${down[c.key] ? ' is-down' : ''}`}
                onClick={() => tap(c)}
                aria-label={`${c.cap}: ${c.action}`}
              >
                <span className="ta-key__cap">{c.cap}</span>
                <span className="ta-key__label">{c.action}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="ta-keys__readout" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={last ? last.key + last.action : 'none'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease }}
            >
              {last ? (
                <>
                  <kbd>{last.cap}</kbd> {last.action}
                </>
              ) : (
                <span className="ta-keys__idle">Your last key shows up here</span>
              )}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </article>
  );
}

export default function Features() {
  return (
    <section id="features" className="ta-sec ta-features" aria-labelledby="ta-features-title" tabIndex={-1}>
      <div className="ta-wrap">
        <div className="ta-sec__head" data-reveal>
          <div className="ta-sec__title">
            <p className="ta-eyebrow">
              <span>02</span> Tools
            </p>
            <h2 id="ta-features-title" className="ta-h2">
              Four small tools, one calm inbox.
            </h2>
          </div>
          <div className="ta-sec__aside">
            <p className="ta-lead">
              None of them shout. Each one takes away a small decision you would otherwise make dozens of times a day.
            </p>
          </div>
        </div>

        <div className="ta-feats">
          <div data-reveal className="ta-feats__screener">
            <Screener />
          </div>
          <div data-reveal className="ta-feats__split">
            <SplitInbox />
          </div>
          <div data-reveal className="ta-feats__follow">
            <FollowUp />
          </div>
          <div data-reveal className="ta-feats__keys">
            <KeyboardFirst />
          </div>
        </div>
      </div>
    </section>
  );
}
