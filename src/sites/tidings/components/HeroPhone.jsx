import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PhoneFrame, Avatar, Ticks } from './Phone.jsx';
import { CHATS } from '../data.js';
import { richText } from '../hooks.jsx';
import { unsplash } from '../../../shared/img.js';
import { prefersReducedMotion } from '../../../shared/gsap.js';
import { IconCamera, IconChevronLeft, IconClose, IconExternal, IconMore, IconSearch, IconSend } from '../icons.jsx';

const ease = [0.2, 0.7, 0.2, 1];

const clock = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

/* ---------- Chat list ---------- */
function ChatList({ onOpen, read, query, setQuery }) {
  const q = query.trim().toLowerCase();
  const list = CHATS.filter(c => !q || `${c.person.name} ${c.last}`.toLowerCase().includes(q));
  return (
    <div className="ar-chats">
      <div className="ar-chats-head">
        <p className="ar-chats-title">Chats</p>
        <span className="ar-chats-tools" aria-hidden="true">
          <IconCamera size={21} sw={1.7} />
          <IconMore size={21} />
        </span>
      </div>
      <div className="ar-chats-search">
        <IconSearch size={16} sw={2} />
        <label htmlFor="ar-chat-search" className="sr-only">
          Search chats
        </label>
        <input
          id="ar-chat-search"
          type="search"
          placeholder="Search chats"
          autoComplete="off"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <ul className="ar-chats-list" role="list" aria-label="Chats">
        {list.map(c => {
          const unread = read[c.id] ? 0 : c.unread;
          return (
            <li key={c.id}>
              <button type="button" className="ar-chat" data-chat={c.id} onClick={() => onOpen(c.id)}>
                <Avatar person={c.person} size={46} eager />
                <span className="ar-chat-main">
                  <span className="ar-chat-row">
                    <span className="ar-chat-name">{c.person.name}</span>
                    <span className={`ar-chat-time ${unread ? 'is-unread' : ''}`}>{c.time}</span>
                  </span>
                  <span className="ar-chat-row">
                    <span className="ar-chat-last">{c.last}</span>
                    {unread > 0 && (
                      <span className="ar-chat-badge">
                        {unread}
                        <span className="sr-only"> unread</span>
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {list.length === 0 && (
        <div className="ar-chats-empty" role="status">
          <p>No chats match “{query.trim()}”.</p>
          <button type="button" className="ar-link-btn" onClick={() => setQuery('')}>
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- One message ---------- */
function Message({ m, onAction }) {
  const me = m.from === 'me';
  return (
    <motion.li
      className={`ar-msg ${me ? 'is-me' : 'is-them'} ${m.kind ? 'is-rich' : ''}`}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, ease }}
    >
      <div className="ar-msg-bubble">
        {m.kind === 'promo' && (
          <div className="ar-msg-banner">
            <span className="ar-msg-eyebrow">{m.eyebrow}</span>
            <span className="ar-msg-headline">{m.title}</span>
          </div>
        )}
        {m.kind === 'media' && (
          <div className="ar-msg-media">
            <img src={unsplash(m.image, { w: 440, h: 260, q: 70 })} alt={m.alt || ""} width="220" height="130" loading="lazy" decoding="async" />
            <span className="ar-msg-headline is-dark">{m.title}</span>
          </div>
        )}
        <p>
          <span className="sr-only">{me ? 'You: ' : ''}</span>
          {richText(m.text, m.key)}
        </p>
        <span className="ar-msg-meta">
          {m.at}
          {me && <Ticks />}
        </span>
        {m.button && (
          <button type="button" className="ar-msg-action" onClick={e => onAction(m.sheet, e.currentTarget)}>
            <IconExternal size={14} sw={2} />
            {m.button}
          </button>
        )}
      </div>
    </motion.li>
  );
}

/* ---------- Conversation ---------- */
function Conversation({ chat, onBack }) {
  const [msgs, setMsgs] = useState([]);
  const [typing, setTyping] = useState(false);
  const [chips, setChips] = useState([]);
  const [chipsOn, setChipsOn] = useState(false);
  const [sheet, setSheet] = useState(null);
  const [draft, setDraft] = useState('');
  const timers = useRef([]);
  const logRef = useRef(null);
  const keyRef = useRef(0);
  const sheetOpener = useRef(null);
  const sheetClose = useRef(null);

  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, prefersReducedMotion() ? 0 : ms));
  };
  const push = m => setMsgs(list => [...list, { ...m, key: `k${++keyRef.current}`, at: clock() }]);

  useEffect(() => {
    timers.current = [];
    setMsgs([]);
    setTyping(false);
    setChipsOn(false);
    setSheet(null);
    let t = 380;
    chat.script.forEach(m => {
      if (m.from === 'them') {
        later(() => setTyping(true), t);
        t += 1250;
        later(() => {
          setTyping(false);
          push(m);
        }, t);
        t += 450;
      } else {
        later(() => push(m), t);
        t += m.kind ? 950 : 750;
      }
    });
    later(() => {
      setChips(chat.chips.map((_, i) => i));
      setChipsOn(true);
    }, t + 150);
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.id]);

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [msgs, typing, chipsOn]);

  useEffect(() => {
    if (sheet) requestAnimationFrame(() => sheetClose.current?.focus({ preventScroll: true }));
  }, [sheet]);

  const reply = i => {
    const c = chat.chips[i];
    setChipsOn(false);
    setChips(cs => cs.filter(x => x !== i));
    push({ from: 'me', text: c.say });
    later(() => setTyping(true), 700);
    later(() => {
      setTyping(false);
      push({ from: 'them', text: c.reply });
      setChipsOn(true);
    }, 2000);
  };

  const send = e => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    push({ from: 'me', text });
    setDraft('');
  };

  const closeSheet = () => {
    setSheet(null);
    requestAnimationFrame(() => sheetOpener.current?.focus({ preventScroll: true }));
  };

  return (
    <div className="ar-conv" onKeyDown={e => sheet && e.key === 'Escape' && (e.stopPropagation(), closeSheet())}>
      <div className="ar-conv-head">
        <button type="button" className="ar-conv-back" onClick={onBack} aria-label="Back to chats">
          <IconChevronLeft size={22} sw={2.2} />
        </button>
        <Avatar person={chat.person} size={36} eager />
        <span className="ar-conv-who">
          <span className="ar-conv-name">{chat.person.name}</span>
          <span className={`ar-conv-status ${typing ? 'is-typing' : ''}`}>{typing ? 'typing…' : 'online'}</span>
        </span>
      </div>

      <div className="ar-conv-scroll" ref={logRef}>
        <p className="ar-conv-day">
          <span>Today</span>
        </p>
        <ol className="ar-conv-log" role="log" aria-live="polite" aria-label={`Conversation with ${chat.person.name}`}>
          {msgs.map(m => (
            <Message
              key={m.key}
              m={m}
              onAction={(s, el) => {
                sheetOpener.current = el;
                setSheet(s);
              }}
            />
          ))}
        </ol>
        <AnimatePresence>
          {typing && (
            <motion.div
              className="ar-typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {chipsOn && chips.length > 0 && (
          <motion.div
            className="ar-chips"
            role="group"
            aria-label="Suggested replies"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25, ease }}
          >
            {chips.map(i => (
              <button key={i} type="button" className="ar-chip" onClick={() => reply(i)}>
                {chat.chipLabels[i]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <form className="ar-composer" onSubmit={send}>
        <label htmlFor={`ar-compose-${chat.id}`} className="sr-only">
          Message {chat.person.first}
        </label>
        <input id={`ar-compose-${chat.id}`} value={draft} onChange={e => setDraft(e.target.value)} placeholder="Message" autoComplete="off" />
        <button type="submit" className="ar-composer-send" aria-label="Send message" disabled={!draft.trim()}>
          <IconSend size={17} sw={2} />
        </button>
      </form>

      <AnimatePresence>
        {sheet && (
          <motion.div className="ar-psheet-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={e => e.target === e.currentTarget && closeSheet()}>
            <motion.div
              className="ar-psheet"
              role="dialog"
              aria-label={`Link preview: ${sheet.title}`}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.32, ease }}
            >
              <span className="ar-psheet-grip" aria-hidden="true" />
              <p className="ar-psheet-kicker">Tracked link</p>
              <p className="ar-psheet-title">{sheet.title}</p>
              <p className="ar-psheet-url">{sheet.url}</p>
              <p className="ar-psheet-note">{sheet.note} In this demo, nothing opens.</p>
              <button ref={sheetClose} type="button" className="ar-psheet-close" onClick={closeSheet}>
                <IconClose size={14} sw={2.2} /> Close preview
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Phone ---------- */
export default function HeroPhone({ active, onOpen, onBack }) {
  const [query, setQuery] = useState('');
  const [read, setRead] = useState({});
  const appRef = useRef(null);
  const prev = useRef(null);
  const chat = CHATS.find(c => c.id === active);

  useEffect(() => {
    if (active) setRead(r => ({ ...r, [active]: true }));
    const was = prev.current;
    prev.current = active;
    if (was === active) return;
    const id = requestAnimationFrame(() => {
      const el = active
        ? appRef.current?.querySelector('.ar-conv-back')
        : was && appRef.current?.querySelector(`[data-chat="${was}"]`);
      el?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [active]);

  return (
    <PhoneFrame className="ar-phone--hero">
      <div className="ar-app" ref={appRef} role="region" aria-label="Interactive chat demo">
        <AnimatePresence initial={false}>
          {chat ? (
            <motion.div
              key={`c-${chat.id}`}
              className="ar-view is-conv"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.42, ease }}
            >
              <Conversation chat={chat} onBack={onBack} />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              className="ar-view is-list"
              initial={{ x: '-28%', opacity: 0.4 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-28%', opacity: 0.4 }}
              transition={{ duration: 0.42, ease }}
            >
              <ChatList onOpen={onOpen} read={read} query={query} setQuery={setQuery} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PhoneFrame>
  );
}
