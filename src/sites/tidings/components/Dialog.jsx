import { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useEscape, useFocusTrap, useScrollLock } from '../../../shared/a11y.js';
import { IconClose } from '../icons.jsx';

/**
 * Modal shell: focus trap, Escape, scroll lock, backdrop click.
 * `onRequestClose` lets a dialog intercept closing (e.g. to confirm discarding a draft).
 */
export default function Dialog({ open, onRequestClose, labelledBy, describedBy, className = '', children, size = 'md' }) {
  const ref = useRef(null);
  useFocusTrap(ref, open);
  useEscape(open, onRequestClose);
  useScrollLock(open);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="ar-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onMouseDown={e => e.target === e.currentTarget && onRequestClose()}
        >
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            tabIndex={-1}
            className={`ar-modal is-${size} ${className}`}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.34, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <button type="button" className="ar-modal-close" aria-label="Close dialog" onClick={onRequestClose}>
              <IconClose size={18} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Small labelled input with inline error wiring. */
export function Field({ id, label, hint, error, children, className = '' }) {
  return (
    <div className={`ar-field ${error ? 'has-error' : ''} ${className}`}>
      <label htmlFor={id} className="ar-label">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="ar-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="ar-error" id={`${id}-err`}>
          {error}
        </p>
      )}
    </div>
  );
}

/** aria props for an input given its error/hint state. */
export const fieldAria = (id, error, hint) => ({
  id,
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? `${id}-err` : hint ? `${id}-hint` : undefined,
});
