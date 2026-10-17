import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ARTICLES } from '../data.js';
import { highlight, photoSrc, terms, useDialog, useReduced } from '../lib.jsx';
import { ArrowRight, SearchIcon } from '../icons.jsx';

const SUGGEST = ['opening', 'revision', 'query', 'notebook'];

function search(q) {
  const ts = terms(q);
  if (!ts.length) return { ts, list: ARTICLES.map(a => ({ a, topic: null })) };
  const list = [];
  ARTICLES.forEach(a => {
    const hay = [a.title, a.category, a.dek, ...a.topics].join(' ').toLowerCase();
    if (!ts.every(t => hay.includes(t))) return;
    const inTitle = ts.some(t => a.title.toLowerCase().includes(t));
    const topic = a.topics.find(tp => ts.some(t => tp.includes(t))) || null;
    list.push({ a, topic, score: (inTitle ? 2 : 0) + (topic ? 1 : 0) });
  });
  list.sort((x, y) => y.score - x.score);
  return { ts, list };
}

export default function SearchPalette({ onClose, onPick }) {
  const ref = useRef(null);
  const listRef = useRef(null);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const reduce = useReduced();
  useDialog(ref, onClose);

  const { ts, list } = useMemo(() => search(q), [q]);
  const n = list.length;

  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const onKey = e => {
    if (!n) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(i => (i + 1) % n);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(i => (i - 1 + n) % n);
    } else if (e.key === 'Home' && e.ctrlKey) {
      setActive(0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onPick(list[active].a.slug);
    }
  };

  const optId = i => `ch-search-opt-${i}`;

  return (
    <>
      <motion.div
        className="ch-scrim"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        ref={ref}
        className="ch-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Search essays"
        initial={{ opacity: 0, y: reduce ? 0 : -10, scale: reduce ? 1 : 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : -6, scale: reduce ? 1 : 0.99 }}
        transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="ch-palette__field">
          <SearchIcon size={19} />
          <label htmlFor="ch-search-input" className="sr-only">
            Search essays by title or theme
          </label>
          <input
            id="ch-search-input"
            data-autofocus
            className="ch-palette__input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="ch-search-list"
            aria-autocomplete="list"
            aria-activedescendant={n ? optId(active) : undefined}
            placeholder="Search essays by title or theme…"
            autoComplete="off"
            spellCheck="false"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onKey}
          />
          <button type="button" className="ch-kbdbtn" onClick={onClose} aria-label="Close search">
            esc
          </button>
        </div>

        <p className="ch-palette__group" id="ch-search-group">
          {ts.length ? `${n} ${n === 1 ? 'essay' : 'essays'} found` : 'Every essay'}
        </p>
        <p className="sr-only" aria-live="polite">
          {ts.length ? `${n} ${n === 1 ? 'result' : 'results'}` : ''}
        </p>

        {n ? (
          <ul className="ch-palette__list" id="ch-search-list" role="listbox" aria-labelledby="ch-search-group" ref={listRef} data-lenis-prevent>
            {list.map(({ a, topic }, i) => (
              <li
                key={a.slug}
                id={optId(i)}
                data-idx={i}
                role="option"
                aria-selected={i === active}
                className={`ch-opt ${i === active ? 'is-active' : ''}`}
                onMouseMove={() => i !== active && setActive(i)}
                onClick={() => onPick(a.slug)}
              >
                <img className="ch-opt__thumb" src={photoSrc(a.photo, 120, 0.75)} width="60" height="45" alt="" loading="lazy" decoding="async" />
                <span className="ch-opt__text">
                  <span className="ch-opt__title">{highlight(a.title, ts)}</span>
                  <span className="ch-opt__meta">
                    {highlight(a.category, ts)} · {a.minutes} min
                    {topic && ts.length > 0 && (
                      <span className="ch-opt__topic">Theme: {highlight(topic, ts)}</span>
                    )}
                  </span>
                </span>
                <ArrowRight size={16} className="ch-opt__go" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="ch-palette__empty">
            <p>
              Nothing matches “<strong>{q.trim()}</strong>” yet.
            </p>
            <p className="ch-palette__try">
              Try one of these
              {SUGGEST.map(s => (
                <button key={s} type="button" className="ch-chip ch-chip--sm" onClick={() => setQ(s)}>
                  {s}
                </button>
              ))}
            </p>
          </div>
        )}

        <div className="ch-palette__foot" aria-hidden="true">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> choose
          </span>
          <span>
            <kbd>↵</kbd> read
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </div>
      </motion.div>
    </>
  );
}

