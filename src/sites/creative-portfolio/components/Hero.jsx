import { useRef } from 'react';
import { gsap, MOTION_OK, SplitText, useGSAP } from '../../../shared/gsap.js';
import { unsplash } from '../../../shared/img.js';
import { HEADSHOT } from '../data.js';
import { goToContact } from '../utils.js';
import { IconArrowRight, IconFilm, IconScissors } from '../icons.jsx';
import HeroTimeline from './HeroTimeline.jsx';
import ClientStrip from './ClientStrip.jsx';

export default function Hero({ onOpenProject }) {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const split = SplitText.create(q('.pf-h1'), { type: 'words', wordsClass: 'pf-w', mask: 'words' });
        const path = q('.pf-ann-path')[0];
        const len = path ? path.getTotalLength() : 0;

        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.from(q('.pf-badge'), { y: 10, autoAlpha: 0, duration: 0.8 }, 0.1)
          .from(split.words, { yPercent: 115, duration: 1.05, stagger: 0.045 }, 0.18)
          .from(
            q('.pf-tile'),
            { scale: 0.35, autoAlpha: 0, rotate: i => (i ? 28 : -28), duration: 0.95, stagger: 0.14 },
            0.62,
          )
          .from(q('.pf-hero-cta'), { y: 10, autoAlpha: 0, duration: 0.8 }, 0.78)
          .from(q('.pf-ann-text'), { autoAlpha: 0, x: -8, duration: 0.8 }, 0.9);
        if (path) {
          tl.fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' },
            1.0,
          ).from(q('.pf-ann-head'), { autoAlpha: 0, duration: 0.3, ease: 'power1.out' }, 1.95);
        }
        tl.from(q('.pf-tl-tick'), { scaleY: 0, duration: 0.7, stagger: { each: 0.012, from: 'center' } }, 0.9)
          .from(q('.pf-tl-label'), { autoAlpha: 0, y: 4, duration: 0.6, stagger: 0.05 }, 1.05)
          .from(q('.pf-tl-clips'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1.1, ease: 'expo.inOut' }, 1.05)
          // The monitor and playhead carry React-driven transforms, so only fade them.
          .from(q('.pf-mon, .pf-tl-head'), { autoAlpha: 0, duration: 0.8, stagger: 0.06 }, 1.25)
          .from(q('.pf-tl-meta'), { autoAlpha: 0, y: 6, duration: 0.8 }, 1.35)
          .from(q('.pf-client'), { autoAlpha: 0, y: 10, duration: 0.7, stagger: 0.05 }, 1.35)
          .from(q('.pf-clients-cap'), { autoAlpha: 0, duration: 0.6 }, 1.6);

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section id="index" className="pf-hero" ref={root} aria-labelledby="pf-hero-title">
      <div className="pf-hero-head">
        <div className="pf-ann">
          <p className="pf-ann-text">
            Cuts that keep
            <br /> people watching
          </p>
          <svg className="pf-ann-arrow" viewBox="0 0 76 46" aria-hidden="true" focusable="false">
            <path className="pf-ann-path" d="M2 12c5-6 11-7 15-1s10 7 15 1c6-8 16-7 22 2 5 7 9 16 12 26" />
            <path className="pf-ann-head" d="M59.6 35.2 66.2 40.6 68.6 32.4" />
          </svg>
        </div>

        <p className="pf-badge">
          <IconFilm size={14} />
          <span>Edit · Grade · Sound</span>
        </p>

        <h1 className="pf-h1" id="pf-hero-title">
          <span className="pf-h1-l">
            I’m{' '}
            <span className="pf-tile pf-tile--photo" aria-hidden="true">
              <img
                src={unsplash(HEADSHOT, { w: 96, h: 96, crop: 'faces', q: 80 })}
                srcSet={`${unsplash(HEADSHOT, { w: 96, h: 96, crop: 'faces', q: 80 })} 1x, ${unsplash(HEADSHOT, {
                  w: 192,
                  h: 192,
                  crop: 'faces',
                  q: 75,
                })} 2x`}
                width="96"
                height="96"
                alt=""
                decoding="async"
                fetchPriority="high"
              />
            </span>{' '}
            the editor who turns
          </span>{' '}
          <span className="pf-h1-l">
            hours of{' '}
            <span className="pf-tile pf-tile--icon" aria-hidden="true">
              <IconScissors size={24} />
            </span>{' '}
            footage into
          </span>{' '}
          <span className="pf-h1-l">the two minutes that matter</span>
        </h1>

        <div className="pf-hero-cta">
          <a href="#contact" className="pf-btn pf-btn--signal" onClick={goToContact}>
            Start a project
            <IconArrowRight size={14} />
          </a>
        </div>
      </div>

      <HeroTimeline onOpen={onOpenProject} />
      <ClientStrip />
    </section>
  );
}
