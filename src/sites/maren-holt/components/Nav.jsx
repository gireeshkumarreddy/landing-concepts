import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { NAV } from '../data.js';
import { useDialog, useReduced } from '../lib.jsx';
import { CloseIcon, MenuIcon, SearchIcon, ArrowRight } from '../icons.jsx';

export function Monogram({ size = 'md' }) {
  return (
    <span className={`ch-mono ch-mono--${size}`} aria-hidden="true">
      MH
    </span>
  );
}

export default function Nav({ active, onSearch, onSignIn, goTo }) {
  const reduce = useReduced();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`ch-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="ch-header__row">
          <a href="#top" className="ch-brand" data-hero-in>
            <Monogram />
            <span className="ch-brand__name">Maren Holt</span>
          </a>

          <nav aria-label="Primary" className="ch-nav" data-hero-in>
            <ul role="list" className="ch-pill">
              {NAV.map(n => {
                const on = active === n.id;
                return (
                  <li key={n.id}>
                    <a href={`#${n.id}`} className={`ch-pill__link ${on ? 'is-active' : ''}`} aria-current={on ? 'location' : undefined}>
                      {n.label}
                      {on && <motion.span layoutId="ch-nav-dot" className="ch-pill__dot" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 480, damping: 38 }} />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ch-header__end" data-hero-in>
            <button type="button" className="ch-iconbtn" onClick={onSearch} aria-label="Search essays" aria-keyshortcuts="/" title="Search essays  ( / )">
              <SearchIcon size={19} />
            </button>
            <button type="button" className="ch-signin" onClick={onSignIn}>
              Sign in
            </button>
            <button
              type="button"
              className="ch-menubtn"
              aria-expanded={menu}
              aria-controls="ch-menu"
              aria-label="Open menu"
              onClick={() => setMenu(true)}
            >
              <MenuIcon size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside the sticky header: its backdrop-filter would otherwise trap position:fixed. */}
      <AnimatePresence>
        {menu && (
          <MobileMenu
            active={active}
            onClose={() => setMenu(false)}
            onPick={id => {
              setMenu(false);
              goTo(id);
            }}
            onSearch={() => {
              setMenu(false);
              onSearch();
            }}
            onSignIn={() => {
              setMenu(false);
              onSignIn();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function MobileMenu({ active, onClose, onPick, onSearch, onSignIn }) {
  const ref = useRef(null);
  const reduce = useReduced();
  useDialog(ref, onClose);
  return (
    <>
      <motion.div
        className="ch-scrim"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        ref={ref}
        id="ch-menu"
        className="ch-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        initial={{ opacity: 0, y: reduce ? 0 : -14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduce ? 0 : -10 }}
        transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="ch-menu__top">
          <span className="ch-brand">
            <Monogram />
            <span className="ch-brand__name">Maren Holt</span>
          </span>
          <button type="button" className="ch-iconbtn" onClick={onClose} aria-label="Close menu">
            <CloseIcon size={20} />
          </button>
        </div>
        <ul role="list" className="ch-menu__list">
          {NAV.map((n, i) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className={`ch-menu__link ${active === n.id ? 'is-active' : ''}`}
                onClick={e => {
                  e.preventDefault();
                  onPick(n.id);
                }}
              >
                <span className="ch-menu__num">0{i + 1}</span>
                {n.label}
                <ArrowRight size={18} />
              </a>
            </li>
          ))}
        </ul>
        <div className="ch-menu__actions">
          <button type="button" className="ch-btn ch-btn--ghost" onClick={onSearch}>
            <SearchIcon size={17} /> Search essays
          </button>
          <button type="button" className="ch-btn ch-btn--dark" onClick={onSignIn}>
            Sign in
          </button>
        </div>
      </motion.div>
    </>
  );
}
