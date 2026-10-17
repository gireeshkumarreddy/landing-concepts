import '@fontsource-variable/inter-tight';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import './vantline.css';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { useSiteMeta } from '../../shared/useSiteMeta.js';
import { gsap, useGSAP, MOTION_OK } from '../../shared/gsap.js';
import { useMotion } from '../../shared/motion/index.js';
import Hero from './components/Hero.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Features from './components/Features.jsx';
import Approach from './components/Approach.jsx';
import Pricing from './components/Pricing.jsx';
import { CtaBand, Footer } from './components/Closing.jsx';
import SignupDrawer from './components/SignupDrawer.jsx';
import { FloatingNav, HeroNav, MobileMenu } from './components/Nav.jsx';

const PAPER = '#fbfbf8';

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

  // Shared motion: smooth scroll hooks, masked reveals, scroll fill, parallax, panel expansion,
  // magnetic CTA and page re-tints ([data-bg] on the principles interlude, closing band and footer).
  useMotion(rootRef);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('[data-au-hero-nav] > *', { y: -14, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'power3.out', delay: 0.25 });
      });
    },
    { scope: rootRef }
  );

  return (
    <MotionConfig reducedMotion="never">
      <div className="au" id="top" ref={rootRef} data-bg-base={PAPER}>
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
          <CtaBand onSignup={openSignup} />
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
