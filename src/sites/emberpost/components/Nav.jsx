import { useEffect, useRef, useState } from 'react';
import { useEscape, useFocusTrap, useScrollLock } from '../../../shared/a11y.js';
import { scrollToTarget } from '../../../shared/motion/index.js';
import { goToWaitlist, useMedia } from '../lib.js';
import { Bolt, Close, Menu, ArrowRight } from '../icons.jsx';
import Wordmark from './Wordmark.jsx';

const MENU = [
  { href: '#people', label: 'By person' },
  { href: '#features', label: 'Tools' },
  { href: '#workflows', label: 'Workflows' },
  { href: '#manifesto', label: 'Manifesto' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ringRef = useRef(null);
  const desktop = useMedia('(min-width: 860px)', true);

  useEscape(open, () => setOpen(false));
  useFocusTrap(ringRef, open);
  useScrollLock(open);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (desktop) setOpen(false);
  }, [desktop]);

  // Menu links: close first (releases the scroll lock), then move to the section.
  const go = href => e => {
    e.preventDefault();
    setOpen(false);
    // Two frames: the menu closes and the scroll lock releases before we glide.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const el = document.querySelector(href);
        if (!el) return;
        scrollToTarget(el);
        el.focus?.({ preventScroll: true });
      })
    );
  };

  const early = e => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => requestAnimationFrame(() => goToWaitlist()));
  };

  return (
    <header className={`ta-nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="ta-nav__ring" ref={ringRef}>
        <div className="ta-nav__bar">
          <Wordmark />
          <nav className="ta-nav__links" aria-label="Primary">
            <a href="#manifesto">Manifesto</a>
            <a href="#workflows">Workflows</a>
          </nav>
          <a href="#waitlist" className="ta-btn ta-btn--ink ta-nav__cta" onClick={early} data-magnetic="0.25">
            <span className="ta-nav__cta-long">Join the waitlist</span>
            <span className="ta-nav__cta-short">Waitlist</span>
            <Bolt size={13} />
          </a>
          <button
            type="button"
            className="ta-nav__menu"
            aria-expanded={open}
            aria-controls="ta-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(o => !o)}
          >
            {open ? <Close size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div id="ta-menu" className="ta-menu" hidden={!open}>
          <nav aria-label="Menu">
            <ul role="list">
              {MENU.map((m, i) => (
                <li key={m.href}>
                  <a href={m.href} onClick={go(m.href)} data-autofocus={i === 0 ? '' : undefined}>
                    <span>{m.label}</span>
                    <ArrowRight size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a href="#waitlist" className="ta-btn ta-btn--violet ta-menu__cta" onClick={early}>
            Join the waitlist <Bolt size={14} />
          </a>
        </div>
      </div>
    </header>
  );
}
