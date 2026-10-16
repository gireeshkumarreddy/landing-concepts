import { useEffect, useRef, useState } from 'react';
import { STEPS } from '../data.js';
import SeqTimeline from './SeqTimeline.jsx';

export default function Process() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef([]);
  const btnRefs = useRef([]);

  // Scrolling a step through the band just below the sticky timeline selects it.
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(Number(e.target.dataset.i))),
      { rootMargin: '-56% 0px -38% 0px' },
    );
    stepRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const onKey = (e, i) => {
    const map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let n;
    if (e.key in map) n = (i + map[e.key] + STEPS.length) % STEPS.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = STEPS.length - 1;
    else return;
    e.preventDefault();
    setActive(n);
    btnRefs.current[n]?.focus();
  };

  return (
    <section id="process" className="pf-sec pf-why" aria-labelledby="pf-why-title">
      <div className="pf-wrap pf-why-grid">
        <div className="pf-why-head">
          <p className="pf-eyebrow pf-reveal">
            <span className="pf-eyebrow-n">02</span> Process
          </p>
          <h2 id="pf-why-title" className="pf-h2 pf-reveal">
            One timeline, <span className="pf-h2-soft">four honest passes.</span>
          </h2>
          <p className="pf-lede pf-reveal">
            Each film goes through the same four stages, and you get to see the sequence after every one. Choose a
            stage, or keep scrolling, and watch the timeline tighten from first sync to final mix.
          </p>
        </div>

        <div className="pf-why-vis">
          <SeqTimeline step={active} />
          <div className="pf-why-dots" aria-hidden="true">
            {STEPS.map((s, i) => (
              <span key={s.id} className={i <= active ? 'is-on' : undefined} />
            ))}
          </div>
        </div>

        <ol className="pf-steps" role="list">
          {STEPS.map((s, i) => (
            <li
              key={s.id}
              ref={el => (stepRefs.current[i] = el)}
              data-i={i}
              className={`pf-step${active === i ? ' is-active' : ''}`}
            >
              <h3 className="pf-step-h">
                <button
                  ref={el => (btnRefs.current[i] = el)}
                  type="button"
                  className="pf-step-btn"
                  aria-pressed={active === i}
                  aria-controls="pf-seq"
                  onClick={() => setActive(i)}
                  onKeyDown={e => onKey(e, i)}
                >
                  <span className="pf-step-n">0{i + 1}</span>
                  <span className="pf-step-name">{s.name}</span>
                  <span className="pf-step-days">{s.days}</span>
                </button>
              </h3>
              <p className="pf-step-line">{s.line}</p>
              <p className="pf-step-body">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
