import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useEscape, useFocusTrap, useScrollLock } from '../../../shared/a11y.js';
import { NAV } from '../data.js';
import { scrollToTarget } from '../../../shared/motion/index.js';
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

  // Highlight the item of the section under the line at 40% of the viewport, re-checked once per
  // frame while scrolling (a thin IntersectionObserver band could miss the moment a section's top
  // crossed the line and leave the previous item lit). The statement closes the Reel (data-nav);
  // a section without a nav item (Services) lights nothing rather than the item before it.
  useEffect(() => {
    const ids = new Set(NAV.map(n => n.id));
    const sections = [...document.querySelectorAll('.pf main > section')];
    let raf = 0;
    const pick = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current = sections[0];
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= line) current = s;
      }
      const id = current?.dataset.nav || current?.id || 'index';
      setActive(ids.has(id) ? id : null);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };
    pick();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    // Filtering the grid or a late image changes section heights without a scroll.
    const ro = new ResizeObserver(queue);
    ro.observe(document.querySelector('.pf main'));
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, []);

  const closeAndGo = (e, id) => {
    e.preventDefault();
    setOpen(false);
    // Wait a tick so the menu's scroll lock has released before gliding to the section.
    setTimeout(() => {
      if (id === 'contact') return goToContact();
      scrollToTarget(`#${id}`);
      history.replaceState?.(history.state, '', `#${id}`);
    }, 60);
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
