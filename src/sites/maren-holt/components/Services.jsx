import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useReduced } from '../lib.jsx';
import { SERVICES } from '../data.js';
import { ArrowRight, CheckIcon, PencilIcon, PlusIcon } from '../icons.jsx';

function ServiceRow({ s, i, open, onToggle, onStart, reduce }) {
  const btnId = `ch-svc-btn-${s.id}`;
  const panelId = `ch-svc-panel-${s.id}`;
  return (
    <motion.li layout={reduce ? false : 'position'} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }} className={`ch-svc ${open ? 'is-open' : ''}`}>
      <h3 className="ch-svc__h">
        <button type="button" id={btnId} className="ch-svc__btn" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
          <span className="ch-svc__num">0{i + 1}</span>
          <span className="ch-svc__titles">
            <span className="ch-svc__title">{s.title}</span>
            <span className="ch-svc__line">{s.line}</span>
          </span>
          <span className="ch-svc__icon" aria-hidden="true">
            <PlusIcon size={18} />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={btnId}
            className="ch-svc__panel"
            initial={{ opacity: 0, y: reduce ? 0 : -8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.05, ease: [0.2, 0.7, 0.2, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          >
            <div className="ch-svc__col">
              <p className="ch-kicker">What’s included</p>
              <ul role="list" className="ch-checks">
                {s.includes.map(x => (
                  <li key={x}>
                    <CheckIcon size={16} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="ch-svc__col ch-svc__col--aside">
              <p className="ch-kicker">Suits</p>
              <p className="ch-svc__best">{s.bestFor}</p>
            </div>
            <div className="ch-svc__cta">
              <button type="button" className="ch-btn ch-btn--dark" onClick={() => onStart(s.title)}>
                Ask about this <ArrowRight size={16} />
              </button>
              <span className="ch-note">Jumps to the contact form with this service chosen.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function Services({ onStart }) {
  const [open, setOpen] = useState(SERVICES[0].id);
  const reduce = useReduced();
  return (
    <section className="ch-section ch-authors" id="services" aria-labelledby="ch-authors-title">
      <div className="ch-wrap ch-authors__grid">
        <header className="ch-authors__intro">
          <p className="ch-label" data-reveal="fade">
            <PencilIcon size={15} /> Services
          </p>
          <h2 className="ch-h2" id="ch-authors-title" data-reveal="lines">
            Editing that starts with the whole book.
          </h2>
          <p className="ch-lede" data-reveal="fade" data-reveal-delay="0.15">
            I work on the big questions first — premise, structure, pace — so the sentence-level polish lands on pages that will stay.
          </p>
          <p className="ch-note" data-reveal="fade" data-reveal-delay="0.25">
            Services describe a fictional practice and are sample content.
          </p>
        </header>
        <ul role="list" className="ch-services" data-reveal="stagger" data-reveal-stagger="0.1">
          {SERVICES.map((s, i) => (
            <ServiceRow
              key={s.id}
              s={s}
              i={i}
              reduce={reduce}
              open={open === s.id}
              onToggle={() => setOpen(o => (o === s.id ? null : s.id))}
              onStart={onStart}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
