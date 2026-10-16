import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, MOTION_OK, useGSAP } from '../../../shared/gsap.js';
import { unsplash, unsplashSrcSet } from '../../../shared/img.js';
import { IMG } from '../data.js';
import { scrollToId, useSagewell } from '../lib.js';
import { IconArrowRight, IconArrowUp } from '../icons.jsx';
import { Wordmark } from './Nav.jsx';

export function ClosingCta() {
  const { openAccess } = useSagewell();
  const rootRef = useRef(null);
  const mediaRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          mediaRef.current,
          { yPercent: -6, scale: 1.04 },
          {
            yPercent: 6,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <section className="cr-closing" ref={rootRef} aria-labelledby="cr-closing-title">
      <div className="cr-closing__frame">
        <div className="cr-closing__media" ref={mediaRef} aria-hidden="true">
          <img
            src={unsplash(IMG.lakeSunset, { w: 1600, q: 72 })}
            srcSet={unsplashSrcSet(IMG.lakeSunset, [640, 1000, 1400, 1800, 2400], { q: 72 })}
            sizes="100vw"
            alt=""
            width="1600"
            height="2206"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="cr-closing__fog" aria-hidden="true" />
        <div className="cr-closing__inner">
          <h2 id="cr-closing-title" className="cr-closing__title" data-cr-reveal>
            Ask something <em className="cr-em">difficult.</em>
          </h2>
          <p className="cr-closing__sub" data-cr-reveal>
            Join the preview, work through the three-step setup, and read the trail behind each reply for
            yourself.
          </p>
          <div className="cr-closing__actions" data-cr-reveal>
            <button type="button" className="cr-btn cr-btn--ink cr-btn--lg" onClick={openAccess}>
              Request access
            </button>
            <a href="#developers" className="cr-btn cr-btn--glass cr-btn--lg">
              Read the docs
              <IconArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const COLS = [
  {
    title: 'Model',
    links: [
      { href: '#research', label: 'Research' },
      { href: '#use-cases', label: 'In practice' },
      { href: '#pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { href: '#developers', label: 'Getting started' },
      { href: '#playground', label: 'Playground' },
      { action: 'access', label: 'Request access' },
    ],
  },
  {
    title: 'More',
    links: [
      { href: '#journal', label: 'Journal' },
      { action: 'release', label: 'Introducing Sagewell 2' },
      { to: '/', label: 'All concepts' },
    ],
  },
];

export function Footer() {
  const { openAccess, openNote } = useSagewell();
  return (
    <footer className="cr-footer">
      <div className="cr-wrap">
        <div className="cr-footer__top">
          <div className="cr-footer__brand">
            <Wordmark href="#top" className="cr-wordmark--lg" />
            <p>A reasoning model that shows its work.</p>
          </div>
          <nav className="cr-footer__cols" aria-label="Footer">
            {COLS.map(col => (
              <div key={col.title} className="cr-footer__col">
                <h2 className="cr-footer__h">{col.title}</h2>
                <ul role="list">
                  {col.links.map(l => (
                    <li key={l.label}>
                      {l.to ? (
                        <Link to={l.to}>{l.label}</Link>
                      ) : l.href ? (
                        <a href={l.href}>{l.label}</a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => (l.action === 'access' ? openAccess() : openNote('introducing'))}
                        >
                          {l.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="cr-footer__bottom">
          <p>Sagewell is a concept product for a design portfolio. Nothing you type leaves this page.</p>
          <p>Photography: Unsplash</p>
          <p className="cr-footer__links">
            <Link to="/">All concepts</Link>
            <button type="button" onClick={() => scrollToId('top')}>
              Return to top
              <IconArrowUp size={14} />
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
