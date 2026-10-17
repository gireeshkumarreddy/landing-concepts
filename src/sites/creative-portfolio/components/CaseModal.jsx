import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useEscape, useFocusTrap, useScrollLock } from '../../../shared/a11y.js';
import { unsplash, unsplashSrcSet } from '../../../shared/img.js';
import { PROJECTS, TYPE_TONE } from '../data.js';
import { IconChevron, IconClose } from '../icons.jsx';
import GradeSlider from './GradeSlider.jsx';

const EASE = [0.2, 0.7, 0.2, 1];

export default function CaseModal({ id, onClose, onStep }) {
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const idx = PROJECTS.findIndex(p => p.id === id);
  const p = PROJECTS[idx];
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  useEscape(true, onClose);
  useFocusTrap(panelRef, true);
  useScrollLock(true);

  const first = useRef(true);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    if (first.current) {
      first.current = false;
      return;
    }
    // The footer buttons are replaced when the project changes; keep focus inside the dialog.
    const t = setTimeout(() => {
      const panel = panelRef.current;
      if (panel && !panel.contains(document.activeElement)) {
        panel.querySelector('#pf-case-title')?.focus({ preventScroll: true });
      }
    }, 420);
    return () => clearTimeout(t);
  }, [id]);

  if (!p) return null;

  return (
    <motion.div
      className="pf-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="pf-modal-scrim" onClick={onClose} />
      <motion.div
        ref={panelRef}
        className="pf-case"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pf-case-title"
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 18, opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="pf-case-bar">
          <span className="pf-case-count">
            Project <b>{String(idx + 1).padStart(2, '0')}</b> / {String(PROJECTS.length).padStart(2, '0')}
          </span>
          <div className="pf-case-ctrls">
            <button type="button" className="pf-icon-btn" onClick={() => onStep(-1)} aria-label={`Previous project: ${prev.title}`}>
              <IconChevron dir="left" size={16} />
            </button>
            <button type="button" className="pf-icon-btn" onClick={() => onStep(1)} aria-label={`Next project: ${next.title}`}>
              <IconChevron size={16} />
            </button>
            <span className="pf-case-sep" aria-hidden="true" />
            <button type="button" className="pf-icon-btn" onClick={onClose} aria-label="Close project" data-autofocus>
              <IconClose size={16} />
            </button>
          </div>
        </div>

        <div className="pf-case-scroll" ref={scrollRef} data-lenis-prevent>
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={p.id}
              className="pf-case-body"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <figure
                className="pf-case-hero"
                style={{ backgroundImage: `url(${unsplash(p.img, { w: 420, h: 236 })})` }}
              >
                <img
                  src={unsplash(p.img, { w: 1400, h: 600 })}
                  srcSet={unsplashSrcSet(p.img, [700, 1000, 1400, 2000], { ratio: 0.4286 })}
                  sizes="(min-width: 1100px) 1040px, 100vw"
                  width="1400"
                  height="600"
                  alt={p.alt}
                />
                <figcaption className="pf-case-burn" aria-hidden="true">
                  <span>{p.reel}</span>
                  <span>{p.runtime}</span>
                </figcaption>
              </figure>

              <div className="pf-case-grid">
                <div className="pf-case-main">
                  <p className="pf-case-kicker">
                    <i className={`pf-dot pf-tone-${TYPE_TONE[p.type]}`} aria-hidden="true" />
                    {p.type} · {p.year}
                  </p>
                  <h2 id="pf-case-title" className="pf-case-title" tabIndex={-1}>
                    {p.title}
                  </h2>
                  <p className="pf-case-sum">{p.summary}</p>
                </div>
                <dl className="pf-case-facts">
                  <div>
                    <dt>Role</dt>
                    <dd>{p.role}</dd>
                  </div>
                  <div>
                    <dt>Client</dt>
                    <dd>
                      {p.client} <span className="pf-case-fict">(fictional)</span>
                    </dd>
                  </div>
                  <div>
                    <dt>Runtime</dt>
                    <dd className="pf-mono">{p.runtime}</dd>
                  </div>
                  <div>
                    <dt>Tools</dt>
                    <dd>{p.tools.join(', ')}</dd>
                  </div>
                </dl>
              </div>

              <ol className="pf-case-break" role="list">
                {p.breakdown.map(([k, v], i) => (
                  <li key={k}>
                    <span className="pf-case-break-n">0{i + 1}</span>
                    <h3>{k}</h3>
                    <p>{v}</p>
                  </li>
                ))}
              </ol>

              <GradeSlider img={p.img} title={p.title} />

              <nav className="pf-case-foot" aria-label="More projects">
                <button type="button" className="pf-case-jump" onClick={() => onStep(-1)}>
                  <span className="pf-case-jump-k">
                    <IconChevron dir="left" size={12} sw={2} /> Previous
                  </span>
                  <span className="pf-case-jump-t">{prev.title}</span>
                </button>
                <button type="button" className="pf-case-jump pf-case-jump--next" onClick={() => onStep(1)}>
                  <span className="pf-case-jump-k">
                    Next <IconChevron size={12} sw={2} />
                  </span>
                  <span className="pf-case-jump-t">{next.title}</span>
                </button>
              </nav>
            </motion.article>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
