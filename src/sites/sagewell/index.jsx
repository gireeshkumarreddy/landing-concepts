import '@fontsource-variable/figtree';
import '@fontsource-variable/geist-mono';
import './sagewell.css';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { useSiteMeta } from '../../shared/useSiteMeta.js';
import { prefersReducedMotion } from '../../shared/gsap.js';
import { scrollToTarget, useMotion } from '../../shared/motion/index.js';
import { SagewellCtx, scrollToId } from './lib.js';
import { FloatingNav, HeroNav, MobileMenu, useScrollSpy } from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Quickstart from './components/Quickstart.jsx';
import Playground from './components/Playground.jsx';
import Statement from './components/Statement.jsx';
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
    const reduced = prefersReducedMotion();
    scrollToTarget(btn, { offset: -(window.innerHeight / 2 - btn.offsetHeight / 2), duration: 1.2 });
    btn.classList.add('is-flash');
    setTimeout(() => btn.classList.remove('is-flash'), 1800);
    // Open after the glide has settled (the reader pauses page scrolling while it is open). Focus the row
    // first, once its reveal has started, so closing the reader returns focus to it.
    setTimeout(
      () => {
        btn.focus({ preventScroll: true });
        setNoteId('introducing');
      },
      reduced ? 0 : 1300
    );
  }, []);

  const loadPrompt = useCallback(text => {
    composerRef.current?.load(text);
    scrollToId('top');
  }, []);

  const ctx = useMemo(
    () => ({ openAccess: () => setAccessOpen(true), openNote, showRelease, loadPrompt }),
    [openNote, showRelease, loadPrompt]
  );

  // Shared scroll motion: masked reveals, word fill, parallax, expand, magnetic CTAs and page tints.
  useMotion(rootRef);

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
            <Statement />
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
