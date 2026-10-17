import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useEscape, useFocusTrap, useScrollLock } from '../../../shared/a11y.js';
import { NAV_LINKS } from '../data.js';
import { scrollToId, tx, useSagewell } from '../lib.js';
import { IconArrowRight, IconClose, IconMenu } from '../icons.jsx';

/** Brand mark: a sage leaf resting inside a drop of well water. */
export function Mark({ className = 'cr-wordmark__mark' }) {
  return (
    <svg className={className} viewBox="2.5 1 15 18" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M10 1.9c2.9 3.3 6 6.8 6 10.2a6 6 0 0 1-12 0c0-3.4 3.1-6.9 6-10.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M7.1 15.3c-.1-3 2.1-5.3 5.8-5.7-.1 3.4-2.4 5.7-5.8 5.7Z" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ as: Tag = 'a', className = '', ...rest }) {
  return (
    <Tag className={`cr-wordmark ${className}`} {...rest}>
      <Mark />
      Sagewell
    </Tag>
  );
}

function Links({ active, onNavigate, className }) {
  return (
    <ul className={className} role="list">
      {NAV_LINKS.map(l => (
        <li key={l.id}>
          <a href={l.href} aria-current={active === l.id ? 'true' : undefined} onClick={onNavigate}>
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** The nav that lives inside the hero frame. */
export function HeroNav({ menuOpen, onMenu }) {
  const { openAccess } = useSagewell();
  return (
    <header className="cr-header" data-cr-intro="nav">
      <nav className="cr-header__inner" aria-label="Primary">
        <Wordmark href="#top" aria-label="Sagewell, back to top" />
        <Links className="cr-header__links" />
        <button type="button" className="cr-btn cr-btn--ink cr-header__cta" data-magnetic="0.25" onClick={openAccess}>
          Request access
        </button>
        <button
          type="button"
          className="cr-menu-btn"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="cr-menu"
          onClick={onMenu}
        >
          <IconMenu />
        </button>
      </nav>
    </header>
  );
}

/** Compact fog-glass pill that appears once the hero has scrolled away. */
export function FloatingNav({ visible, active, menuOpen, onMenu }) {
  const { openAccess } = useSagewell();
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="cr-float"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={tx({ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] })}
        >
          <nav className="cr-float__inner" aria-label="Section shortcuts">
            <Wordmark href="#top" aria-label="Sagewell, back to top" className="cr-wordmark--sm" />
            <Links className="cr-float__links" active={active} />
            <button type="button" className="cr-btn cr-btn--ink cr-btn--sm cr-float__cta" data-magnetic="0.25" onClick={openAccess}>
              Request access
            </button>
            <button
              type="button"
              className="cr-menu-btn cr-menu-btn--float"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="cr-menu"
              onClick={onMenu}
            >
              <IconMenu />
            </button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Mobile sheet menu. */
export function MobileMenu({ open, onClose }) {
  const ref = useRef(null);
  const { openAccess } = useSagewell();
  useFocusTrap(ref, open);
  useEscape(open, onClose);
  useScrollLock(open);
  return (
    <AnimatePresence>
      {open && (
        <div className="cr-menu" key="menu">
          <motion.div
            className="cr-menu__scrim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={tx({ duration: 0.25 })}
          />
          <motion.div
            ref={ref}
            id="cr-menu"
            className="cr-menu__panel"
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={tx({ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] })}
          >
            <div className="cr-menu__top">
              <Wordmark
                href="#top"
                onClick={e => {
                  e.preventDefault();
                  onClose();
                  setTimeout(() => scrollToId('top'), 40);
                }}
              />
              <button type="button" className="cr-menu-btn cr-menu-btn--show" aria-label="Close menu" onClick={onClose}>
                <IconClose />
              </button>
            </div>
            <ul className="cr-menu__links" role="list">
              {[...NAV_LINKS, { href: '#playground', label: 'Playground', id: 'playground' }, { href: '#use-cases', label: 'In practice', id: 'use-cases' }].map(
                l => (
                  <li key={l.id}>
                    <a
                      href={l.href}
                      onClick={e => {
                        e.preventDefault();
                        onClose();
                        setTimeout(() => scrollToId(l.id), 40);
                      }}
                    >
                      {l.label}
                      <IconArrowRight size={18} />
                    </a>
                  </li>
                )
              )}
            </ul>
            <button
              type="button"
              className="cr-btn cr-btn--ink cr-btn--lg cr-menu__cta"
              onClick={() => {
                onClose();
                setTimeout(openAccess, 60);
              }}
            >
              Request access
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Tracks which nav section is in view. */
export function useScrollSpy(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}
