import { useState } from 'react';
import { motion } from 'motion/react';
import { WORKFLOWS } from '../data.js';
import { Plus } from '../icons.jsx';

const ease = [0.2, 0.7, 0.2, 1];

function Case({ c, i, open, onToggle }) {
  const btnId = `ta-case-btn-${c.id}`;
  const panelId = `ta-case-panel-${c.id}`;
  return (
    <motion.li layout="position" transition={{ type: 'spring', bounce: 0, duration: 0.5 }} className={`ta-case${open ? ' is-open' : ''}`}>
      <h3 className="ta-case__h">
        <button
          type="button"
          id={btnId}
          className="ta-case__btn"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          data-cursor={open ? 'Close' : 'Open'}
        >
          <span className="ta-case__n">{String(i + 1).padStart(2, '0')}</span>
          <span className="ta-case__title">
            <span>{c.title}</span>
            <small>{c.who}</small>
          </span>
          <span className="ta-case__metric">
            <span className="ta-tag">Illustrative</span>
            <span className="ta-case__fromto">
              <s>{c.metric.from}</s>
              <span aria-hidden="true">→</span>
              <span className="sr-only">to</span>
              <b>{c.metric.to}</b>
            </span>
            <small>{c.metric.label}</small>
          </span>
          <span className="ta-case__plus" aria-hidden="true">
            <Plus size={18} />
          </span>
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={btnId} hidden={!open} className="ta-case__panel">
        {open && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
            <dl className="ta-case__ba">
              <div>
                <dt>Today</dt>
                <dd>{c.before}</dd>
              </div>
              <div>
                <dt>With Emberpost</dt>
                <dd>{c.after}</dd>
              </div>
            </dl>
            <ol className="ta-case__steps" role="list">
              {c.steps.map((s, k) => (
                <motion.li
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 + k * 0.06, ease }}
                >
                  <span className="ta-case__step">{String(k + 1).padStart(2, '0')}</span>
                  <strong>{s.title}</strong>
                  <p>{s.body}</p>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        )}
      </div>
    </motion.li>
  );
}

export default function Workflows() {
  const [open, setOpen] = useState('studio');
  return (
    <section id="workflows" className="ta-sec ta-cases" aria-labelledby="ta-cases-title" tabIndex={-1}>
      <div className="ta-wrap">
        <div className="ta-sec__head">
          <div className="ta-sec__title">
            <p className="ta-eyebrow" data-reveal="fade">
              <span>03</span> Workflows
            </p>
            <h2 id="ta-cases-title" className="ta-h2" data-reveal="lines">
              How small teams use Emberpost
            </h2>
          </div>
          <div className="ta-sec__aside" data-reveal="fade" data-reveal-delay="0.12">
            <p className="ta-flag">
              <span className="ta-tag ta-tag--solid">Illustrative scenarios, not customer stories</span>
            </p>
            <p className="ta-lead">
              Three made-up teams showing how the product is meant to be used. The before-and-after figures are examples
              for illustration, not measured results.
            </p>
          </div>
        </div>

        <ol className="ta-case-list" role="list" data-reveal="stagger" data-reveal-stagger="0.1">
          {WORKFLOWS.map((c, i) => (
            <Case key={c.id} c={c} i={i} open={open === c.id} onToggle={() => setOpen(o => (o === c.id ? null : c.id))} />
          ))}
        </ol>
      </div>
    </section>
  );
}
