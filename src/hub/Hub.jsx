import { useRef } from 'react';
import { Link } from 'react-router-dom';
import '@fontsource-variable/inter-tight';
import '@fontsource/instrument-serif/400-italic.css';
import { SITES } from '../sites.js';
import { useSiteMeta } from '../shared/useSiteMeta.js';
import { useMotion } from '../shared/motion/index.js';
import './hub.css';

const STACK = ['React 19', 'Vite', 'GSAP + ScrollTrigger', 'Lenis smooth scroll', 'Motion', 'Per-site type systems'];

export default function Hub() {
  const root = useRef(null);
  useSiteMeta({
    title: 'Six Landing Pages — Interactive concept studies',
    description: 'Six independent, interactive landing page concepts: AI, analytics, messaging, email, a creative portfolio and an editorial brand.',
    themeColor: '#f3f2ee',
    background: '#f3f2ee',
    site: 'hub',
  });

  useMotion(root);

  return (
    <div className="hub" ref={root}>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="hub-top">
        <span className="hub-mark">Concept Studio</span>
        <span className="hub-meta">Vol. 01 — 2026</span>
      </header>

      <main id="main">
        <section className="hub-intro" aria-labelledby="hub-title">
          <p className="hub-eyebrow" data-reveal="fade">Six independent landing pages</p>
          <h1 id="hub-title" data-reveal="lines">
            Six products, six design systems, <em>one standard.</em>
          </h1>
          <p className="hub-lede" data-reveal="fade" data-reveal-delay="0.25">
            Interactive concept studies built from six reference designs — each with its own typography, palette,
            motion language and a working product demo. Pick one to open it.
          </p>
        </section>

        <section className="hub-statement" data-bg="#161615" aria-label="Approach">
          <p data-fill>
            Six studies in motion, colour and craft — each one built to feel calm, quick and considered as you scroll
            through it.
          </p>
        </section>
        <ol className="hub-grid" role="list" data-reveal="stagger" data-reveal-stagger="0.1">
          {SITES.map((s, i) => (
            <li key={s.slug} className="hub-card">
              <Link to={`/${s.slug}`} className="hub-link" aria-label={`${s.name} — ${s.kind}`} data-cursor="View site">
                <div className="hub-thumb">
                  <img
                    src={`${import.meta.env.BASE_URL}hub/${s.slug}.jpg`}
                    alt=""
                    width="1440"
                    height="900"
                    loading={i < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    onError={e => (e.currentTarget.style.visibility = 'hidden')}
                  />
                </div>
                <div className="hub-info">
                  <span className="hub-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="hub-text">
                    <h2>{s.name}</h2>
                    <p className="hub-kind">{s.kind}</p>
                    <p className="hub-blurb">{s.blurb}</p>
                  </div>
                  <span className="hub-route">/{s.slug}</span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </main>

      <footer className="hub-foot">
        <ul role="list" className="hub-stack">
          {STACK.map(t => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p>
          Concept work for a design portfolio. Brand names are typographic only; products, people and data shown are
          samples unless stated. Photography: Unsplash.
        </p>
      </footer>
    </div>
  );
}
