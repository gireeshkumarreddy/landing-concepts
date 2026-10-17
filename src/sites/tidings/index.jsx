import '@fontsource-variable/outfit';
import './tidings.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSiteMeta } from '../../shared/useSiteMeta.js';
import { ScrollTrigger } from '../../shared/gsap.js';
import { useMotion } from '../../shared/motion/index.js';
import { TidingsCtx } from './hooks.jsx';
import { IconCheck } from './icons.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Products from './components/Products.jsx';
import Builder from './components/Builder.jsx';
import Analytics from './components/Analytics.jsx';
import How from './components/How.jsx';
import Pricing from './components/Pricing.jsx';
import Faq from './components/Faq.jsx';
import About from './components/About.jsx';
import Footer, { FinalCta } from './components/Footer.jsx';
import Wizard from './components/Wizard.jsx';
import { ContactDialog, LoginDialog } from './components/Dialogs.jsx';

function Toast({ toast }) {
  return (
    <div className="ar-toast-region" role="status" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className="ar-toast"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <span className="ar-toast-ico">
              <IconCheck size={14} sw={2.6} />
            </span>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Page() {
  useSiteMeta({
    title: 'Tidings — WhatsApp campaigns customers actually want to open',
    description:
      'Tidings is a concept WhatsApp commerce platform: personalised broadcasts, product messages, payments in the chat and automated journeys, with a live campaign builder.',
    themeColor: '#ffffff',
    background: '#ffffff',
    site: 'tidings',
  });

  const root = useRef(null);
  const [region, setRegion] = useState('UK');
  const [wizard, setWizard] = useState({ open: false, plan: 'growth' });
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  const showToast = useCallback(msg => {
    clearTimeout(toastTimer.current);
    setToast({ msg, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 3800);
  }, []);

  const ctx = useMemo(
    () => ({
      region,
      setRegion,
      openWizard: (plan = 'growth') => setWizard({ open: true, plan }),
      openLogin: () => setDialog('login'),
      openContact: () => setDialog('contact'),
      toast: showToast,
    }),
    [region, showToast]
  );

  // Shared motion system: masked reveals, fills, page re-tints, magnetic CTAs, parallax.
  useMotion(root);

  // Accordions, tabs and the builder change page height; keep scroll triggers measured.
  useEffect(() => {
    let t;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(root.current);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, []);

  return (
    <TidingsCtx.Provider value={ctx}>
      <div className="ar" ref={root} data-bg-base="#ffffff">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1}>
          <Hero />
          <Products />
          <Builder />
          <Analytics />
          <How />
          <Pricing />
          <Faq />
          <About />
          <FinalCta />
        </main>
        <Footer />
        <Wizard open={wizard.open} plan={wizard.plan} onClose={() => setWizard(w => ({ ...w, open: false }))} />
        <LoginDialog open={dialog === 'login'} onClose={() => setDialog(null)} />
        <ContactDialog open={dialog === 'contact'} onClose={() => setDialog(null)} />
        <Toast toast={toast} />
      </div>
    </TidingsCtx.Provider>
  );
}
