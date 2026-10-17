import { useState } from 'react';
import { LayoutGroup, motion } from 'motion/react';
import Avatar from './Avatar.jsx';
import { CLASSIC_ROWS, PEOPLE, PEOPLE_CARDS } from '../data.js';

const move = { type: 'spring', bounce: 0, duration: 0.75 };

const MODES = [
  { id: 'classic', label: 'Classic inbox' },
  { id: 'grouped', label: 'Emberpost' },
];

const COPY = {
  classic: 'A classic inbox sorts by arrival time, so your work with Marcus gets shuffled in among everybody else’s subject lines.',
  grouped: 'Emberpost pulls every thread from one person into a single card, so you reply to people rather than to subject lines.',
};

function Row({ row, withSender, mark }) {
  const p = PEOPLE[row.who];
  return (
    <motion.li
      layoutId={`ta-cmp-${row.id}`}
      layout="position"
      transition={move}
      className={`ta-cmp-row${mark ? ' is-mark' : ''}`}
    >
      {withSender && <Avatar id={row.who} size={28} />}
      {withSender && <span className="ta-cmp-row__who">{p.name}</span>}
      <span className="ta-cmp-row__subject">{row.subject}</span>
      <time className="ta-cmp-row__time">{row.time}</time>
    </motion.li>
  );
}

export default function PeopleSection() {
  const [mode, setMode] = useState('classic');

  return (
    <section id="people" className="ta-sec ta-people" aria-labelledby="ta-people-title" tabIndex={-1} data-bg="">
      <div className="ta-wrap">
        <div className="ta-sec__head">
          <div className="ta-sec__title">
            <p className="ta-eyebrow" data-reveal="fade">
              <span>01</span> By person
            </p>
            <h2 id="ta-people-title" className="ta-h2" data-reveal="lines">
              Sorted by who, not by when.
            </h2>
          </div>
          <div className="ta-sec__aside" data-reveal="fade" data-reveal-delay="0.12">
            <p className="ta-lead ta-people__copy" aria-live="polite">
              {COPY[mode]}
            </p>
            <div className="ta-seg" role="group" aria-label="Compare inbox layouts">
              {MODES.map(m => (
                <button
                  key={m.id}
                  type="button"
                  className={`ta-seg__btn${mode === m.id ? ' is-on' : ''}`}
                  aria-pressed={mode === m.id}
                  onClick={() => setMode(m.id)}
                >
                  {mode === m.id && <motion.span layoutId="ta-seg-hl" className="ta-seg__hl" transition={move} />}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`ta-compare is-${mode}`} data-reveal="fade">
          <LayoutGroup id="ta-compare">
            {mode === 'classic' ? (
              <div className="ta-classic">
                <div className="ta-classic__bar" aria-hidden="true">
                  <span>All mail</span>
                  <span>
                    Arrival order · <em>Marcus</em> shows up 3 times
                  </span>
                </div>
                <ol className="ta-classic__list" role="list" aria-label="Classic inbox, sorted by time">
                  {CLASSIC_ROWS.map(r => (
                    <Row key={r.id} row={r} withSender mark={r.who === 'marcus'} />
                  ))}
                </ol>
              </div>
            ) : (
              <div className="ta-pcards">
                {PEOPLE_CARDS.map((who, i) => {
                  const p = PEOPLE[who];
                  const rows = CLASSIC_ROWS.filter(r => r.who === who);
                  return (
                    <motion.article
                      key={who}
                      className="ta-pcard"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.2, 0.7, 0.2, 1] }}
                      aria-label={`${p.name}, ${rows.length} threads`}
                    >
                      <header className="ta-pcard__head">
                        <Avatar id={who} size={40} />
                        <span>
                          <strong>{p.name}</strong>
                          <small>{p.role}</small>
                        </span>
                        <span className="ta-pcard__count">{rows.length}</span>
                      </header>
                      <ol className="ta-pcard__list" role="list">
                        {rows.map(r => (
                          <Row key={r.id} row={r} />
                        ))}
                      </ol>
                    </motion.article>
                  );
                })}
                <motion.p
                  className="ta-pcards__sum"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                >
                  8 subject lines <span aria-hidden="true">→</span>
                  <span className="sr-only">become</span> 3 people.
                  <span> Same mail, much less hunting.</span>
                </motion.p>
              </div>
            )}
          </LayoutGroup>
        </div>
      </div>
    </section>
  );
}
