import { useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { unsplash } from '../../../shared/img.js';
import { PROJECTS, SEQ_CLIPS, SEQ_END, SEQ_NAME, SEQ_PLAYHEAD, SEQ_TRANSITIONS, STEPS } from '../data.js';
import { mmss, seeded } from '../utils.js';

const TRACKS = ['V2', 'V1', 'A1', 'A2'];
const TONE = { V2: 'v2', V1: 'v1', A1: 'a1', A2: 'a2' };
const EASE = [0.2, 0.7, 0.2, 1];
const T = { duration: 0.75, ease: EASE };

function wavePath(seed, n = 64) {
  const r = seeded(seed);
  let top = 'M0 50';
  let bottom = '';
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const env = 0.35 + 0.65 * Math.abs(Math.sin(i / 7 + seed));
    pts.push([(i / n) * 100, Math.max(4, env * (20 + r() * 26))]);
  }
  pts.forEach(([x, a]) => (top += ` L${x.toFixed(2)} ${(50 - a).toFixed(2)}`));
  [...pts].reverse().forEach(([x, a]) => (bottom += ` L${x.toFixed(2)} ${(50 + a).toFixed(2)}`));
  return `${top}${bottom} Z`;
}

const STATS = {
  log: { grade: 'Camera log', audio: 'Production sound' },
  story: { grade: 'Camera log', audio: 'Temp score' },
  lock: { grade: 'Camera log', audio: 'Edit mix' },
  finish: { grade: 'Graded · Rec.709', audio: 'Final mix · −14 LUFS' },
};

/** A small non-linear editor timeline whose clips re-arrange for each stage of the process. */
export default function SeqTimeline({ step }) {
  const key = STEPS[step].id;
  const end = SEQ_END[key];
  const clips = SEQ_CLIPS.filter(c => c.at[key]);
  const transitions = SEQ_TRANSITIONS[key] || [];
  const waves = useMemo(() => Object.fromEntries(SEQ_CLIPS.filter(c => c.seed).map(c => [c.id, wavePath(c.seed)])), []);
  const graded = key === 'finish';

  return (
    <figure className={`pf-seq is-${key}`} id="pf-seq">
      <div className="pf-seq-top" aria-hidden="true">
        <span className="pf-seq-name">
          <i className="pf-seq-rec" /> {SEQ_NAME}_v0{step + 1}
        </span>
        <span className="pf-seq-pass">
          Pass {step + 1}/4 · {STEPS[step].name}
        </span>
        <span className="pf-seq-dur">{mmss(end * 2)}</span>
      </div>

      <div className="pf-seq-body" aria-hidden="true">
        <div className="pf-seq-heads">
          <span className="pf-seq-ruler-pad" />
          {TRACKS.map(t => (
            <span key={t} className={`pf-seq-head pf-seq-head--${t.toLowerCase()}`}>
              <b>{t}</b>
              <i className={`pf-dot pf-tone-${TONE[t]}`} />
            </span>
          ))}
        </div>
        <div className="pf-seq-area">
          <div className="pf-seq-ruler">
            {Array.from({ length: 21 }, (_, i) => (
              <i key={i} className={i % 4 === 0 ? 'is-major' : undefined} style={{ left: `${i * 5}%` }} />
            ))}
            {[0, 20, 40, 60, 80].map(u => (
              <span key={u} style={{ left: `${u}%` }}>
                {mmss(u * 2)}
              </span>
            ))}
          </div>
          <div className="pf-seq-lanes">
            {TRACKS.map(t => (
              <div key={t} className={`pf-seq-lane pf-seq-lane--${t.toLowerCase()}`}>
                <AnimatePresence initial={false}>
                {clips
                  .filter(c => c.track === t)
                  .map(c => {
                    const [a, b] = c.at[key];
                    const audio = t.startsWith('A');
                    return (
                      <motion.div
                        key={c.id}
                        layout
                        transition={T}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.25 } }}
                        className={`pf-clip pf-tone-${TONE[t]}${audio ? ' is-audio' : ' is-video'}${c.id === 'title' ? ' is-title' : ''}`}
                        style={{ left: `${a}%`, width: `${b - a}%` }}
                      >
                        {!audio && c.img !== undefined && (
                          <span
                            className="pf-clip-thumbs"
                            style={{ backgroundImage: `url(${unsplash(PROJECTS[c.img].img, { w: 120, h: 68, q: 60 })})` }}
                          />
                        )}
                        {audio && (
                          <svg className="pf-clip-wave" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <line x1="0" x2="100" y1="50" y2="50" />
                            <path d={waves[c.id]} />
                          </svg>
                        )}
                        <motion.span layout="position" transition={T} className="pf-clip-label">
                          {c.label}
                        </motion.span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {t === 'V1' &&
                  transitions.map(x => (
                    <motion.span
                      key={x}
                      className="pf-seq-x"
                      style={{ left: `${x}%` }}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ ...T, delay: 0.35 }}
                    />
                  ))}
              </div>
            ))}
            <span className="pf-seq-out" style={{ transform: `translateX(${end}%)` }} />
            <span className="pf-seq-ph" style={{ transform: `translateX(${SEQ_PLAYHEAD[key]}%)` }}>
              <i />
            </span>
          </div>
        </div>
      </div>

      <figcaption className="pf-seq-foot">
        <span className="sr-only">
          Edit timeline at the {STEPS[step].name.toLowerCase()} stage: {clips.length} clips, {transitions.length} transitions,
          sequence length {mmss(end * 2)}, {STATS[key].grade}, {STATS[key].audio}.
        </span>
        <span aria-hidden="true">
          <b>{clips.length}</b> clips
        </span>
        <span aria-hidden="true">
          <b>{transitions.length}</b> transitions
        </span>
        <span aria-hidden="true" className={graded ? 'is-on' : undefined}>
          {STATS[key].grade}
        </span>
        <span aria-hidden="true" className={graded ? 'is-on' : undefined}>
          {STATS[key].audio}
        </span>
      </figcaption>
    </figure>
  );
}
