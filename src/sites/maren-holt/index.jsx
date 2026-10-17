import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/newsreader';
import '@fontsource-variable/newsreader/wght-italic.css';
import './ch.css';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { useSiteMeta } from '../../shared/useSiteMeta.js';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../shared/gsap.js';
import { useMotion, scrollToTarget } from '../../shared/motion/index.js';
import { NAV } from './data.js';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Articles from './components/Articles.jsx';
import Services from './components/Services.jsx';
import Anatomy from './components/Anatomy.jsx';
import Workshops from './components/Workshops.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Reader from './components/Reader.jsx';
import SearchPalette from './components/SearchPalette.jsx';
import SignInModal from './components/SignInModal.jsx';

const isTyping = el => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

export default function MarenHolt() {
  useSiteMeta({
    title: 'Maren Holt — developmental editor and Sunday notes (concept)',
    description:
      'Concept site for Maren Holt, a fictional developmental editor: keycap headline, sample essays with a reader and search, services, workshops and contact.',
    themeColor: '#e9e9e9',
    background: '#e9e9e9',
    site: 'maren-holt',
  });

  const root = useRef(null);
  const [reader, setReader] = useState(null);
  const [search, setSearch] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const [active, setActive] = useState(null);
  const [topic, setTopic] = useState('Manuscript assessment');

  const anyModal = !!reader || search || signIn;

  /* Shared scroll motion: reveals, fill, parallax, magnetic CTAs, page re-tints. */
  useMotion(root);

  /* Eased in-page navigation (shared smooth scroll) that can also move focus to a field. */
  const goTo = useCallback((id, focusSelector) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = prefersReducedMotion();
    // Give a closing menu/dialog a frame to release its scroll lock first.
    requestAnimationFrame(() => {
      scrollToTarget(el);
      if (focusSelector) {
        setTimeout(() => document.querySelector(focusSelector)?.focus({ preventScroll: true }), reduce ? 0 : 900);
      }
    });
  }, []);

  /* "/" or Ctrl/Cmd+K opens search. */
  useEffect(() => {
    const onKey = e => {
      if (anyModal) return;
      const k = e.key.toLowerCase();
      if ((k === '/' && !isTyping(document.activeElement)) || (k === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [anyModal]);

  /* Active nav section. */
  useEffect(() => {
    const ids = NAV.map(n => n.id);
    const seen = new Map();
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => seen.set(e.target.id, e.isIntersecting));
        setActive(ids.find(id => seen.get(id)) || null);
      },
      { rootMargin: '-42% 0px -52% 0px' }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  /* Keyboard safety net: elements still waiting for their scroll reveal are visibility:hidden and
     would be skipped by Tab. The first Tab press finishes every pending reveal instantly. */
  useEffect(() => {
    const onKey = e => {
      if (e.key !== 'Tab' || !root.current) return;
      window.removeEventListener('keydown', onKey, true);
      root.current.querySelectorAll('[data-reveal="fade"], [data-reveal="stagger"] > *').forEach(el =>
        gsap.getTweensOf(el).forEach(t => {
          const st = t.scrollTrigger;
          t.progress(1);
          st?.kill(false, true); // keep the (now finished) animation
        })
      );
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);

  /* Filters, accordions and lazy images change the page height; keep scroll triggers measured. */
  useEffect(() => {
    let t = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 180);
    });
    ro.observe(root.current);
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, []);

  const openArticle = useCallback(slug => {
    setSearch(false);
    setReader(slug);
  }, []);

  const startConversation = useCallback(
    title => {
      setTopic(title);
      goTo('contact', '#ch-contact-name');
    },
    [goTo]
  );

  const toNewsletter = useCallback(() => goTo('top', '#ch-newsletter-email'), [goTo]);

  // Every Motion animation below picks its own reduced-motion variant (via useReduced),
  // so Motion is told not to second-guess them.
  return (
    <MotionConfig reducedMotion="never">
      <div className="ch" ref={root}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="ch-frame" id="top">
          <span className="ch-guide ch-guide--l" aria-hidden="true" />
          <span className="ch-guide ch-guide--r" aria-hidden="true" />
          <Nav active={active} onSearch={() => setSearch(true)} onSignIn={() => setSignIn(true)} goTo={goTo} />
          <main id="main" tabIndex={-1}>
            <Hero onOpen={openArticle} />
            <Articles onOpen={openArticle} onSearch={() => setSearch(true)} />
            <Services onStart={startConversation} />
            <Anatomy />
            <Workshops />
            <About onNewsletter={toNewsletter} />
            <Contact topic={topic} setTopic={setTopic} />
          </main>
          <Footer onSearch={() => setSearch(true)} />
        </div>

        <AnimatePresence>{search && <SearchPalette key="search" onClose={() => setSearch(false)} onPick={openArticle} />}</AnimatePresence>
        <AnimatePresence>{signIn && <SignInModal key="signin" onClose={() => setSignIn(false)} />}</AnimatePresence>
        <AnimatePresence>{reader && <Reader key="reader" slug={reader} onClose={() => setReader(null)} onGo={setReader} />}</AnimatePresence>
      </div>
    </MotionConfig>
  );
}
