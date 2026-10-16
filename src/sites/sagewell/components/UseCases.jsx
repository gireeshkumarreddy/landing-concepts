import { useRef } from 'react';
import { gsap, MOTION_OK, useGSAP } from '../../../shared/gsap.js';
import { unsplash, unsplashSrcSet } from '../../../shared/img.js';
import { EXAMPLES, USE_CASES } from '../data.js';
import { useSagewell } from '../lib.js';
import { IconArrowUp } from '../icons.jsx';

export default function UseCases() {
  const rootRef = useRef(null);
  const { loadPrompt } = useSagewell();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // The mobile rail scrolls sideways, so only stagger the cards in on wider screens.
        if (window.innerWidth <= 700) return;
        gsap.from('.cr-use', {
          y: 60,
          opacity: 0,
          duration: 1.05,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: '.cr-uses__rail', start: 'top 85%', once: true },
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section className="cr-section cr-uses" id="use-cases" ref={rootRef} aria-labelledby="cr-uses-title">
      <div className="cr-wrap">
        <header className="cr-uses__head">
          <div>
            <p className="cr-eyebrow" data-cr-reveal>
              <b>04</b> In practice
            </p>
            <h2 id="cr-uses-title" className="cr-h2" data-cr-reveal>
              Questions with <br className="cr-br-lg" />
              consequences.
            </h2>
          </div>
          <p className="cr-lede" data-cr-reveal>
            Send any of these to the composer at the top of the page and watch a scripted trail unfold, pass by
            pass.
          </p>
        </header>
      </div>

      <ul className="cr-uses__rail" role="list">
        {USE_CASES.map(u => {
          const ex = EXAMPLES.find(e => e.id === u.example);
          return (
            <li key={u.id} className="cr-use">
              <img
                className="cr-use__img"
                src={unsplash(u.img, { w: 700, h: 980, q: 70 })}
                srcSet={unsplashSrcSet(u.img, [420, 700, 1000], { ratio: 1.4, q: 70 })}
                sizes="(max-width: 700px) 78vw, (max-width: 1100px) 45vw, 25vw"
                style={{ objectPosition: u.pos }}
                alt=""
                width="700"
                height="980"
                loading="lazy"
                decoding="async"
              />
              <div className="cr-use__card">
                <h3 className="cr-use__label">{u.label}</h3>
                <p className="cr-use__q">“{ex.question}”</p>
                <p className="cr-use__body">{u.body}</p>
                <button
                  type="button"
                  className="cr-use__try"
                  onClick={() => loadPrompt(ex.question)}
                  aria-label={`Ask this: send “${ex.question}” to the composer`}
                >
                  Ask this
                  <IconArrowUp size={15} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
