import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import '@fontsource-variable/archivo';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/caveat';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/newsreader';
import { useSiteMeta } from '../../shared/useSiteMeta.js';
import { gsap, MOTION_OK, REDUCED, ScrollTrigger, useGSAP } from '../../shared/gsap.js';
import { useMedia } from './hooks.js';
import { PROJECTS } from './data.js';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Work from './components/Work.jsx';
import Process from './components/Process.jsx';
import Services from './components/Services.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import CaseModal from './components/CaseModal.jsx';
import './portfolio.css';

export default function Page() {
  useSiteMeta({
    title: 'Ines Morrow — Film editor, Copenhagen (concept)',
    description:
      'Portfolio concept for Ines Morrow, a fictional film and commercial editor in Copenhagen. Scrub the reel timeline, compare grades and start a project.',
    themeColor: '#0e0e0d',
    background: '#0e0e0d',
    colorScheme: 'dark',
    site: 'creative-portfolio',
  });

  const root = useRef(null);
  const reduced = useMedia(REDUCED);
  const [openId, setOpenId] = useState(null);
  const [prefill, setPrefill] = useState({ type: '', key: 0 });

  const openProject = useCallback(id => setOpenId(id), []);
  const closeProject = useCallback(() => setOpenId(null), []);
  const stepProject = useCallback(dir => {
    setOpenId(cur => {
      const i = PROJECTS.findIndex(p => p.id === cur);
      return PROJECTS[(i + dir + PROJECTS.length) % PROJECTS.length].id;
    });
  }, []);
  const enquire = useCallback(type => setPrefill(p => ({ type, key: p.key + 1 })), []);

  // In-page links scroll smoothly via JS, so the document itself can use instant scrolling.
  // That keeps programmatic scrolls (and ScrollTrigger) exact; restored when leaving the page.
  useLayoutEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, []);

  useEffect(() => {
    const node = root.current;
    const onClick = e => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href^="#"]');
      if (!a || !node?.contains(a)) return;
      const id = decodeURIComponent(a.getAttribute('href').slice(1));
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      history.replaceState?.(null, '', `#${id}`);
    };
    // Listen on document so React handlers (which may preventDefault) run first.
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useGSAP(
    () => {
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('.pf-nav-in > *', { y: -8, autoAlpha: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out' });

        const items = gsap.utils.toArray('.pf-reveal');
        // opacity (not autoAlpha) so hidden items stay focusable; focusing one scrolls it in and reveals it.
        gsap.set(items, { opacity: 0, y: 22 });
        ScrollTrigger.batch(items, {
          start: 'top 90%',
          once: true,
          onEnter: batch =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, overwrite: true }),
        });

        // Images settle slightly as they scroll in: a slow push-in, like the end of a dolly move.
        gsap.utils.toArray('.pf-card-media img, .pf-about-frame img').forEach(img => {
          gsap.fromTo(
            img,
            { '--pf-push': 1.08 },
            {
              '--pf-push': 1,
              ease: 'none',
              scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'center center', scrub: 0.6 },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    // Reduced motion: skip Motion animations outright (and keep its dev warning quiet).
    <MotionConfig reducedMotion="never" skipAnimations={reduced}>
      <div className="pf" ref={root}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1}>
          <Hero onOpenProject={openProject} />
          <Work onOpen={openProject} />
          <Process />
          <Services onEnquire={enquire} />
          <About />
          <Contact prefillType={prefill.type} prefillKey={prefill.key} />
        </main>
        <Footer />
        <AnimatePresence>
          {openId && <CaseModal key="case" id={openId} onClose={closeProject} onStep={stepProject} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
