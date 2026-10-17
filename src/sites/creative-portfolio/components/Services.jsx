import { useState } from 'react';
import { SERVICES } from '../data.js';
import { goToContact } from '../utils.js';
import { IconArrowRight, IconPlus } from '../icons.jsx';

export default function Services({ onEnquire }) {
  const [open, setOpen] = useState('campaign');

  return (
    <section id="services" className="pf-sec pf-services" aria-labelledby="pf-svc-title">
      <div className="pf-wrap pf-svc-grid">
        <div className="pf-svc-intro">
          <p className="pf-eyebrow" data-reveal="fade">
            <span className="pf-eyebrow-n">03</span> Services
          </p>
          <h2 id="pf-svc-title" className="pf-h2" data-reveal="lines">
            Ways we can <span className="pf-h2-soft">work together.</span>
          </h2>
          <p className="pf-lede" data-reveal="fade">
            Laid out like an EDL, because old habits stick. The rates are examples for this concept; a real project
            gets a written quote after a short call.
          </p>
        </div>

        <div className="pf-edl">
          <div className="pf-edl-head" aria-hidden="true">
            <span>#</span>
            <span>Service</span>
            <span>Turnaround</span>
            <span>From</span>
            <span />
          </div>
          <ul role="list" className="pf-edl-list">
            {SERVICES.map((s, i) => {
              const isOpen = open === s.id;
              return (
                <li key={s.id} className={`pf-edl-row${isOpen ? ' is-open' : ''}`}>
                  <h3 className="pf-edl-h">
                    <button
                      type="button"
                      id={`pf-svc-btn-${s.id}`}
                      className="pf-edl-btn"
                      data-cursor={isOpen ? 'Close' : 'Open'}
                      aria-expanded={isOpen}
                      aria-controls={`pf-svc-${s.id}`}
                      onClick={() => setOpen(isOpen ? null : s.id)}
                    >
                      <span className="pf-edl-n">{String(i + 1).padStart(3, '0')}</span>
                      <span className="pf-edl-name">{s.name}</span>
                      <span className="pf-edl-turn">
                        <span className="sr-only">Turnaround </span>
                        {s.turnaround}
                      </span>
                      <span className="pf-edl-from">
                        <span className="sr-only">from </span>
                        {s.from}
                      </span>
                      <span className="pf-edl-icon" aria-hidden="true">
                        <IconPlus size={14} />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`pf-svc-${s.id}`}
                    role="region"
                    aria-labelledby={`pf-svc-btn-${s.id}`}
                    className="pf-edl-panel"
                    inert={!isOpen}
                  >
                    <div className="pf-edl-inner">
                      <div className="pf-edl-content">
                        <p className="pf-edl-body">{s.body}</p>
                        <div className="pf-edl-cols">
                          <div>
                            <h4>Deliverables</h4>
                            <ul role="list">
                              {s.deliverables.map(d => (
                                <li key={d}>{d}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4>Typical range</h4>
                            <p className="pf-edl-range">{s.range}</p>
                            <h4>Turnaround</h4>
                            <p className="pf-edl-range">{s.turnaround}</p>
                          </div>
                        </div>
                        <a
                          href="#contact"
                          className="pf-link-btn"
                          onClick={e => {
                            onEnquire(s.type);
                            goToContact(e);
                          }}
                        >
                          Enquire about {s.name.toLowerCase()} <IconArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
