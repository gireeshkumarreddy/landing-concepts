import { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useEscape, useFocusTrap, useScrollLock } from '../../../shared/a11y.js';
import { tx, useMediaQuery } from '../lib.js';
import { IconClose } from '../icons.jsx';

/**
 * Dialog shell: centred card on desktop, bottom sheet on small screens (when `sheet`).
 * Focus trap, Escape, scroll lock and click-outside are handled here.
 */
export default function Modal({ open, onClose, labelledBy, children, className = '', sheet = false, closeLabel = 'Close' }) {
  return <AnimatePresence>{open && <Panel {...{ onClose, labelledBy, className, sheet, closeLabel }}>{children}</Panel>}</AnimatePresence>;
}

function Panel({ onClose, labelledBy, children, className, sheet, closeLabel }) {
  const ref = useRef(null);
  const small = useMediaQuery('(max-width: 700px)');
  const asSheet = sheet && small;
  useFocusTrap(ref, true);
  useEscape(true, onClose);
  useScrollLock(true);

  const variants = asSheet
    ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }
    : { initial: { opacity: 0, y: 18, scale: 0.985 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 10, scale: 0.99 } };

  return (
    <div className={`cr-modal${asSheet ? ' cr-modal--sheet' : ''}`}>
      <motion.div
        className="cr-modal__scrim"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={tx({ duration: 0.25 })}
      />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        data-lenis-prevent
        className={`cr-modal__panel ${className}`}
        {...variants}
        transition={tx({ duration: asSheet ? 0.42 : 0.38, ease: [0.2, 0.7, 0.2, 1] })}
      >
        {asSheet && <span className="cr-modal__grip" aria-hidden="true" />}
        <button type="button" className="cr-modal__close" onClick={onClose} aria-label={closeLabel}>
          <IconClose size={18} />
        </button>
        {children}
      </motion.div>
    </div>
  );
}
