import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowUpRight } from '../icons.jsx';

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Copenhagen',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

function useStudioTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const LINKS = [
  ['#reel', 'Reel'],
  ['#process', 'Process'],
  ['#services', 'Services'],
  ['#studio', 'Studio'],
  ['#contact', 'Contact'],
];

export default function Footer() {
  const now = useStudioTime();
  const time = fmt.format(now);

  return (
    <footer className="pf-foot">
      <div className="pf-wrap">
        <div className="pf-foot-top">
          <p className="pf-foot-clock">
            <span className="pf-foot-k">Copenhagen, studio time</span>
            <time className="pf-foot-tc" dateTime={now.toISOString()}>
              {time}
            </time>
          </p>
          <nav aria-label="Footer" className="pf-foot-nav">
            <ul role="list">
              {LINKS.map(([href, label]) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
              <li>
                <Link to="/" className="pf-foot-all">
                  All concepts <IconArrowUpRight size={12} />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <p className="pf-foot-mark" aria-hidden="true">
        <span className="pf-foot-mark-o">INES MORROW</span>
        <span className="pf-foot-mark-f">INES MORROW</span>
      </p>

      <div className="pf-wrap">
        <div className="pf-foot-bottom">
          <p>
            Ines Morrow is a fictional editor created for this portfolio concept. Concept project for a design
            portfolio.
          </p>
          <p>Photography: Unsplash</p>
          <a href="#index" className="pf-foot-top-link">
            Back to the start <span className="pf-mono">TC 00:00:00:00</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
