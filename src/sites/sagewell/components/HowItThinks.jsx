import { useRef } from 'react';
import { gsap, MOTION_OK, useGSAP } from '../../../shared/gsap.js';
import { unsplash, unsplashSrcSet } from '../../../shared/img.js';
import { IMG, PASSES } from '../data.js';

export default function HowItThinks() {
  const rootRef = useRef(null);
  const mediaRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          mediaRef.current,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
        gsap.from('.cr-think-item', {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '.cr-how__cards', start: 'top 85%', once: true },
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section className="cr-how" id="research" ref={rootRef} aria-labelledby="cr-how-title">
      <div className="cr-how__frame">
        <div className="cr-how__media" ref={mediaRef} aria-hidden="true">
          <img
            src={unsplash(IMG.garden, { w: 1600, q: 70 })}
            srcSet={unsplashSrcSet(IMG.garden, [640, 1000, 1400, 1800, 2400], { q: 70 })}
            sizes="100vw"
            alt=""
            width="1600"
            height="1266"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="cr-how__fog" aria-hidden="true" />

        <div className="cr-how__inner">
          <div className="cr-how__head">
            <p className="cr-eyebrow" data-cr-reveal>
              <b>03</b> Research
            </p>
            <h2 id="cr-how-title" className="cr-h2" data-cr-reveal>
              Four passes, one visible trail.
            </h2>
            <p className="cr-lede" data-cr-reveal>
              Sagewell works through a question in deliberate passes and records each one. Show the trail to your
              readers, keep it for audit, or fold it into a single line.
            </p>
          </div>

          <ol className="cr-how__cards" role="list">
            {PASSES.map((c, i) => (
              <li key={c.title} className="cr-think-item">
                {/* GSAP reveals the <li>; hover/focus lift lives on the inner card so CSS transitions never fight the tween. */}
                <div className="cr-think" tabIndex={0} role="group" aria-labelledby={`cr-think-${i}`}>
                  <span className="cr-think__num" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <h3 className="cr-think__title" id={`cr-think-${i}`}>
                    {c.title}
                  </h3>
                  <p className="cr-think__line">{c.line}</p>
                  <p className="cr-think__detail">{c.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
