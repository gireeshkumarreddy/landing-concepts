import { Link } from 'react-router-dom';
import { unsplash, unsplashSrcSet } from '../../../shared/img.js';
import { IMG } from '../data.js';
import { scrollToId, useSagewell } from '../lib.js';
import { IconArrowRight, IconArrowUp } from '../icons.jsx';
import { Wordmark } from './Nav.jsx';

export function ClosingCta() {
  const { openAccess } = useSagewell();
  return (
    <section className="cr-closing" aria-labelledby="cr-closing-title">
      <div className="cr-closing__frame" data-expand="9% 14%" data-expand-radius="22px" data-expand-end="center 60%">
        <div className="cr-closing__media" aria-hidden="true">
          <img
            data-parallax="0.12"
            src={unsplash(IMG.stream, { w: 1600, q: 70 })}
            srcSet={unsplashSrcSet(IMG.stream, [640, 1000, 1400, 1800, 2400], { q: 70 })}
            sizes="100vw"
            alt=""
            width="1600"
            height="1015"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="cr-closing__fog" aria-hidden="true" />
        <div className="cr-closing__inner">
          <h2 id="cr-closing-title" className="cr-closing__title" data-reveal="lines">
            Ask something <br className="cr-br-lg" />
            difficult.
          </h2>
          <p className="cr-closing__sub" data-reveal="fade" data-reveal-delay="0.15">
            Join the preview, work through the three-step setup, and read the trail behind each reply for
            yourself.
          </p>
          <div className="cr-closing__actions" data-reveal="fade" data-reveal-delay="0.25">
            <button type="button" className="cr-btn cr-btn--ink cr-btn--lg" data-magnetic="0.3" onClick={openAccess}>
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
