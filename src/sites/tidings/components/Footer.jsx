import { Link } from 'react-router-dom';
import Columns from './Columns.jsx';
import { useTidings } from '../hooks.jsx';
import { LEARN_LINKS, PLATFORM_LINKS, REGIONS, REGION_ORDER } from '../data.js';
import { IconArrow } from '../icons.jsx';
import Wordmark from './Wordmark.jsx';

export function FinalCta() {
  const { openWizard, openContact } = useTidings();
  return (
    <section className="ar-final" aria-labelledby="ar-final-title">
      <div className="ar-wrap">
        <div className="ar-final-band" data-expand="7% 9%" data-expand-radius="40px" data-expand-start="top 95%" data-expand-end="center 60%">
          <Columns className="is-final" />
          <div className="ar-final-copy">
            <p className="ar-eyebrow is-light" data-reveal="fade">Start small, measure everything</p>
            <h2 id="ar-final-title" className="ar-final-title" data-reveal="lines">
              Your customers are already in the chat.
            </h2>
            <p className="ar-final-sub" data-reveal="fade" data-reveal-delay="0.15">Draft a first campaign, preview it on a real conversation and send only when it feels right.</p>
            <div className="ar-final-actions" data-reveal="fade" data-reveal-delay="0.25">
              <button type="button" className="ar-cta is-white" data-magnetic="0.3" onClick={() => openWizard()}>
                Launch a campaign
                <span className="ar-cta-dot">
                  <IconArrow size={18} sw={2.2} />
                </span>
              </button>
              <button type="button" className="ar-btn ar-btn-glass" onClick={openContact}>
                Talk to sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Footer() {
  const { region, setRegion, openContact } = useTidings();
  return (
    <footer className="ar-footer">
      <div className="ar-wrap">
        <div className="ar-footer-top">
          <div className="ar-footer-brand">
            <a href="#top" className="ar-wordmark is-lg" aria-label="tidings — back to top">
              <Wordmark />
            </a>
            <p>WhatsApp campaigns customers actually want to open — broadcasts, product messages, payments and journeys in one place.</p>
            <div className="ar-footer-region">
              <label htmlFor="ar-footer-region" className="ar-label">
                Region &amp; currency
              </label>
              <select id="ar-footer-region" className="ar-input ar-select is-compact" value={region} onChange={e => setRegion(e.target.value)}>
                {REGION_ORDER.map(code => (
                  <option key={code} value={code}>
                    {REGIONS[code].name} ({REGIONS[code].symbol} {REGIONS[code].currency})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <nav className="ar-footer-cols" aria-label="Footer">
            <div>
              <p className="ar-footer-h">Platform</p>
              <ul role="list">
                {PLATFORM_LINKS.map(l => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="ar-footer-h">Learn</p>
              <ul role="list">
                {LEARN_LINKS.map(l => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="ar-footer-h">Company</p>
              <ul role="list">
                <li>
                  <a href="#about">Our principles</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
                <li>
                  <button type="button" className="ar-footer-btn" onClick={openContact}>
                    Talk to sales
                  </button>
                </li>
                <li>
                  <Link to="/" className="ar-footer-back">
                    All concepts <IconArrow size={14} sw={2} />
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="ar-footer-bottom">
          <p>Tidings is a concept product for a design portfolio. Not affiliated with WhatsApp or Meta.</p>
          <p>Photography: Unsplash</p>
        </div>
      </div>
    </footer>
  );
}
