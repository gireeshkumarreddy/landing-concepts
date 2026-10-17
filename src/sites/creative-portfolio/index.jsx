import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import '@fontsource-variable/archivo';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/caveat';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/newsreader';
import { useSiteMeta } from '../../shared/useSiteMeta.js';
import { REDUCED } from '../../shared/gsap.js';
import { useMotion } from '../../shared/motion/index.js';
import { useMedia } from './hooks.js';
import { PROJECTS } from './data.js';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Work from './components/Work.jsx';
import Statement from './components/Statement.jsx';
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
    themeColor: '#ffffff',
    background: '#ffffff',
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

  // Shared motion system: smooth scroll is global; this wires reveals, fills, parallax,
  // page re-tints, magnetic CTAs and velocity skew for everything marked up below.
  useMotion(root);

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
          <Statement />
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
