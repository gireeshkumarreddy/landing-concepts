import { Link } from 'react-router-dom';
import { NAV } from '../data.js';
import { ArrowLeft, ArrowUp, SearchIcon } from '../icons.jsx';
import Keycap from './Keycap.jsx';
import { Monogram } from './Nav.jsx';

export default function Footer({ onSearch }) {
  return (
    <footer className="ch-footer">
      <div className="ch-wrap">
        <p className="ch-footer__big" aria-hidden="true">
          Notes for <Keycap tone="white" glyph="pencil" className="ch-key--sm" /> better books
        </p>

        <div className="ch-footer__grid">
          <div className="ch-footer__brand">
            <span className="ch-brand">
              <Monogram />
              <span className="ch-brand__name">Maren Holt</span>
            </span>
            <p className="ch-footer__disclaimer">
              Maren Holt is a fictional editor created for this portfolio concept. Essays are sample content.
            </p>
          </div>

          <nav aria-label="Footer" className="ch-footer__nav">
            <p className="ch-kicker">On this page</p>
            <ul role="list">
              {NAV.map(n => (
                <li key={n.id}>
                  <a href={`#${n.id}`}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ch-footer__nav">
            <p className="ch-kicker">Elsewhere</p>
            <ul role="list">
              <li>
                <Link to="/" className="ch-footer__back">
                  <ArrowLeft size={14} /> All concepts
                </Link>
              </li>
              <li>
                <button type="button" onClick={onSearch}>
                  <SearchIcon size={14} /> Search essays
                </button>
              </li>
              <li>
                <a href="#top">
                  <ArrowUp size={14} /> Back to top
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="ch-footer__base">
          <p>Concept project for a design portfolio.</p>
          <p>
            Photography:{' '}
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
              Unsplash
            </a>
          </p>
          <p>Type: Plus Jakarta Sans &amp; Newsreader.</p>
        </div>
      </div>
    </footer>
  );
}
