import { Fragment } from 'react';
import { ArrowRight, BookIcon } from '../icons.jsx';
import { Monogram } from './Nav.jsx';

// Fictional bio for the Maren Holt persona.
const STATEMENT = [
  ['Fourteen'],
  ['years'],
  ['editing'],
  ['fiction', 'em'],
  ['and'],
  ['narrative', 'em'],
  ['non-fiction', 'em'],
  ['from'],
  ['a'],
  ['small'],
  ['studio'],
  ['in'],
  ['Bristol'],
  ['—'],
  ['helping'],
  ['good'],
  ['drafts'],
  ['become'],
  ['the'],
  ['books'],
  ['they'],
  ['were'],
  ['meant'],
  ['to'],
  ['be.'],
];

export default function About({ onNewsletter }) {
  return (
    <section className="ch-section ch-about" id="about" aria-labelledby="ch-about-title">
      <div className="ch-wrap">
        <div className="ch-about__top">
          <p className="ch-label">
            <BookIcon size={15} /> About
          </p>
          <Monogram size="lg" />
        </div>
        <h2 className="sr-only" id="ch-about-title">
          About
        </h2>
        <p className="ch-statement" data-reveal-stagger="0.035" data-reveal-y="0">
          {STATEMENT.map(([w, kind], i) => (
            <Fragment key={i}>
              <span className={`ch-statement__w ${kind ? `is-${kind}` : ''}`}>{w}</span>{' '}
            </Fragment>
          ))}
        </p>

        <div className="ch-about__row">
          <div className="ch-about__note">
            <p className="ch-kicker">A note on Maren</p>
            <p>
              Maren Holt is a fictional editor created for this portfolio concept. The studio, the fourteen years and every essay on this
              page are invented sample content.
            </p>
          </div>
          <div className="ch-about__ctas">
            <button type="button" className="ch-btn ch-btn--raised" onClick={onNewsletter}>
              Get the Sunday notes <ArrowRight size={16} />
            </button>
            <a href="#essays" className="ch-btn ch-btn--ghost">
              Browse the essays
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
