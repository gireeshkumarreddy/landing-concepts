import { useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { ARTICLES, CATEGORIES, PHOTOS } from '../data.js';
import { photoSet, photoSrc, useReduced } from '../lib.jsx';
import { ArrowUpRight, PapersIcon, SearchIcon } from '../icons.jsx';
import EssayArc from './EssayArc.jsx';

// Reveal stagger by grid position: the lead card shares row one with one card, then rows of three.
const revealDelay = i => (i === 0 ? 0 : i === 1 ? 0.12 : ((i - 2) % 3) * 0.1);

function ArticleCard({ a, lead, onOpen, i }) {
  const ratio = lead ? 9 / 16 : 3 / 4;
  return (
    <article className={`ch-acard ${lead ? 'is-lead' : 'ch-acard--wide'}`} data-cursor="Read" data-reveal="fade" data-reveal-delay={revealDelay(i)}>
      <div className="ch-acard__media">
        <span className="ch-zoom">
        <img
          data-parallax="0.1"
          src={photoSrc(a.photo, lead ? 1200 : 720, ratio)}
          srcSet={photoSet(a.photo, lead ? [640, 960, 1400] : [420, 720, 960], ratio)}
          sizes={lead ? '(max-width: 760px) 92vw, 640px' : '(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 310px'}
          width={lead ? 1200 : 720}
          height={Math.round((lead ? 1200 : 720) * ratio)}
          alt={PHOTOS[a.photo].alt}
          loading="lazy"
          decoding="async"
        />
        </span>
      </div>
      <div className="ch-acard__body">
        <p className="ch-meta">
          <span>{a.category}</span>
          <span aria-hidden="true">·</span>
          <span>{a.minutes} min read</span>
        </p>
        <h3 className="ch-acard__title">
          <button type="button" className="ch-stretch" onClick={() => onOpen(a.slug)}>
            <span className="ch-uline">{a.title}</span>
          </button>
        </h3>
        <p className="ch-acard__dek">{a.dek}</p>
        <span className="ch-acard__go" aria-hidden="true">
          Read <ArrowUpRight size={14} />
        </span>
      </div>
    </article>
  );
}

export default function Articles({ onOpen, onSearch }) {
  const [cat, setCat] = useState('All');
  const reduce = useReduced();
  const list = useMemo(() => (cat === 'All' ? ARTICLES : ARTICLES.filter(a => a.category === cat)), [cat]);
  const count = c => (c === 'All' ? ARTICLES.length : ARTICLES.filter(a => a.category === c).length);
  const t = reduce ? { duration: 0 } : { duration: 0.45, ease: [0.2, 0.7, 0.2, 1] };

  return (
    <section className="ch-section ch-articles" id="essays" aria-labelledby="ch-articles-title">
      <EssayArc onOpen={onOpen} />
      <div className="ch-wrap">
        <header className="ch-shead ch-shead--split" id="essays-list">
          <div>
            <p className="ch-label" data-reveal="fade">
              <PapersIcon size={15} /> Essays
            </p>
            <h3 className="ch-h2" id="ch-essays-list-title" data-reveal="lines">
              Notes on turning a draft into a book.
            </h3>
          </div>
          <div className="ch-shead__aside" data-reveal="fade" data-reveal-delay="0.15">
            <p className="ch-lede">
              Practical pieces on structure, revision, publishing and the writing life. Every essay here is sample writing for this concept.
            </p>
            <button type="button" className="ch-searchhint" onClick={onSearch}>
              <SearchIcon size={16} />
              Search essays
              <kbd>/</kbd>
            </button>
          </div>
        </header>

        <LayoutGroup id="ch-filters">
          <div className="ch-chips" role="group" aria-label="Filter essays by theme" data-reveal="fade" data-reveal-delay="0.1">
            {CATEGORIES.map(c => {
              const on = c === cat;
              return (
                <button key={c} type="button" className={`ch-chip ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => setCat(c)}>
                  {on && <motion.span layoutId="ch-chip-bg" className="ch-chip__bg" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }} />}
                  <span className="ch-chip__label">{c}</span>
                  <span className="ch-chip__count">{count(c)}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
        <p className="sr-only" aria-live="polite">
          {cat === 'All' ? `Showing all ${list.length} essays` : `Showing ${list.length} essays in ${cat}`}
        </p>

        <div className="ch-agrid">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((a, i) => (
              <motion.div
                key={a.slug}
                layout={reduce ? false : 'position'}
                className={`ch-agrid__cell ${i === 0 ? 'is-lead' : ''} ${i > 0 && i === list.length - 1 && (list.length - 1) % 2 === 1 ? 'is-tail' : ''}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={t}
              >
                <ArticleCard a={a} i={i} lead={i === 0} onOpen={onOpen} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
