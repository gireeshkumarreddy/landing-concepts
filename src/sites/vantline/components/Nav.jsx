import { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useEscape, useFocusTrap, useScrollLock } from '../../../shared/a11y.js';
import { NAV_LINKS } from '../data.js';
import { Close, Menu } from '../icons.jsx';
import { PillButton, useReducedPref } from './ui.jsx';

/** Nav that floats over the hero photograph. */
export function HeroNav({ onSignup, onMenu, menuOpen }) {
  return (
    <header className="au-nav" data-au-hero-nav>
      <a className="au-wordmark au-nav__brand" href="#top" aria-label="vantline, back to top">
        vantline
      </a>
      <nav className="au-nav__center" aria-label="Primary">
        <ul role="list">
          {NAV_LINKS.map(l => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="au-nav__end">
        <button type="button" className="au-nav__signup" onClick={onSignup}>
          Start free
        </button>
        <button
          type="button"
          className="au-nav__menu"
          aria-expanded={menuOpen}
          aria-controls="au-menu"
          aria-label="Open menu"
          onClick={onMenu}
        >
          <Menu />
        </button>
      </div>
    </header>
  );
}

/** Solid compact bar that drops in once the hero has scrolled away. */
export function FloatingNav({ visible, onSignup, onMenu, menuOpen }) {
  return (
    <div className={`au-float${visible ? ' is-visible' : ''}`} inert={!visible}>
      <div className="au-float__bar">
        <a className="au-wordmark au-float__brand" href="#top" aria-label="vantline, back to top">
          vantline
        </a>
        <nav className="au-float__links" aria-label="Sections">
          <ul role="list">
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="au-float__end">
          <button type="button" className="au-float__signup" onClick={onSignup}>
            Start free
          </button>
          <button
            type="button"
            className="au-float__menu"
            aria-expanded={menuOpen}
            aria-controls="au-menu"
            aria-label="Open menu"
            onClick={onMenu}
          >
            <Menu />
          </button>
        </div>
      </div>
    </div>
  );
}

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } },
};

/** Full-screen menu for small screens. */
export function MobileMenu({ open, onClose, onSignup }) {
  const ref = useRef(null);
  const reduced = useReducedPref();
  useEscape(open, onClose);
  useFocusTrap(ref, open);
  useScrollLock(open);

  return (
    <div id="au-menu">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            className="au-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.2 } }}
            transition={{ duration: reduced ? 0 : 0.3 }}
          >
            <div className="au-menu__top">
              <span className="au-wordmark">vantline</span>
              <button type="button" className="au-menu__close" onClick={onClose} aria-label="Close menu">
                <Close />
              </button>
            </div>
            <motion.nav aria-label="Menu" variants={list} initial={reduced ? false : 'hidden'} animate="show">
              <ul role="list" className="au-menu__list">
                {NAV_LINKS.map((l, i) => (
                  <motion.li key={l.href} variants={item}>
                    <a href={l.href} onClick={onClose}>
                      <span className="au-menu__num">0{i + 1}</span>
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
            <motion.div className="au-menu__foot" variants={item} initial={reduced ? false : 'hidden'} animate="show">
              <PillButton
                tone="light"
                onClick={() => {
                  onClose();
                  onSignup();
                }}
              >
                Try Vantline free
              </PillButton>
              <p className="au-menu__note">A concept product. Nothing on this page creates a real account.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
