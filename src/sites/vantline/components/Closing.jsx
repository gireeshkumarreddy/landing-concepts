import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../data.js';
import { ArrowUp } from '../icons.jsx';
import { PillButton } from './ui.jsx';

export const CtaBand = forwardRef(function CtaBand({ onSignup }, ref) {
  return (
    <section className="au-cta" aria-labelledby="au-cta-title" ref={ref}>
      <div className="au-cta__inner">
        <p className="au-cta__kicker" data-au-cta>
          (Ready when you are)
        </p>
        <h2 className="au-cta__title" id="au-cta-title" data-au-cta>
          Make the next call <em className="au-break">a clear one.</em>
        </h2>
        <div className="au-cta__row" data-au-cta>
          <p className="au-cta__sub">Connect a few sources and read your first Vantline brief this week.</p>
          <PillButton tone="light" onClick={onSignup}>
            Try Vantline free
          </PillButton>
        </div>
      </div>
    </section>
  );
});

export function Footer({ onSignup, onChoose }) {
  return (
    <footer className="au-footer">
      <div className="au-footer__grid">
        <div className="au-footer__about">
          <p className="au-wordmark au-footer__brand">vantline</p>
          <p className="au-footer__line">
            A copilot that explains what changed in your numbers, and <em>what to do next.</em>
          </p>
        </div>
        <nav className="au-footer__nav" aria-label="Footer">
          <div className="au-footer__col">
            <h3>Explore</h3>
            <ul role="list">
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="au-footer__col">
            <h3>Get started</h3>
            <ul role="list">
              <li>
                <button type="button" onClick={onSignup}>
                  Try Vantline free
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onChoose('business')}>
                  Request the Business plan
                </button>
              </li>
              <li>
                <a href="#plans">Compare plans</a>
              </li>
            </ul>
          </div>
          <div className="au-footer__col">
            <h3>Concept</h3>
            <ul role="list">
              <li>
                <Link to="/">All concepts</Link>
              </li>
              <li>
                <a href="#top" className="au-footer__top">
                  Back to top <ArrowUp />
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="au-footer__base">
        <p>Vantline is a concept product for a design portfolio. Chart values are sample data.</p>
        <p>Photography: Unsplash</p>
      </div>
      <p className="au-footer__mega" aria-hidden="true">
        vantline
      </p>
    </footer>
  );
}
