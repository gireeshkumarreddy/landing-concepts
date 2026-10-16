import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTidings } from '../hooks.jsx';
import { FAQS } from '../data.js';
import { IconArrow, IconPlus } from '../icons.jsx';

export default function Faq() {
  const [open, setOpen] = useState(0);
  const { openContact } = useTidings();
  return (
    <section id="faq" className="ar-section ar-faq" aria-labelledby="ar-faq-title">
      <div className="ar-wrap ar-faq-grid">
        <div className="ar-faq-intro" data-reveal>
          <p className="ar-eyebrow">Learn · FAQ</p>
          <h2 id="ar-faq-title" className="ar-h2">
            Good questions, straight answers.
          </h2>
          <p className="ar-lead">Opt-in, templates, numbers and where your data lives. Missing something? Ask the team directly.</p>
          <button type="button" className="ar-btn ar-btn-ghost" onClick={openContact}>
            Talk to sales <IconArrow size={16} sw={2} />
          </button>
        </div>
        <ul className="ar-acc" role="list" data-reveal>
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className={`ar-acc-item ${isOpen ? 'is-open' : ''}`}>
                <h3 className="ar-acc-h">
                  <button
                    type="button"
                    id={`ar-faq-q${i}`}
                    className="ar-acc-btn"
                    aria-expanded={isOpen}
                    aria-controls={`ar-faq-a${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{f.q}</span>
                    <span className="ar-acc-ico" aria-hidden="true">
                      <IconPlus size={16} sw={2.2} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`ar-faq-a${i}`}
                      role="region"
                      aria-labelledby={`ar-faq-q${i}`}
                      className="ar-acc-panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.36, ease: [0.2, 0.7, 0.2, 1] }}
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
