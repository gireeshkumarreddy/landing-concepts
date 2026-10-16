import { Link } from 'react-router-dom';
import { goToWaitlist } from '../lib.js';
import { ArrowUpRight } from '../icons.jsx';
import Wordmark from './Wordmark.jsx';

const COLS = [
  {
    title: 'Product',
    links: [
      { href: '#people', label: 'By person' },
      { href: '#features', label: 'Tools' },
      { href: '#top', label: 'Try the inbox' },
    ],
  },
  {
    title: 'Emberpost',
    links: [
      { href: '#manifesto', label: 'Manifesto' },
      { href: '#workflows', label: 'Workflows' },
      { href: '#waitlist', label: 'Waitlist', waitlist: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="ta-footer">
      <div className="ta-wrap">
        <div className="ta-footer__top">
          <div className="ta-footer__brand">
            <Wordmark className="ta-wordmark--lg" />
            <p>Email organised around the people behind it.</p>
          </div>
          <div className="ta-footer__cols">
            {COLS.map(col => (
              <nav key={col.title} aria-label={`${col.title} links`}>
                <p className="ta-footer__h">{col.title}</p>
                <ul role="list">
                  {col.links.map(l => (
                    <li key={l.href}>
                      <a href={l.href} onClick={l.waitlist ? goToWaitlist : undefined}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <nav aria-label="Portfolio">
              <p className="ta-footer__h">Portfolio</p>
              <ul role="list">
                <li>
                  <Link to="/" className="ta-footer__back">
                    All concepts <ArrowUpRight size={13} />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="ta-footer__bottom">
          <p>Emberpost is a concept product for a design portfolio. People and messages are sample data.</p>
          <p>Photography: Unsplash</p>
        </div>
      </div>
    </footer>
  );
}
