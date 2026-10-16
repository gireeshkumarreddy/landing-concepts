import { useLayoutEffect, useRef } from 'react';
import { MotionConfig } from 'motion/react';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './emberpost.css';
import { useSiteMeta } from '../../shared/useSiteMeta.js';
import { gsap, useGSAP, MOTION_OK, prefersReducedMotion } from '../../shared/gsap.js';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import PeopleSection from './components/PeopleSection.jsx';
import Features from './components/Features.jsx';
import Workflows from './components/Workflows.jsx';
import Manifesto from './components/Manifesto.jsx';
import Waitlist from './components/Waitlist.jsx';
import Footer from './components/Footer.jsx';

export default function Emberpost() {
  useSiteMeta({
    title: 'Emberpost — email sorted by the people behind it',
    description:
      'Emberpost groups every email by the person who sent it. A concept landing page with a working sample inbox you can click through.',
    themeColor: '#ececee',
    background: '#ececee',
    site: 'emberpost',
  });

  const rootRef = useRef(null);

  // In-page anchors scroll smoothly via JS, so programmatic scrolling (tools, hash restore)
  // stays instant. The inline style is restored when the route unmounts.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    return () => {
      root.style.scrollBehavior = prev;
    };
  }, []);

  const onAnchorClick = e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href^="#"]');
    const id = a?.getAttribute('href').slice(1);
    const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    if (el.tabIndex >= -1 && el.hasAttribute('tabindex')) el.focus({ preventScroll: true });
  };

  // Section reveals. Hidden states are only ever set inside the motion-ok branch.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray('[data-reveal]').forEach(el => {
          gsap.from(el, {
            y: 32,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          });
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="ta" ref={rootRef} onClick={onAnchorClick}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1}>
          <Hero />
          <PeopleSection />
          <Features />
          <Workflows />
          <Manifesto />
          <Waitlist />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
