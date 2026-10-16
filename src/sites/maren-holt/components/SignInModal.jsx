import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { isEmail } from '../../../shared/a11y.js';
import { useDemoForm, useDialog, useReduced } from '../lib.jsx';
import { CheckIcon, CloseIcon, MailIcon, Spinner } from '../icons.jsx';
import Field from './Field.jsx';

const RULES = {
  email: v => (!v.trim() ? 'Your email is needed for the link.' : !isEmail(v) ? 'Use a full address, like name@example.com.' : ''),
};

export default function SignInModal({ onClose }) {
  const ref = useRef(null);
  const doneRef = useRef(null);
  const reduce = useReduced();
  useDialog(ref, onClose);
  const f = useDemoForm({ email: '' }, RULES, { delay: 1000 });

  useEffect(() => {
    if (f.status === 'success') doneRef.current?.focus();
  }, [f.status]);

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
        className="ch-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ch-signin-title"
        aria-describedby="ch-signin-desc"
        initial={{ opacity: 0, y: reduce ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduce ? 0 : 8 }}
        transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <button type="button" className="ch-iconbtn ch-modal__close" onClick={onClose} aria-label="Close sign in">
          <CloseIcon size={18} />
        </button>
        <span className="ch-modal__icon" aria-hidden="true">
          <MailIcon size={20} />
        </span>
        <h2 className="ch-modal__title" id="ch-signin-title">
          Sign in
        </h2>
        {f.status !== 'success' ? (
          <>
            <p className="ch-modal__text" id="ch-signin-desc">
              Enter your email and I’ll send a one-time link. There’s no password to remember.
            </p>
            <form ref={f.formRef} noValidate onSubmit={f.onSubmit} className="ch-modal__form">
              <Field id="ch-signin-email" label="Email address" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" error={f.errors.email} readOnly={f.status === 'loading'} {...f.bind('email')} />
              <button type="submit" className="ch-btn ch-btn--raised ch-btn--block" aria-disabled={f.status === 'loading' || undefined}>
                {f.status === 'loading' ? (
                  <>
                    <Spinner /> Sending…
                  </>
                ) : (
                  'Email me a link'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="ch-modal__done">
            <p id="ch-signin-desc" ref={doneRef} tabIndex={-1} role="status" className="ch-notice">
              <CheckIcon size={16} />
              <span>Sign-in is switched off in this concept, so no link was sent and nothing was stored.</span>
            </p>
            <button type="button" className="ch-btn ch-btn--ghost ch-btn--block" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
