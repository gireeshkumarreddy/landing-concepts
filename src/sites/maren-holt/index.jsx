import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/newsreader';
import '@fontsource-variable/newsreader/wght-italic.css';
import './ch.css';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { useSiteMeta } from '../../shared/useSiteMeta.js';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, prefersReducedMotion } from '../../shared/gsap.js';
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
    themeColor: '#e7e2d8',
    background: '#e7e2d8',
    site: 'maren-holt',
  });

  const root = useRef(null);
  const [reader, setReader] = useState(null);
  const [search, setSearch] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const [active, setActive] = useState(null);
  const [topic, setTopic] = useState('Manuscript assessment');

  const anyModal = !!reader || search || signIn;

  /* Smooth in-page navigation that can also move focus to a field. */
  const goTo = useCallback((id, focusSelector) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = prefersReducedMotion();
    // Give a closing menu/dialog a frame to release the scroll lock first.
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      if (focusSelector) {
        setTimeout(() => document.querySelector(focusSelector)?.focus({ preventScroll: true }), reduce ? 0 : 650);
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

  /* Section reveals (motion-ok only).
     Content is visible by default. A block is only hidden-then-revealed when the reader is actively
     scrolling (wheel/touch/keys) and the block is still below the fold, so programmatic jumps,
     full-page captures and no-JS states never show empty sections. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, ctx => {
        const blocks = [
          ...gsap.utils.toArray('[data-reveal]', root.current),
          ...gsap.utils.toArray('[data-reveal-stagger]', root.current),
        ];
        const isGroup = el => el.hasAttribute('data-reveal-stagger');
        const targets = el => (isGroup(el) ? [...el.children] : el);
        let engaged = false;
        const engage = () => (engaged = true);
        const evs = ['wheel', 'touchmove', 'keydown', 'pointerdown'];
        evs.forEach(ev => window.addEventListener(ev, engage, { passive: true }));

        const show = new IntersectionObserver(
          entries =>
            entries.forEach(e => {
              if (!e.isIntersecting) return;
              show.unobserve(e.target);
              ctx.add(() =>
                gsap.to(targets(e.target), {
                  y: 0,
                  opacity: 1,
                  duration: 0.9,
                  stagger: isGroup(e.target) ? +e.target.dataset.revealStagger || 0.07 : 0,
                  ease: 'power3.out',
                  overwrite: 'auto',
                })
              );
            }),
          { rootMargin: '0px 0px -8% 0px' }
        );
        const arm = new IntersectionObserver(
          entries =>
            entries.forEach(e => {
              if (!e.isIntersecting || !engaged) return;
              if (e.boundingClientRect.top < window.innerHeight) return; // already on screen: leave it visible
              arm.unobserve(e.target);
              // data-reveal-y="0" fades without movement (used for inline words, where transforms don't apply).
              const y = e.target.dataset.revealY !== undefined ? +e.target.dataset.revealY : isGroup(e.target) ? 30 : 26;
              // Opacity only (never visibility), so armed blocks stay focusable and in the tab order.
              ctx.add(() => gsap.set(targets(e.target), { y, opacity: 0 }));
              show.observe(e.target);
            }),
          { rootMargin: '0px 0px 60% 0px' }
        );
        blocks.forEach(el => arm.observe(el));

        // Keep scroll-linked effects (About statement) in sync with late layout changes.
        let t = 0;
        const ro = new ResizeObserver(() => {
          clearTimeout(t);
          t = setTimeout(() => ScrollTrigger.refresh(), 200);
        });
        ro.observe(root.current);
        return () => {
          evs.forEach(ev => window.removeEventListener(ev, engage));
          arm.disconnect();
          show.disconnect();
          ro.disconnect();
          clearTimeout(t);
        };
      });
    },
    { scope: root }
  );

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
