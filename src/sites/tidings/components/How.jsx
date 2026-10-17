import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '../../../shared/gsap.js';
import SectionHead from './SectionHead.jsx';
import { STEPS } from '../data.js';
import { IconCheck } from '../icons.jsx';

export default function How() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const track = root.current.querySelector('.ar-how-line');
        const steps = gsap.utils.toArray('.ar-how-step', root.current);
        steps.forEach(s => s.classList.remove('is-on'));
        gsap.fromTo(
          track,
          { '--p': 0 },
          {
            '--p': 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current.querySelector('.ar-how-steps'),
              start: 'top 78%',
              end: 'bottom 52%',
              scrub: 0.6,
              onUpdate: self => {
                steps.forEach((s, i) => s.classList.toggle('is-on', self.progress >= (i / (steps.length - 1)) * 0.94));
              },
            },
          }
        );
        return () => steps.forEach(s => s.classList.add('is-on'));
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="how" className="ar-section ar-how" aria-labelledby="ar-how-title" ref={root}>
      <div className="ar-wrap">
        <SectionHead
          id="ar-how-title"
          eyebrow="How it works"
          title="Three steps from your number to your first send."
          align="center"
        />
        <div className="ar-how-steps">
          <div className="ar-how-line" aria-hidden="true">
            <span className="ar-how-fill" />
          </div>
          <ol className="ar-how-list" role="list" data-reveal="stagger" data-reveal-stagger="0.12">
            {STEPS.map((s, i) => (
              <li key={s.title} className="ar-how-step is-on">
                <span className="ar-how-node" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="ar-how-k">Step {i + 1}</span>
                <h3 className="ar-h3">{s.title}</h3>
                <p>{s.text}</p>
                <span className="ar-how-chip">
                  {i === 0 && <IconCheck size={13} sw={2.6} />}
                  {s.chip}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
