import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTidings, useDropdown, useScrolled } from '../hooks.jsx';
import { LEARN_LINKS, PLATFORM_LINKS, REGIONS, REGION_ORDER } from '../data.js';
import { CurrencyMark, IconArrow, IconChevronDown, IconClose, IconMenu } from '../icons.jsx';
import { useEscape, useFocusTrap, useScrollLock } from '../../../shared/a11y.js';

const pop = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.98 },
  transition: { duration: 0.18, ease: [0.2, 0.7, 0.2, 1] },
};

function NavDropdown({ label, items }) {
  const dd = useDropdown();
  const id = useId();
  return (
    <div className="ar-dd" ref={dd.wrapRef} onBlur={dd.onWrapBlur}>
      <button
        ref={dd.btnRef}
        type="button"
        className="ar-nav-link ar-dd-btn"
        aria-expanded={dd.open}
        aria-controls={id}
        onClick={() => dd.setOpen(o => !o)}
        onKeyDown={dd.onButtonKeyDown}
      >
        {label}
        <IconChevronDown size={13} sw={2} className="ar-dd-chev" />
      </button>
      <AnimatePresence>
        {dd.open && (
          <motion.div {...pop} id={id} ref={dd.panelRef} className="ar-dd-panel" onKeyDown={dd.onPanelKeyDown}>
            <ul role="list">
              {items.map(it => (
                <li key={it.href}>
                  <a data-dd-item href={it.href} className="ar-dd-item" onClick={() => dd.setOpen(false)}>
                    <span className="ar-dd-label">{it.label}</span>
                    <span className="ar-dd-note">{it.note}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function RegionSelect({ align = 'right', compact = false }) {
  const { region, setRegion } = useTidings();
  const dd = useDropdown();
  const id = useId();
  return (
    <div className={`ar-dd ar-region ${compact ? 'is-compact' : ''}`} ref={dd.wrapRef} onBlur={dd.onWrapBlur}>
      <button
        ref={dd.btnRef}
        type="button"
        className="ar-region-btn"
        aria-expanded={dd.open}
        aria-controls={id}
        aria-haspopup="menu"
        aria-label={`Region: ${REGIONS[region].name}. Change region and currency`}
        onClick={() => dd.setOpen(o => !o)}
        onKeyDown={dd.onButtonKeyDown}
      >
        <CurrencyMark code={region} />
        <span>{region}</span>
        <IconChevronDown size={13} sw={2} className="ar-dd-chev" />
      </button>
      <AnimatePresence>
        {dd.open && (
          <motion.div
            {...pop}
            id={id}
            ref={dd.panelRef}
            role="menu"
            aria-label="Region and currency"
            className={`ar-dd-panel ar-region-panel is-${align}`}
            onKeyDown={dd.onPanelKeyDown}
          >
            {REGION_ORDER.map(code => (
              <button
                key={code}
                type="button"
                role="menuitemradio"
                aria-checked={region === code}
                data-dd-item
                className="ar-region-item"
                onClick={() => {
                  setRegion(code);
                  dd.setOpen(false);
                  dd.btnRef.current?.focus();
                }}
              >
                <CurrencyMark code={code} />
                <span className="ar-region-name">{REGIONS[code].name}</span>
                <span className="ar-region-cur">
                  {REGIONS[code].symbol} {REGIONS[code].currency}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({ open, onClose }) {
  const ref = useRef(null);
  const { openWizard, openLogin, region, setRegion } = useTidings();
  useFocusTrap(ref, open);
  useEscape(open, onClose);
  useScrollLock(open);
  const groups = [
    { title: 'Platform', links: PLATFORM_LINKS },
    { title: 'Learn', links: LEARN_LINKS },
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="ar-sheet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={ref}
            id="ar-mobile-menu"
            className="ar-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="ar-sheet-top">
              <span className="ar-wordmark" aria-hidden="true">
                tidings
              </span>
              <button type="button" className="ar-icon-btn" aria-label="Close menu" onClick={onClose}>
                <IconClose size={20} />
              </button>
            </div>
            <nav aria-label="Mobile">
              {groups.map(g => (
                <div className="ar-sheet-group" key={g.title}>
                  <p className="ar-sheet-title">{g.title}</p>
                  <ul role="list">
                    {g.links.map(l => (
                      <li key={l.href}>
                        <a href={l.href} onClick={onClose} className="ar-sheet-link">
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="ar-sheet-group ar-sheet-row">
                <a href="#pricing" onClick={onClose} className="ar-sheet-link is-big">
                  Pricing
                </a>
                <a href="#about" onClick={onClose} className="ar-sheet-link is-big">
                  Company
                </a>
              </div>
            </nav>
            <fieldset className="ar-sheet-region">
              <legend className="ar-sheet-title">Region &amp; currency</legend>
              <div className="ar-seg" role="radiogroup" aria-label="Region">
                {REGION_ORDER.map(code => (
                  <label key={code} className={`ar-seg-opt ${region === code ? 'is-on' : ''}`}>
                    <input
                      type="radio"
                      name="ar-mobile-region"
                      value={code}
                      checked={region === code}
                      onChange={() => setRegion(code)}
                      className="sr-only"
                    />
                    <CurrencyMark code={code} />
                    {code}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="ar-sheet-actions">
              <button
                type="button"
                className="ar-btn-login is-block"
                onClick={() => {
                  onClose();
                  openLogin();
                }}
              >
                Sign in
              </button>
              <button
                type="button"
                className="ar-btn-start is-block"
                onClick={() => {
                  onClose();
                  openWizard();
                }}
              >
                Book a demo
                <span className="ar-btn-start-dot">
                  <IconArrow size={14} sw={2.2} />
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Nav() {
  const { openWizard, openLogin } = useTidings();
  const scrolled = useScrolled(12);
  const [menu, setMenu] = useState(false);
  return (
    <>
    <header className={`ar-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="ar-wrap ar-nav-inner">
        <a href="#top" className="ar-wordmark" aria-label="tidings — back to top">
          tidings
        </a>
        <nav aria-label="Primary" className="ar-nav-links">
          <ul role="list">
            <li>
              <NavDropdown label="Platform" items={PLATFORM_LINKS} />
            </li>
            <li>
              <NavDropdown label="Learn" items={LEARN_LINKS} />
            </li>
            <li>
              <a className="ar-nav-link" href="#pricing">
                Pricing
              </a>
            </li>
            <li>
              <a className="ar-nav-link" href="#about">
                Company
              </a>
            </li>
          </ul>
        </nav>
        <div className="ar-nav-actions">
          <button type="button" className="ar-btn-login ar-hide-sm" onClick={openLogin}>
            Sign in
          </button>
          <button type="button" className="ar-btn-start" onClick={() => openWizard()}>
            Book a demo
            <span className="ar-btn-start-dot">
              <IconArrow size={14} sw={2.2} />
            </span>
          </button>
          <div className="ar-hide-md">
            <RegionSelect />
          </div>
          <button
            type="button"
            className="ar-menu-btn"
            aria-expanded={menu}
            aria-controls="ar-mobile-menu"
            aria-label="Open menu"
            onClick={() => setMenu(true)}
          >
            <IconMenu size={20} />
          </button>
        </div>
      </div>
    </header>
    {/* Rendered outside the header: its backdrop-filter would otherwise trap the fixed sheet. */}
    <MobileMenu open={menu} onClose={() => setMenu(false)} />
    </>
  );
}
