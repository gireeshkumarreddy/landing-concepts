import '@fontsource-variable/inter-tight';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import './vantline.css';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { useSiteMeta } from '../../shared/useSiteMeta.js';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../../shared/gsap.js';
import Hero from './components/Hero.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Features from './components/Features.jsx';
import Approach from './components/Approach.jsx';
import Pricing from './components/Pricing.jsx';
import { CtaBand, Footer } from './components/Closing.jsx';
import SignupDrawer from './components/SignupDrawer.jsx';
import { FloatingNav, HeroNav, MobileMenu } from './components/Nav.jsx';

const PAPER = '#faf7f1';
const TEAL = '#0f3d3b';

export default function Page() {
  useSiteMeta({
    title: 'Vantline — Know what changed',
    description: 'Vantline is a decision-intelligence copilot that explains what changed in your numbers and what to do next. A design concept.',
    themeColor: PAPER,
    background: PAPER,
    site: 'vantline',
  });

  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const ctaRef = useRef(null);
  const [drawer, setDrawer] = useState(false);
  const [plan, setPlan] = useState('team');
  const [billing, setBilling] = useState('monthly');
  const [menu, setMenu] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  const openSignup = useCallback(() => setDrawer(true), []);
  const choose = useCallback(id => {
    setPlan(id);
    setDrawer(true);
  }, []);
  const closeDrawer = useCallback(() => setDrawer(false), []);
  const closeMenu = useCallback(() => setMenu(false), []);
  const toggleMenu = useCallback(() => setMenu(m => !m), []);

  // Compact nav appears once the hero has scrolled away.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { rootMargin: '-90px 0px 0px 0px' });
    io.observe(heroRef.current);
    return () => io.disconnect();
  }, []);

  // Close the mobile menu if the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => mq.matches && setMenu(false);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('[data-au-hero-nav] > *', { y: -14, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'power3.out', delay: 0.25 });

        // Generic heading reveals.
        const els = gsap.utils.toArray('[data-au-reveal]');
        gsap.set(els, { opacity: 0, y: 26 });
        ScrollTrigger.batch(els, {
          start: 'top 90%',
          once: true,
          onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out', overwrite: true }),
        });

        // Page background scrubs from ivory to deep teal as the closing band arrives; the band's
        // copy fades in on the same scrub so it only appears once the ground is dark.
        const band = ctaRef.current;
        gsap.set(band, { backgroundColor: 'transparent' });
        gsap
          .timeline({ scrollTrigger: { trigger: band, start: 'top 98%', end: 'top 38%', scrub: 0.4 } })
          .fromTo(rootRef.current, { backgroundColor: PAPER }, { backgroundColor: TEAL, ease: 'none', duration: 1 }, 0)
          .fromTo(
            band.querySelectorAll('[data-au-cta]'),
            { opacity: 0, y: 48 },
            { opacity: 1, y: 0, ease: 'power2.out', duration: 0.45, stagger: 0.08 },
            0.4
          );
      });
    },
    { scope: rootRef }
  );

  return (
    <MotionConfig reducedMotion="never">
      <div className="au" id="top" ref={rootRef}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <FloatingNav visible={pastHero && !menu} onSignup={openSignup} onMenu={toggleMenu} menuOpen={menu} />
        <MobileMenu open={menu} onClose={closeMenu} onSignup={openSignup} />

        <HeroNav onSignup={openSignup} onMenu={toggleMenu} menuOpen={menu} />
        <main id="main" tabIndex={-1}>
          <Hero ref={heroRef} onSignup={openSignup} />
          <HowItWorks />
          <Features />
          <Approach />
          <Pricing billing={billing} onBilling={setBilling} onChoose={choose} />
          <CtaBand ref={ctaRef} onSignup={openSignup} />
        </main>
        <Footer onSignup={openSignup} onChoose={choose} />

        <SignupDrawer
          open={drawer}
          onClose={closeDrawer}
          plan={plan}
          onPlan={setPlan}
          billing={billing}
          onBilling={setBilling}
        />
      </div>
    </MotionConfig>
  );
}
