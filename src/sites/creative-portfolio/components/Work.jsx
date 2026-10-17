import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { unsplash, unsplashSrcSet } from '../../../shared/img.js';
import { FPS, PROJECTS, TYPES, TYPE_TONE } from '../data.js';
import { timecode } from '../utils.js';
import { IconArrowUpRight } from '../icons.jsx';
import ScaleStrip from './ScaleStrip.jsx';

const EASE = [0.2, 0.7, 0.2, 1];
const FILTERS = ['All', ...TYPES];

// Editorial rhythm: a wide/narrow pair, a row of three, then one cinemascope frame.
const LAYOUTS = {
  1: ['cine'],
  2: ['w7', 'w5'],
  3: ['w7', 'w5', 'cine'],
  4: ['w7', 'w5', 'w6', 'w6'],
  5: ['w7', 'w5', 'w4', 'w4', 'w4'],
  6: ['w7', 'w5', 'w4', 'w4', 'w4', 'cine'],
};
const SIZES = {
  w7: '(min-width: 768px) 58vw, 100vw',
  w5: '(min-width: 768px) 42vw, 100vw',
  w4: '(min-width: 768px) 33vw, 100vw',
  w6: '(min-width: 768px) 50vw, 100vw',
  cine: '100vw',
};

function WorkCard({ ref, p, size, index, onOpen }) {
  const [hot, setHot] = useState(false);
  const tcRef = useRef(null);
  const tone = TYPE_TONE[p.type];

  // While hovered, a burnt-in timecode runs like a monitor in record.
  useEffect(() => {
    if (!hot) return;
    let raf;
    const t0 = performance.now();
    const loop = now => {
      if (tcRef.current) tcRef.current.textContent = timecode(((now - t0) / 1000) * FPS);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      if (tcRef.current) tcRef.current.textContent = timecode(0);
    };
  }, [hot]);

  return (
    <motion.li
      ref={ref}
      layout
      className={`pf-card pf-card--${size}`}
      data-hot={hot || undefined}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.55, ease: EASE }}
      onPointerEnter={e => e.pointerType === 'mouse' && setHot(true)}
      onPointerLeave={() => setHot(false)}
      data-cursor="Play"
    >
      <div className="pf-card-in">
        <div
          className="pf-card-media"
          data-reveal="fade"
          data-reveal-delay={String((index % 3) * 0.08)}
          data-expand={size === 'cine' ? '5% 7%' : undefined}
          data-expand-radius="18px"
        >
          <span className="pf-card-zoom">
            <img
              data-parallax="0.1"
              src={unsplash(p.img, { w: 1200, h: size === 'cine' ? 502 : undefined })}
              srcSet={unsplashSrcSet(p.img, [480, 800, 1200, 1800], { ratio: size === 'cine' ? 0.42 : 0.75 })}
              sizes={SIZES[size]}
              alt={p.alt}
              loading="lazy"
              decoding="async"
              width="1200"
              height="900"
            />
          </span>
          <span className="pf-card-rec" aria-hidden="true">
            <i />
            REC <span ref={tcRef}>00:00:00:00</span>
          </span>
          <span className="pf-card-view" aria-hidden="true">
            Open film <IconArrowUpRight size={12} />
          </span>
          <span className="pf-card-scrub" aria-hidden="true">
            <i />
          </span>
        </div>
        <div className="pf-card-info">
          <h3 className="pf-card-title">
            <button type="button" className="pf-card-btn" onClick={() => onOpen(p.id)}>
              {p.title}
              <span className="sr-only">: open project details</span>
            </button>
          </h3>
          <span className="pf-card-rt">{p.runtime}</span>
          <p className="pf-card-meta">
            <i className={`pf-dot pf-tone-${tone}`} aria-hidden="true" />
            {p.type}
            <span aria-hidden="true"> · </span>
            <span className="sr-only">, client </span>
            {p.client}
            <span aria-hidden="true"> · </span>
            <span className="sr-only">, </span>
            {p.year}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

export default function Work({ onOpen }) {
  const [filter, setFilter] = useState('All');
  const list = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.type === filter);
  const layout = LAYOUTS[list.length] || list.map(() => 'w6');

  return (
    <section id="reel" className="pf-sec pf-work" aria-labelledby="pf-work-title" data-bg="#101010">
      <ScaleStrip onOpen={onOpen} />
      <div className="pf-wrap">
        <div className="pf-sec-head pf-work-head">
          <div>
            <p className="pf-eyebrow" data-reveal="fade">
              <span className="pf-eyebrow-n">01</span> Reel
            </p>
            <h2 id="pf-work-title" className="pf-h2" data-reveal="lines">
              Six films I cut, graded <span className="pf-h2-soft">and handed over.</span>
            </h2>
          </div>
          <div className="pf-chips" role="group" aria-label="Filter films by type">
            {FILTERS.map(t => {
              const n = t === 'All' ? PROJECTS.length : PROJECTS.filter(p => p.type === t).length;
              const on = filter === t;
              return (
                <button key={t} type="button" className="pf-chip" aria-pressed={on} onClick={() => setFilter(t)}>
                  {on && <motion.span layoutId="pf-chip-bg" className="pf-chip-bg" transition={{ duration: 0.45, ease: EASE }} />}
                  <span className="pf-chip-t">{t}</span>
                  <span className="pf-chip-n">{n}</span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.ul role="list" className="pf-grid" layout>
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
              <WorkCard key={p.id} p={p} size={layout[i]} index={i} onOpen={onOpen} />
            ))}
          </AnimatePresence>
        </motion.ul>
        <p className="sr-only" aria-live="polite">
          Showing {list.length} of {PROJECTS.length} films{filter === 'All' ? '' : ` filtered by ${filter}`}.
        </p>
      </div>
    </section>
  );
}
