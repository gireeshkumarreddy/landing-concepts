import '@fontsource-variable/outfit';
import './tidings.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSiteMeta } from '../../shared/useSiteMeta.js';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, prefersReducedMotion } from '../../shared/gsap.js';
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
    themeColor: '#fbfaf6',
    background: '#fbfaf6',
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

  // In-page anchors scroll smoothly via JS (reduced-motion aware) and move focus to the target.
  // Programmatic scrolling stays instant while this page is mounted.
  useEffect(() => {
    const node = root.current;
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    // ScrollTrigger restores inline "smooth" a frame after each refresh; re-assert "auto" after it.
    let raf;
    const forceAuto = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => (html.style.scrollBehavior = 'auto'));
      });
    };
    html.style.scrollBehavior = 'auto';
    forceAuto();
    ScrollTrigger.addEventListener('refresh', forceAuto);
    let t;
    const onClick = e => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = decodeURIComponent(a.getAttribute('href').slice(1));
      const el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      clearTimeout(t);
      // wait a tick so menus/sheets can close (and release the scroll lock) first
      t = setTimeout(() => {
        el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        setTimeout(() => el.focus({ preventScroll: true }), 60);
      }, 30);
    };
    node.addEventListener('click', onClick);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      ScrollTrigger.removeEventListener('refresh', forceAuto);
      node.removeEventListener('click', onClick);
      html.style.scrollBehavior = prev === 'auto' ? '' : prev;
    };
  }, []);

  // Scroll reveals for section content (motion-safe only; content is visible by default).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray('main [data-reveal]', root.current);
        gsap.set(items, { opacity: 0, y: 28 });
        ScrollTrigger.batch(items, {
          start: 'clamp(top 88%)',
          once: true,
          onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, overwrite: true }),
        });
      });
      // The route is lazy-loaded after window "load", so keep trigger positions fresh
      // when web fonts land or the page height changes (accordions, tabs, images).
      let t;
      const refresh = () => {
        clearTimeout(t);
        t = setTimeout(() => ScrollTrigger.refresh(), 160);
      };
      document.fonts?.ready.then(refresh);
      const ro = new ResizeObserver(refresh);
      ro.observe(root.current);
      return () => {
        clearTimeout(t);
        ro.disconnect();
        mm.revert();
      };
    },
    { scope: root }
  );

  return (
    <TidingsCtx.Provider value={ctx}>
      <div className="ar" ref={root}>
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
