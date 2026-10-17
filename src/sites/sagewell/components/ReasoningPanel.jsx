import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { prefersReducedMotion } from '../../../shared/gsap.js';
import { CHIP_EXAMPLES } from '../data.js';
import { scrollToTarget } from '../../../shared/motion/index.js';
import { tx, useCopy } from '../lib.js';
import { IconCheck, IconChevronDown, IconCopy, IconRefresh, IconStop } from '../icons.jsx';

const BASE_STEP_MS = [900, 1400, 1650, 1050];
const DEPTH = {
  brief: { mult: 0.55, cps: 560, label: 'Brief' },
  standard: { mult: 1, cps: 430, label: 'Standard' },
  thorough: { mult: 1.65, cps: 360, label: 'Thorough' },
};

const itemText = item => `${item[0]} ${item[1]}`;
const blockLen = b => (b.type === 'p' ? b.text.length : b.items.reduce((n, it) => n + itemText(it).length, 0));

/** Truncates answer blocks to the first `n` characters (for streaming and partial copy). */
function sliceBlocks(blocks, n) {
  const out = [];
  let left = n;
  for (const b of blocks) {
    if (left <= 0) break;
    if (b.type === 'p') {
      out.push({ ...b, text: b.text.slice(0, left) });
      left -= b.text.length;
    } else {
      const items = [];
      for (const it of b.items) {
        if (left <= 0) break;
        const full = itemText(it);
        const shown = full.slice(0, left);
        items.push([shown.slice(0, it[0].length), shown.slice(it[0].length + 1)]);
        left -= full.length;
      }
      out.push({ ...b, items });
    }
  }
  return out;
}

function toPlain(blocks) {
  return blocks
    .map(b =>
      b.type === 'p'
        ? b.text
        : b.items.map((it, i) => `${b.type === 'ol' ? `${i + 1}.` : '-'} ${it[0]}${it[1] ? ' ' + it[1] : ''}`).join('\n')
    )
    .join('\n\n')
    .trim();
}

function buildPlan(run) {
  const { titles, answer } = run.data;
  const d = DEPTH[run.depth] || DEPTH.standard;
  const traceCount = titles.length - 1;
  const base = run.data.fallback ? [650, 850] : BASE_STEP_MS;
  const durs = Array.from({ length: traceCount }, (_, i) => Math.round((base[i] ?? 900) * d.mult));
  const starts = [];
  let acc = 0;
  durs.forEach(ms => {
    starts.push(acc);
    acc += ms;
  });
  const chars = answer.reduce((n, b) => n + blockLen(b), 0);
  const answerMs = Math.round((chars / d.cps) * 1000);
  return { durs, starts, answerStart: acc, answerMs, total: acc + answerMs, chars, cps: d.cps };
}

const secs = ms => `${(ms / 1000).toFixed(1)}s`;

export default function ReasoningPanel({ run, onAskAnother, onPickExample }) {
  const plan = useMemo(() => buildPlan(run), [run]);
  const [t, setT] = useState(0);
  const [status, setStatus] = useState('running');
  const [stoppedAt, setStoppedAt] = useState(null);
  const [showSteps, setShowSteps] = useState(true);
  const [copyState, copy] = useCopy();
  const raf = useRef(0);
  const rootRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setT(plan.total);
      setStatus('done');
      return;
    }
    const start = performance.now();
    let last = -100;
    const tick = now => {
      const el = now - start;
      if (el >= plan.total) {
        setT(plan.total);
        setStatus('done');
        return;
      }
      if (el - last >= 33) {
        last = el;
        setT(el);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [plan]);

  // Bring the panel into view once, without yanking the composer away.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.62) {
      scrollToTarget(window.scrollY + r.top - window.innerHeight * 0.32, { duration: 1.1 });
    }
  }, []);

  const stop = () => {
    cancelAnimationFrame(raf.current);
    setStoppedAt(t);
    setStatus('stopped');
  };

  // The Stop button disappears when the run ends; keep keyboard focus inside the panel.
  const actionsRef = useRef(null);
  useEffect(() => {
    if (status === 'running') return;
    const a = document.activeElement;
    if (!a || a === document.body) actionsRef.current?.querySelector('button:not([disabled])')?.focus({ preventScroll: true });
  }, [status]);

  const now = status === 'stopped' ? stoppedAt : t;
  const { titles, steps, answer, fallback } = run.data;
  const answerChars = Math.max(0, Math.min(plan.chars, Math.floor(((now - plan.answerStart) / 1000) * plan.cps)));
  const shown = sliceBlocks(answer, answerChars);
  const reasoningDone = now >= plan.answerStart;
  const streaming = status === 'running' && reasoningDone;
  const shownPlain = toPlain(shown);

  const stepState = i => {
    const start = i < plan.durs.length ? plan.starts[i] : plan.answerStart;
    const end = i < plan.durs.length ? start + plan.durs[i] : plan.total;
    if (now >= end && (status !== 'stopped' || i < plan.durs.length || answerChars >= plan.chars)) return { s: 'done', ms: end - start };
    if (now >= start) return { s: status === 'stopped' ? 'stopped' : 'active', ms: now - start };
    return { s: status === 'stopped' ? 'skipped' : 'pending', ms: 0 };
  };

  let statusLabel;
  if (status === 'stopped') statusLabel = `Halted at ${secs(stoppedAt)}`;
  else if (!reasoningDone) statusLabel = 'Working through it…';
  else if (status === 'running') statusLabel = `Trail took ${secs(plan.answerStart)} · drafting the reply`;
  else statusLabel = `Trail took ${secs(plan.answerStart)}`;

  const depthLabel = (DEPTH[run.depth] || DEPTH.standard).label;

  return (
    <motion.section
      ref={rootRef}
      className="cr-reason"
      aria-labelledby="cr-reason-q"
      aria-busy={status === 'running'}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={tx({ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] })}
    >
      <header className="cr-reason__head">
        <p className="cr-demo-tag">
          <span className="cr-demo-tag__dot" aria-hidden="true" />
          Design demo · scripted reply, no live model
        </p>
        <h2 id="cr-reason-q" className="cr-reason__q">
          {run.question}
        </h2>
        <p className="cr-reason__meta">
          <span>sagewell-2</span>
          <span>{depthLabel} depth</span>
          {run.file && <span>Document: {run.file.name} (not read by this demo)</span>}
        </p>
      </header>

      <div className="cr-trace">
        <div className="cr-trace__bar">
          <span className={`cr-trace__status${status === 'running' && !reasoningDone ? ' is-live' : ''}`}>{statusLabel}</span>
          <button
            type="button"
            className="cr-trace__toggle"
            aria-expanded={showSteps}
            aria-controls="cr-trace-list"
            onClick={() => setShowSteps(s => !s)}
          >
            {showSteps ? 'Fold the trail' : `Open the trail (${titles.length})`}
            <IconChevronDown size={14} />
          </button>
        </div>
        <ol id="cr-trace-list" className="cr-trace__list" hidden={!showSteps}>
          {titles.map((title, i) => {
            const st = stepState(i);
            return (
              <li key={title} className={`cr-step-row is-${st.s}`}>
                <span className="cr-step-row__mark" aria-hidden="true">
                  {st.s === 'done' && <IconCheck size={12} />}
                </span>
                <span className="cr-step-row__main">
                  <span className="cr-step-row__title">
                    {title}
                    <span className="sr-only">
                      {' '}
                      ({st.s === 'done' ? 'done' : st.s === 'active' ? 'in progress' : st.s})
                    </span>
                  </span>
                  {(st.s === 'done' || st.s === 'active' || st.s === 'stopped') && (
                    <span className="cr-step-row__line">{steps[i]}</span>
                  )}
                </span>
                <span className="cr-step-row__time" aria-hidden="true">
                  {st.s === 'pending' || st.s === 'skipped' ? '' : secs(st.ms)}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="cr-answer" aria-label="Reply">
        {shown.map((b, bi) => {
          const last = bi === shown.length - 1;
          const caret = last && streaming ? <span className="cr-answer__caret" aria-hidden="true" /> : null;
          if (b.type === 'p')
            return (
              <p key={bi}>
                {b.text}
                {caret}
              </p>
            );
          const List = b.type === 'ol' ? 'ol' : 'ul';
          return (
            <List key={bi} className={`cr-answer__list cr-answer__list--${b.type}`}>
              {b.items.map((it, ii) => (
                <li key={ii}>
                  <strong>{it[0]}</strong> {it[1]}
                  {last && ii === b.items.length - 1 ? caret : null}
                </li>
              ))}
            </List>
          );
        })}
        {!shown.length && status === 'stopped' && <p className="cr-answer__empty">Halted before the reply began.</p>}
      </div>

      {fallback && status === 'done' && (
        <div className="cr-reason__examples">
          <p>Scripted questions</p>
          <ul role="list">
            {CHIP_EXAMPLES.map(ex => (
              <li key={ex.id}>
                <button type="button" className="cr-chip" onClick={() => onPickExample(ex.question)}>
                  {ex.question}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer className="cr-reason__actions" ref={actionsRef}>
        {status === 'running' ? (
          <button type="button" className="cr-btn cr-btn--ghost cr-btn--sm" onClick={stop}>
            <IconStop size={14} />
            Halt
          </button>
        ) : (
          <>
            <button
              type="button"
              className="cr-btn cr-btn--ghost cr-btn--sm"
              onClick={() => copy(shownPlain)}
              disabled={!shownPlain}
            >
              {copyState === 'copied' ? <IconCheck size={14} /> : <IconCopy size={14} />}
              {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy reply'}
            </button>
            <button type="button" className="cr-btn cr-btn--ink cr-btn--sm" onClick={onAskAnother}>
              <IconRefresh size={14} />
              New question
            </button>
          </>
        )}
      </footer>
      <p className="sr-only" role="status">
        {status === 'done' ? 'Reply complete.' : status === 'stopped' ? 'Halted.' : ''}
      </p>
    </motion.section>
  );
}
