import { useRef } from 'react';
import { MotionConfig } from 'motion/react';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './emberpost.css';
import { useSiteMeta } from '../../shared/useSiteMeta.js';
import { useMotion } from '../../shared/motion/index.js';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import PeopleSection from './components/PeopleSection.jsx';
import Features from './components/Features.jsx';
import Workflows from './components/Workflows.jsx';
import PeopleWall from './components/PeopleWall.jsx';
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

  // Shared motion system: smooth-scroll aware reveals, the scroll-filled manifesto, page-colour
  // interludes, magnetic CTAs and parallax. Everything is skipped under reduced motion.
  useMotion(rootRef);

  return (
    <MotionConfig reducedMotion="user">
      <div className="ta" ref={rootRef}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1}>
          <Hero />
          <PeopleSection />
          <Features />
          <PeopleWall />
          <Workflows />
          <Manifesto />
          <Waitlist />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
