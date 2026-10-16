import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '../../../shared/gsap.js';
import { unsplash } from '../../../shared/img.js';
import { IMG, QUICKSTART } from '../data.js';
import { tx, useCopy } from '../lib.js';
import { IconCheck, IconCopy } from '../icons.jsx';

const lineText = line => line.map(([, v]) => v).join('');

function copyFor(step) {
  if (step.id === 'request') {
    const end = step.lines.findIndex(l => !l.length);
    return step.lines.slice(0, end).map(lineText).join('\n');
  }
  return step.lines
    .filter(l => l[0]?.[0] === 'p')
    .map(l => lineText(l.slice(1)))
    .join('\n');
}

export default function Quickstart() {
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const fillRef = useRef(null);
  const railRef = useRef(null);
  const tabRefs = useRef([]);
  const lastScrollIdx = useRef(0);
  const [copyState, copy] = useCopy();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          fillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: listRef.current, start: 'top 72%', end: 'bottom 52%', scrub: 0.5 },
          }
        );
      });
      // Step follows the reader's scroll position (clicks still win until the next threshold).
      ScrollTrigger.create({
        trigger: listRef.current,
        start: 'top 72%',
        end: 'bottom 52%',
        onUpdate: self => {
          const i = Math.min(QUICKSTART.length - 1, Math.floor(self.progress * QUICKSTART.length));
          if (i !== lastScrollIdx.current) {
            lastScrollIdx.current = i;
            setActive(i);
          }
        },
      });
    },
    { scope: rootRef }
  );

  // The rail runs exactly from the first step marker to the last one.
  useLayoutEffect(() => {
    const list = listRef.current;
    const rail = railRef.current;
    if (!list || !rail) return;
    const measure = () => {
      const nums = list.querySelectorAll('.cr-qs-step__num');
      if (nums.length < 2) return;
      const top = list.getBoundingClientRect().top;
      const a = nums[0].getBoundingClientRect();
      const z = nums[nums.length - 1].getBoundingClientRect();
      const y0 = a.top + a.height / 2 - top;
      rail.style.top = `${y0}px`;
      rail.style.height = `${z.top + z.height / 2 - top - y0}px`;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  const onKeyDown = e => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = null;
    if (e.key in keys) next = (active + keys[e.key] + QUICKSTART.length) % QUICKSTART.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = QUICKSTART.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const step = QUICKSTART[active];

  return (
    <section className="cr-section cr-qs" id="developers" ref={rootRef} aria-labelledby="cr-qs-title">
      <div className="cr-wrap cr-qs__grid">
        <div className="cr-qs__intro">
          <p className="cr-eyebrow" data-cr-reveal>
            <b>01</b> Getting started
          </p>
          <h2 id="cr-qs-title" className="cr-h2" data-cr-reveal>
            Three steps to your first traced answer.
          </h2>
          <p className="cr-lede" data-cr-reveal>
            One key, one endpoint, and a depth setting you can change per question. Tools, schemas and live
            trails are there when you want them.
          </p>

          <div className="cr-qs__steps" ref={listRef}>
            <span className="cr-qs__rail" ref={railRef} aria-hidden="true">
              <span className="cr-qs__fill" ref={fillRef} style={{ '--cr-step': active }} />
            </span>
            <div role="tablist" aria-orientation="vertical" aria-label="Setup steps" onKeyDown={onKeyDown}>
              {QUICKSTART.map((s, i) => (
                <button
                  key={s.id}
                  ref={el => (tabRefs.current[i] = el)}
                  type="button"
                  role="tab"
                  id={`cr-qs-tab-${s.id}`}
                  aria-selected={active === i}
                  aria-controls="cr-qs-panel"
                  tabIndex={active === i ? 0 : -1}
                  className={`cr-qs-step${active === i ? ' is-active' : ''}${i < active ? ' is-past' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <span className="cr-qs-step__num" aria-hidden="true">
                    {i < active ? <IconCheck size={13} /> : i + 1}
                  </span>
                  <span className="cr-qs-step__text">
                    <span className="cr-qs-step__title">{s.title}</span>
                    <span className="cr-qs-step__body">{s.body}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="cr-qs__aside cr-plate" data-cr-reveal>
          <img className="cr-plate__img" src={unsplash(IMG.coastSunset, { w: 480, q: 60 })} alt="" width="480" height="337" loading="lazy" decoding="async" aria-hidden="true" />
          <div
            className="cr-term"
            role="tabpanel"
            id="cr-qs-panel"
            aria-labelledby={`cr-qs-tab-${step.id}`}
            tabIndex={0}
          >
            <div className="cr-term__bar">
              <span className="cr-term__file">{step.file}</span>
              <button type="button" className="cr-term__copy" onClick={() => copy(copyFor(step))}>
                {copyState === 'copied' ? <IconCheck size={14} /> : <IconCopy size={14} />}
                <span>{copyState === 'copied' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="cr-term__body">
              {/* Hidden copies of all three steps hold the terminal at its tallest height, so nothing below jumps. */}
              {QUICKSTART.map(s => (
                <pre key={s.id} className="cr-term__pre cr-term__sizer" aria-hidden="true">
                  <code>
                    {s.lines.map((line, li) => (
                      <span key={li} className="cr-term__line">
                        {line.length ? lineText(line) : ' '}
                      </span>
                    ))}
                  </code>
                </pre>
              ))}
              <AnimatePresence mode="wait" initial={false}>
                <motion.pre
                  key={step.id}
                  className="cr-term__pre"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={tx({ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] })}
                >
                  <code>
                    {step.lines.map((line, li) => (
                      <motion.span
                        key={li}
                        className="cr-term__line"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={tx({ delay: 0.05 + li * 0.045, duration: 0.25 })}
                      >
                        {line.length ? line.map(([type, text], ti) => (
                          <span key={ti} className={`cr-tk-${type}`}>
                            {text}
                          </span>
                        )) : ' '}
                      </motion.span>
                    ))}
                  </code>
                </motion.pre>
              </AnimatePresence>
            </div>
            <div className="cr-term__foot">
              <span>
                Step {active + 1} of {QUICKSTART.length}
              </span>
              <span>{step.meta}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
