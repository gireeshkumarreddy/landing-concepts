import { useId, useRef, useState } from 'react';
import { gsap, useGSAP, MOTION_OK } from '../../../shared/gsap.js';
import { IMG, depthFor, secondsFor } from '../data.js';
import SignalChart from './SignalChart.jsx';
import { Photo } from './ui.jsx';

function ReasoningDepth() {
  const id = useId();
  const [value, setValue] = useState(72);
  const depth = depthFor(value);
  const secs = secondsFor(value);
  const readout = `${depth.label} · ~${secs}s`;

  return (
    <article className="au-glass au-depth">
      <h3 className="au-card-title">Depth of analysis</h3>
      <p className="au-glass__text">Choose how hard Vantline digs before it answers.</p>

      <div className="au-depth__row">
        <label htmlFor={id} className="au-depth__label">
          Analysis depth
        </label>
        <output htmlFor={id} className="au-depth__readout" aria-live="polite">
          {readout}
        </output>
      </div>
      <input
        id={id}
        className="au-range"
        type="range"
        min="0"
        max="100"
        step="1"
        value={value}
        onChange={e => setValue(+e.target.value)}
        aria-valuetext={readout}
        style={{ '--au-val': `${value}%` }}
      />
      <div className="au-depth__scale" aria-hidden="true">
        <span>Skim</span>
        <span>Full investigation</span>
      </div>
      <p className="au-depth__note">{depth.note}</p>
    </article>
  );
}

export default function Features() {
  const ref = useRef(null);
  const chartApi = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(ref);
        gsap.from(q('.au-panel'), {
          scale: 0.94,
          opacity: 0.4,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('.au-panel')[0], start: 'top 88%', once: true },
        });
        gsap.from(q('.au-panel__grid > *'), {
          y: 40,
          opacity: 0,
          duration: 1.1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('.au-panel__grid')[0], start: 'top 82%', once: true },
        });
        const { line, area } = chartApi.current || {};
        if (line) {
          gsap.set(line, { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set(area, { opacity: 0 });
          const tl = gsap.timeline({ scrollTrigger: { trigger: line.closest('.au-chart'), start: 'top 75%', once: true } });
          tl.to(line, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', clearProps: 'strokeDasharray,strokeDashoffset' }, 0.25).to(
            area,
            { opacity: 1, duration: 1.2, ease: 'power2.out' },
            1.1
          );
        }
      });
    },
    { scope: ref }
  );

  return (
    <section className="au-features" id="product" aria-labelledby="au-features-title" ref={ref}>
      <div className="au-panel">
        <div className="au-panel__bg" aria-hidden="true">
          <Photo id={IMG.panel} alt="" widths={[800, 1200, 1600, 2200, 2800]} sizes="100vw" />
        </div>
        <div className="au-panel__inner">
          <div className="au-head au-head--tight">
            <h2 className="au-h2" id="au-features-title" data-au-reveal>
              Clarity, <em>built into every view</em>
            </h2>
            <p className="au-lede" data-au-reveal>
              Read the numbers, question them and act, without opening another dashboard.
            </p>
          </div>

          <div className="au-panel__grid">
            <article className="au-glass au-glass--chart">
              <SignalChart ref={chartApi} />
              <div className="au-glass__foot">
                <h3 className="au-card-title">Signal over noise</h3>
                <p className="au-glass__text">
                  Vantline separates real movement from everyday wobble, so you only hear about the changes worth a
                  conversation.
                </p>
              </div>
            </article>

            <div className="au-panel__side">
              <article className="au-people">
                <Photo
                  className="au-people__img"
                  id={IMG.people}
                  alt="A person walking across rippled sand, lit from behind by a low sun"
                  widths={[480, 800, 1200]}
                  sizes="(max-width: 960px) 92vw, 440px"
                />
                <div className="au-people__copy">
                  <h3 className="au-card-title">Made for the people in the room</h3>
                  <p className="au-glass__text">Briefs written for product, finance and ops, not only whoever owns the dashboard.</p>
                </div>
              </article>
              <ReasoningDepth />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
