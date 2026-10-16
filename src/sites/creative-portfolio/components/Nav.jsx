import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useEscape, useFocusTrap, useScrollLock } from '../../../shared/a11y.js';
import { NAV } from '../data.js';
import { goToContact } from '../utils.js';
import { IconClose, IconMenu } from '../icons.jsx';

const EASE = [0.2, 0.7, 0.2, 1];

export default function Nav() {
  const [active, setActive] = useState('index');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sheetRef = useRef(null);

  useEscape(open, () => setOpen(false));
  useFocusTrap(sheetRef, open);
  useScrollLock(open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the last nav-mapped section whose top has passed 40% of the viewport.
  // IntersectionObserver tells us when sections cross; the geometry check picks the winner,
  // so unmapped sections (Services) keep the previous item highlighted.
  useEffect(() => {
    const ids = new Set(NAV.map(n => n.id));
    const sections = [...document.querySelectorAll('.pf main > section[id]')];
    const pick = () => {
      const line = window.innerHeight * 0.4;
      let current = 'index';
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= line && ids.has(s.id)) current = s.id;
      }
      setActive(current);
    };
    pick();
    const io = new IntersectionObserver(pick, {
      rootMargin: '-40% 0px -59% 0px',
      threshold: [0, 1],
    });
    sections.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const closeAndGo = (e, id) => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => {
      if (id === 'contact') return goToContact();
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
      history.replaceState?.(null, '', `#${id}`);
    });
  };

  return (
    <>
      <header className={`pf-nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="pf-nav-in">
          <a href="#index" className="pf-nav-name">
            Ines Morrow
          </a>
          <nav aria-label="Primary" className="pf-nav-links">
            <ul role="list">
              {NAV.map(n => {
                const on = active === n.id;
                return (
                  <li key={n.id}>
                    <a href={`#${n.id}`} className={on ? 'is-active' : undefined} aria-current={on ? 'location' : undefined}>
                      {on && <motion.span layoutId="pf-nav-pill" className="pf-nav-pill" transition={{ duration: 0.45, ease: EASE }} />}
                      <span className="pf-nav-label">{n.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="pf-nav-end">
            <a href="#contact" className="pf-nav-cta" onClick={goToContact}>
              Start a project
            </a>
            <button
              type="button"
              className="pf-nav-menu"
              aria-expanded={open}
              aria-controls="pf-menu"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <IconMenu size={18} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="pf-sheet-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="pf-sheet-scrim" onClick={() => setOpen(false)} />
            <motion.div
              id="pf-menu"
              ref={sheetRef}
              className="pf-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="pf-sheet-top">
                <span className="pf-nav-name">Ines Morrow</span>
                <button type="button" className="pf-nav-menu" aria-label="Close menu" onClick={() => setOpen(false)}>
                  <IconClose size={18} />
                </button>
              </div>
              <ul role="list" className="pf-sheet-links">
                {NAV.map((n, i) => (
                  <li key={n.id}>
                    <a
                      href={`#${n.id}`}
                      onClick={e => closeAndGo(e, n.id)}
                      aria-current={active === n.id ? 'location' : undefined}
                    >
                      <span className="pf-sheet-n">0{i + 1}</span>
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a href="#contact" className="pf-btn pf-btn--blue pf-sheet-cta" onClick={e => closeAndGo(e, 'contact')}>
                Start a project
              </a>
              <p className="pf-sheet-note">Booking from February 2027</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
