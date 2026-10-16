import '@fontsource-variable/figtree';
import '@fontsource-variable/geist-mono';
import './sagewell.css';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { useSiteMeta } from '../../shared/useSiteMeta.js';
import { gsap, MOTION_OK, ScrollTrigger, prefersReducedMotion, useGSAP } from '../../shared/gsap.js';
import { SagewellCtx, scrollBehavior, scrollToId } from './lib.js';
import { FloatingNav, HeroNav, MobileMenu, useScrollSpy } from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Quickstart from './components/Quickstart.jsx';
import Playground from './components/Playground.jsx';
import HowItThinks from './components/HowItThinks.jsx';
import UseCases from './components/UseCases.jsx';
import Pricing from './components/Pricing.jsx';
import Notes, { NoteReader } from './components/Notes.jsx';
import AccessModal from './components/AccessModal.jsx';
import { ClosingCta, Footer } from './components/Closing.jsx';

const SPY_IDS = ['research', 'developers', 'pricing', 'journal'];

export default function SagewellPage() {
  useSiteMeta({
    title: 'Sagewell — the model that thinks before it speaks',
    description:
      'Sagewell is a concept reasoning model that plans, checks and revises its own reasoning, and shows the trail behind every reply.',
    themeColor: '#f6f3ec',
    background: '#f6f3ec',
    site: 'sagewell',
  });

  const rootRef = useRef(null);
  const composerRef = useRef(null);
  const [accessOpen, setAccessOpen] = useState(false);
  const [noteId, setNoteId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const active = useScrollSpy(SPY_IDS);

  // Floating nav appears once the hero has scrolled away.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const hero = document.getElementById('top');
      if (hero) setPastHero(hero.getBoundingClientRect().bottom < 90);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // In-page links scroll smoothly via JS (respecting reduced motion) and move focus to the target,
  // so programmatic scrolling elsewhere stays instant and scroll-linked effects stay in sync.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    // ScrollTrigger restores the stylesheet's smooth value after each refresh; keep it instant here.
    const mo = new MutationObserver(() => {
      if (html.style.scrollBehavior !== 'auto') html.style.scrollBehavior = 'auto';
    });
    mo.observe(html, { attributes: true, attributeFilter: ['style'] });
    const onClick = e => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href^="#"]');
      if (!a || !rootRef.current?.contains(a)) return;
      const id = decodeURIComponent(a.getAttribute('href').slice(1));
      const el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    };
    document.addEventListener('click', onClick);
    return () => {
      mo.disconnect();
      html.style.scrollBehavior = prev;
      document.removeEventListener('click', onClick);
    };
  }, []);

  // Close the mobile menu if the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 821px)');
    const on = () => mq.matches && setMenuOpen(false);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const openNote = useCallback(id => setNoteId(id), []);

  const showRelease = useCallback(() => {
    const btn = document.getElementById('note-introducing');
    if (!btn) return setNoteId('introducing');
    btn.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
    btn.focus({ preventScroll: true });
    btn.classList.add('is-flash');
    setTimeout(() => btn.classList.remove('is-flash'), 1600);
    if (prefersReducedMotion() || !('onscrollend' in window)) {
      setTimeout(() => setNoteId('introducing'), prefersReducedMotion() ? 0 : 900);
      return;
    }
    let done = false;
    const open = () => {
      if (done) return;
      done = true;
      window.removeEventListener('scrollend', open);
      setTimeout(() => setNoteId('introducing'), 120);
    };
    window.addEventListener('scrollend', open, { once: true });
    setTimeout(open, 1400);
  }, []);

  const loadPrompt = useCallback(text => {
    composerRef.current?.load(text);
    scrollToId('top');
  }, []);

  const ctx = useMemo(
    () => ({ openAccess: () => setAccessOpen(true), openNote, showRelease, loadPrompt }),
    [openNote, showRelease, loadPrompt]
  );

  // Generic scroll reveals for headings and blocks marked data-cr-reveal.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray('[data-cr-reveal]');
        gsap.set(items, { opacity: 0, y: 22 });
        const batch = ScrollTrigger.batch(items, {
          start: 'top 90%',
          once: true,
          onEnter: els =>
            gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, overwrite: true }),
        });
        return () => batch.forEach(t => t.kill());
      });
      // Image boxes are sized up front, so only the web font swap can move trigger positions.
      let alive = true;
      document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());
      return () => {
        alive = false;
      };
    },
    { scope: rootRef }
  );

  return (
    <SagewellCtx.Provider value={ctx}>
      <MotionConfig reducedMotion="never">
        <div className="cr" ref={rootRef}>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <HeroNav menuOpen={menuOpen} onMenu={() => setMenuOpen(true)} />
          <FloatingNav visible={pastHero && !menuOpen} active={active} menuOpen={menuOpen} onMenu={() => setMenuOpen(true)} />
          <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

          <main id="main" tabIndex={-1}>
            <Hero composerRef={composerRef} />
            <Quickstart />
            <Playground />
            <HowItThinks />
            <UseCases />
            <Pricing />
            <Notes />
            <ClosingCta />
          </main>
          <Footer />

          <AccessModal open={accessOpen} onClose={() => setAccessOpen(false)} />
          <NoteReader
            id={noteId}
            onClose={() => setNoteId(null)}
            onNavigate={id => {
              setNoteId(id);
              document.querySelector('.cr-reader')?.scrollTo({ top: 0 });
            }}
          />
        </div>
      </MotionConfig>
    </SagewellCtx.Provider>
  );
}
