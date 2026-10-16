import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Avatar from './Avatar.jsx';
import { GROUPS, PEOPLE, SUGGESTED } from '../data.js';
import { isMac, shortAt } from '../lib.js';
import * as I from '../icons.jsx';

const GROUP_ICON = { teammates: I.Smile, people: I.Users, notifications: I.Bell };
const uid = () => `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const spring = { type: 'spring', bounce: 0, duration: 0.42 };
const ease = [0.2, 0.7, 0.2, 1];

export default function InboxWindow({ inbox, dispatch, live, regionRef, reduced }) {
  const { convos, order, selected, collapsed } = inbox;
  const current = selected ? convos[selected] : null;
  const person = current ? PEOPLE[current.person] : null;

  const [focusWithin, setFocusWithin] = useState(false);
  const [drafts, setDrafts] = useState({});
  const [expanded, setExpanded] = useState({});
  const [toast, setToast] = useState(null);
  const [writing, setWriting] = useState(false);
  const [note, setNote] = useState('');
  const [flash, setFlash] = useState('');
  const [mod, setMod] = useState('Ctrl');

  const textareaRef = useRef(null);
  const threadRef = useRef(null);
  const rowRefs = useRef({});
  const typer = useRef(null);
  const flashT = useRef(null);

  useEffect(() => setMod(isMac() ? '⌘' : 'Ctrl'), []);

  const stopTyping = useCallback(() => {
    cancelAnimationFrame(typer.current);
    typer.current = null;
    setWriting(false);
  }, []);
  useEffect(() => () => {
    cancelAnimationFrame(typer.current);
    clearTimeout(flashT.current);
  }, []);

  // Switching conversation: stop any typewriter, reset the status line, follow keyboard focus.
  useEffect(() => {
    stopTyping();
    setNote('');
    const active = document.activeElement;
    if (selected && active?.dataset?.row && active.dataset.row !== selected) {
      rowRefs.current[selected]?.focus({ preventScroll: true });
    }
  }, [selected, stopTyping]);

  // Keep the newest message in view when the thread grows.
  const count = current?.messages.length ?? 0;
  const prevCount = useRef({ id: selected, count });
  useLayoutEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    const prev = prevCount.current;
    if (prev.id === selected && count > prev.count) {
      el.scrollTo({ top: el.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
    } else if (prev.id !== selected) {
      el.scrollTop = 0;
    }
    prevCount.current = { id: selected, count };
  }, [selected, count, reduced]);

  // Toast auto-dismiss.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const pressKey = k => {
    setFlash(k);
    clearTimeout(flashT.current);
    flashT.current = setTimeout(() => setFlash(''), 220);
  };

  const draft = (selected && drafts[selected]) || '';
  const setDraftFor = (id, value) => setDrafts(d => ({ ...d, [id]: value }));

  const markDone = () => {
    if (!current) return;
    dispatch({ type: 'done', id: current.id });
    setToast({ key: uid(), name: person.name });
  };

  const undo = () => {
    dispatch({ type: 'undo' });
    setToast(null);
  };

  const focusReply = () => textareaRef.current?.focus();

  const suggest = () => {
    if (!current) return;
    const id = current.id;
    const text = SUGGESTED[id] || 'Thank you, I’ll read this properly today and come back to you.';
    stopTyping();
    setNote('');
    if (reduced) {
      setDraftFor(id, text);
      textareaRef.current?.focus();
      return;
    }
    // Time-based typewriter (~110 characters a second), so slow frames never stall it.
    const start = performance.now();
    setWriting(true);
    setDraftFor(id, '');
    const tick = now => {
      const i = Math.min(text.length, Math.ceil((now - start) / 9));
      setDraftFor(id, text.slice(0, i));
      if (i >= text.length) {
        stopTyping();
        textareaRef.current?.focus();
      } else {
        typer.current = requestAnimationFrame(tick);
      }
    };
    typer.current = requestAnimationFrame(tick);
  };

  const send = () => {
    if (!current) return;
    const body = draft.trim();
    if (!body) {
      setNote('Type a reply first, or use Draft a reply.');
      textareaRef.current?.focus();
      return;
    }
    stopTyping();
    dispatch({ type: 'send', id: current.id, body, msgId: uid() });
    setDraftFor(current.id, '');
    setNote('Added in this demo only. No email was sent.');
  };

  const onRegionKey = e => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest('textarea, input, select, [contenteditable="true"]')) return;
    const k = e.key.toLowerCase();
    if (k === 'j' || k === 'k') {
      e.preventDefault();
      dispatch({ type: 'move', dir: k === 'j' ? 1 : -1 });
      pressKey(k);
    } else if (k === 'e') {
      e.preventDefault();
      markDone();
      pressKey('e');
    } else if (k === 'r') {
      e.preventDefault();
      focusReply();
      pressKey('r');
    }
  };

  const onComposerKey = e => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      pressKey('send');
      send();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      regionRef.current?.focus();
    }
  };

  const groups = GROUPS.map(g => ({
    ...g,
    items: order.filter(id => convos[id].group === g.id && !convos[id].done),
  }));
  const openList = groups.flatMap(g => g.items);

  const msgs = current?.messages ?? [];
  const showAll = current && expanded[current.id];
  const hidden = showAll ? 0 : Math.max(0, msgs.length - 2);
  const visible = msgs.slice(hidden);
  const participants = current ? [...new Set(['you', current.person, ...current.cc])] : [];
  const lastAt = msgs.length ? msgs[msgs.length - 1].at : '';
  const groupShort = current ? GROUPS.find(g => g.id === current.group).short : '';

  return (
    <div
      className={`ta-win${focusWithin ? ' is-focus' : ''}`}
      ref={regionRef}
      role="region"
      aria-label="Interactive inbox demo"
      aria-describedby="ta-win-hints"
      tabIndex={0}
      onKeyDown={onRegionKey}
      onFocus={() => setFocusWithin(true)}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocusWithin(false);
      }}
    >
      {/* ---- title bar */}
      <div className="ta-win__bar">
        <span className="ta-win__lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="ta-win__baricon" aria-hidden="true">
          <I.Sidebar size={15} />
        </span>
        {live.show &&
          (live.finished ? (
            <span className="ta-live is-done">Sample feed finished</span>
          ) : (
            <button
              type="button"
              className={`ta-live${live.paused ? ' is-paused' : ''}`}
              onClick={live.onToggle}
              aria-pressed={!live.paused}
              aria-label={live.paused ? 'Resume incoming demo messages' : 'Pause incoming demo messages'}
            >
              <span className="ta-live__dot" aria-hidden="true" />
              <span>{live.paused ? 'Sample feed paused' : 'Sample feed on'}</span>
              {live.paused ? <I.Play size={12} /> : <I.Pause size={12} />}
            </button>
          ))}
      </div>

      <div className="ta-win__body">
        {/* ---- left rail (decorative chrome) */}
        <div className="ta-rail" aria-hidden="true">
          <span className="is-on">
            <I.Inbox size={15} />
          </span>
          <span>
            <I.CheckDouble size={15} />
          </span>
        </div>

        {/* ---- sidebar (desktop / tablet) */}
        <nav className="ta-side" aria-label="Conversations">
          {groups.map(g => {
            const GIcon = GROUP_ICON[g.id];
            const isOpen = !collapsed[g.id];
            return (
              <motion.div layout="position" transition={spring} className="ta-side__group" key={g.id}>
                <button
                  type="button"
                  className="ta-side__head"
                  aria-expanded={isOpen}
                  aria-controls={`ta-grp-${g.id}`}
                  onClick={() => dispatch({ type: 'toggle', group: g.id })}
                >
                  <GIcon size={14} />
                  <span>{g.label}</span>
                  <I.Chevron size={13} className="ta-side__chev" />
                </button>
                <ul id={`ta-grp-${g.id}`} className="ta-side__list" role="list" hidden={!isOpen}>
                  <AnimatePresence initial={false} mode="popLayout">
                    {g.items.map(id => {
                      const c = convos[id];
                      const p = PEOPLE[c.person];
                      const on = id === selected;
                      return (
                        <motion.li
                          key={id}
                          layout="position"
                          transition={spring}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -28, transition: { duration: 0.24, ease } }}
                        >
                          <button
                            type="button"
                            ref={el => (rowRefs.current[id] = el)}
                            data-row={id}
                            className={`ta-row${on ? ' is-on' : ''}${c.unread ? ' is-unread' : ''}`}
                            aria-current={on ? 'true' : undefined}
                            onClick={() => dispatch({ type: 'select', id })}
                          >
                            {on && <motion.span layoutId="ta-row-hl" className="ta-row__hl" transition={spring} />}
                            <Avatar id={c.person} size={18} shape="square" letter={g.id !== 'teammates'} eager />
                            <span className="ta-row__name">{p.name}</span>
                            {c.unread > 0 && (
                              <span className="ta-row__count">
                                {c.unread}
                                <span className="sr-only"> unread</span>
                              </span>
                            )}
                          </button>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              </motion.div>
            );
          })}
        </nav>

        {/* ---- people strip (mobile) */}
        <div className="ta-strip" role="group" aria-label="Conversations">
          {openList.map(id => {
            const c = convos[id];
            const p = PEOPLE[c.person];
            const on = id === selected;
            return (
              <button
                type="button"
                key={id}
                className={`ta-strip__item${on ? ' is-on' : ''}`}
                aria-current={on ? 'true' : undefined}
                onClick={() => dispatch({ type: 'select', id })}
              >
                <span className="ta-strip__av">
                  <Avatar id={c.person} size={40} />
                  {c.unread > 0 && (
                    <span className="ta-strip__count">
                      {c.unread}
                      <span className="sr-only"> unread</span>
                    </span>
                  )}
                </span>
                <span className="ta-strip__name">{p.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* ---- conversation */}
        <div className="ta-main" aria-label={current ? `Conversation with ${person.name}` : 'Conversation'} role="group">
          {current ? (
            <>
              <div className="ta-main__head">
                <p className="ta-main__title">
                  <strong>{person.name}</strong>
                  <span className="ta-main__lane">{groupShort}</span>
                </p>
                <div className="ta-main__actions">
                  <button type="button" className="ta-iconbtn" onClick={markDone} aria-label="Mark done (E)" title="Mark done (E)">
                    <I.CheckDouble size={16} />
                  </button>
                  <button type="button" className="ta-iconbtn" onClick={focusReply} aria-label="Reply (R)" title="Reply (R)">
                    <I.Compose size={15} />
                  </button>
                </div>
              </div>

              <div className="ta-thread" ref={threadRef}>
                <motion.div
                  key={current.id}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, ease }}
                >
                  <p className="ta-thread__subject">{current.subject}</p>
                  <div className="ta-thread__meta">
                    <span className="ta-stack" aria-hidden="true">
                      {participants.map(pid => (
                        <Avatar key={pid} id={pid} size={20} shape="square" letter={pid === 'you'} />
                      ))}
                    </span>
                    <span>
                      {msgs.length} {msgs.length === 1 ? 'message' : 'messages'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{lastAt}</span>
                  </div>

                  {hidden > 0 && (
                    <button
                      type="button"
                      className="ta-earlier"
                      onClick={() => setExpanded(x => ({ ...x, [current.id]: true }))}
                    >
                      <span>
                        {hidden} older {hidden === 1 ? 'message' : 'messages'}, show all
                      </span>
                    </button>
                  )}

                  <ol className="ta-msgs" role="list">
                    {visible.map(m => {
                      const from = PEOPLE[m.from];
                      const you = m.from === 'you';
                      return (
                        <motion.li
                          key={m.id}
                          className={`ta-msg${you ? ' is-you' : ''}`}
                          initial={m.fresh && !reduced ? { opacity: 0, y: 12 } : false}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, ease }}
                        >
                          <Avatar id={m.from} size={26} letter={you} />
                          <div className="ta-msg__main">
                            <p className="ta-msg__head">
                              <strong>{you ? 'You' : from.name}</strong>
                              <time>{shortAt(m.at)}</time>
                              {m.demo && <span className="ta-msg__demo">Sent · demo</span>}
                            </p>
                            <p className="ta-msg__text">{m.body}</p>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ol>
                </motion.div>
              </div>

              <form
                className="ta-composer"
                onSubmit={e => {
                  e.preventDefault();
                  send();
                }}
              >
                <label htmlFor="ta-reply" className="sr-only">
                  Reply to {person.name}
                </label>
                <textarea
                  id="ta-reply"
                  ref={textareaRef}
                  rows={2}
                  value={draft}
                  placeholder={`Reply to ${person.name.split(' ')[0]}…`}
                  aria-describedby="ta-reply-note"
                  onChange={e => {
                    stopTyping();
                    setNote('');
                    setDraftFor(current.id, e.target.value);
                  }}
                  onKeyDown={onComposerKey}
                />
                <div className="ta-composer__bar">
                  <button type="button" className="ta-ghost" onClick={suggest} disabled={writing}>
                    <I.Compose size={13} />
                    {writing ? 'Drafting…' : 'Draft a reply'}
                  </button>
                  <span id="ta-reply-note" className="ta-composer__note" aria-live="polite">
                    {note}
                  </span>
                  <button type="submit" className={`ta-send${flash === 'send' ? ' is-pressed' : ''}`}>
                    <span>Send</span>
                    <kbd>{mod} ↵</kbd>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="ta-empty">
              <p className="ta-empty__title">Nobody is waiting on you.</p>
              <p className="ta-empty__text">Every sample conversation is marked done.</p>
              <button type="button" className="ta-ghost" onClick={() => dispatch({ type: 'restoreAll' })}>
                <I.Undo size={13} /> Bring them back
              </button>
            </div>
          )}

          <AnimatePresence>
            {toast && (
              <motion.div
                key={toast.key}
                className="ta-toast"
                role="status"
                initial={{ opacity: 0, y: 14, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 8, x: '-50%' }}
                transition={{ duration: 0.3, ease }}
              >
                <I.Check size={14} />
                <span>
                  Marked done <span className="ta-toast__who">· {toast.name}</span>
                </span>
                <button type="button" onClick={undo}>
                  Undo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ---- shortcut hint bar */}
      <div className="ta-hints" id="ta-win-hints">
        <span className="ta-hints__state">
          <span className="ta-hints__dot" aria-hidden="true" />
          {focusWithin ? 'Keyboard shortcuts active' : 'Click inside the window to use the keyboard'}
        </span>
        <span className="ta-hints__keys">
          <span>
            <kbd className={flash === 'j' ? 'is-pressed' : ''}>J</kbd>
            <kbd className={flash === 'k' ? 'is-pressed' : ''}>K</kbd> move
          </span>
          <span>
            <kbd className={flash === 'e' ? 'is-pressed' : ''}>E</kbd> done
          </span>
          <span>
            <kbd className={flash === 'r' ? 'is-pressed' : ''}>R</kbd> reply
          </span>
          <span>
            <kbd className={flash === 'send' ? 'is-pressed' : ''}>{mod}</kbd>
            <kbd className={flash === 'send' ? 'is-pressed' : ''}>↵</kbd> send
          </span>
        </span>
      </div>
    </div>
  );
}
