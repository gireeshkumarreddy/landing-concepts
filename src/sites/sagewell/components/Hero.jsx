import { useRef, useState } from 'react';
import { gsap, MOTION_OK, SplitText, useGSAP } from '../../../shared/gsap.js';
import { unsplash, unsplashSrcSet } from '../../../shared/img.js';
import { CHIP_EXAMPLES, IMG, TRAIL_TITLES, fallbackRun, findExample } from '../data.js';
import { useSagewell } from '../lib.js';
import Composer from './Composer.jsx';
import ReasoningPanel from './ReasoningPanel.jsx';

export default function Hero({ composerRef }) {
  const rootRef = useRef(null);
  const mediaRef = useRef(null);
  const driftRef = useRef(null);
  const [run, setRun] = useState(null);
  const { showRelease } = useSagewell();

  const submit = ({ text, depth, file }) => {
    const ex = findExample(text);
    const data = ex ? { titles: TRAIL_TITLES, steps: ex.steps, answer: ex.answer } : fallbackRun(text);
    setRun({ key: Date.now(), question: text, depth, file, data });
  };

  const loadExample = q => {
    setRun(null);
    composerRef.current?.load(q);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const page = rootRef.current.closest('.cr');
        const split = SplitText.create('.cr-hero__title', { type: 'words', wordsClass: 'cr-word' });
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from(driftRef.current, { scale: 1.06, duration: 2.2, ease: 'expo.out' }, 0)
          .from(page.querySelector('.cr-header__inner'), { y: -10, opacity: 0, duration: 0.8 }, 0.1)
          .from('[data-cr-intro="badge"]', { y: 12, opacity: 0, duration: 0.7 }, 0.2)
          .from(split.words, { yPercent: 45, opacity: 0, filter: 'blur(10px)', duration: 1.05, stagger: 0.06 }, 0.26)
          .from('[data-cr-intro="sub"]', { y: 14, opacity: 0, filter: 'blur(4px)', duration: 0.9 }, 0.62)
          .from('[data-cr-intro="composer"]', { y: 24, opacity: 0, duration: 0.95 }, 0.74)
          .from('[data-cr-intro="chips"] li', { y: 10, opacity: 0, duration: 0.6, stagger: 0.05 }, 0.95);

        // Slow parallax: the painting drifts at roughly a quarter of the scroll speed.
        gsap.to(mediaRef.current, {
          yPercent: 16,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        return () => split.revert();
      });

      // Subtle mouse drift (±6px) on fine pointers only.
      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
        const xTo = gsap.quickTo(driftRef.current, 'x', { duration: 1.6, ease: 'power3.out' });
        const yTo = gsap.quickTo(driftRef.current, 'y', { duration: 1.6, ease: 'power3.out' });
        const onMove = e => {
          const r = rootRef.current.getBoundingClientRect();
          if (r.bottom < 0) return;
          xTo(((e.clientX - r.left) / r.width - 0.5) * -12);
          yTo(((e.clientY - r.top) / r.height - 0.5) * -12);
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
      });
    },
    { scope: rootRef }
  );

  return (
    <section className="cr-hero" id="top" ref={rootRef} aria-labelledby="cr-hero-title">
      <div className="cr-hero__frame">
        <div className="cr-hero__media" ref={mediaRef} aria-hidden="true">
          <div className="cr-hero__drift" ref={driftRef}>
            <picture>
              <source
                media="(max-width: 700px)"
                srcSet={unsplashSrcSet(IMG.heroTall, [480, 720, 960, 1280], { q: 70 })}
                sizes="100vw"
              />
              <img
                src={unsplash(IMG.heroWide, { w: 1600, q: 72 })}
                srcSet={unsplashSrcSet(IMG.heroWide, [800, 1200, 1600, 2000, 2600], { q: 72 })}
                sizes="100vw"
                alt=""
                width="1600"
                height="1049"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>
        </div>
        <div className="cr-hero__fog" aria-hidden="true" />

        <div className="cr-hero__content">
          <div data-cr-intro="badge">
            <button type="button" className="cr-badge" onClick={showRelease}>
              <span className="cr-badge__new">Preview</span>
              <span className="cr-badge__text">Sagewell 2 reads a million tokens</span>
            </button>
          </div>

          <h1 id="cr-hero-title" className="cr-hero__title">
            <span className="cr-hero__line">The model that thinks</span>{' '}
            <span className="cr-hero__line">before it speaks.</span>
          </h1>

          <p className="cr-hero__sub" data-cr-intro="sub">
            Sagewell plans, checks and revises its own reasoning before it replies —{' '}
            <span className="cr-hero__sub-2">so every answer comes with a trail you can follow, cite and defend.</span>
          </p>

          <Composer ref={composerRef} onSubmit={submit} />

          {run ? (
            <ReasoningPanel
              key={run.key}
              run={run}
              onPickExample={loadExample}
              onAskAnother={() => {
                setRun(null);
                composerRef.current?.focus();
              }}
            />
          ) : (
            <div className="cr-examples" data-cr-intro="chips">
              <p className="sr-only" id="cr-examples-label">
                Sample questions
              </p>
              <ul role="list" aria-labelledby="cr-examples-label">
                {CHIP_EXAMPLES.map(ex => (
                  <li key={ex.id}>
                    <button
                      type="button"
                      className="cr-chip"
                      onClick={() => composerRef.current?.load(ex.question)}
                      aria-label={`Try the sample question: ${ex.question}`}
                    >
                      {ex.chip}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
