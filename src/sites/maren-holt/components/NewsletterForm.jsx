import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useReduced } from '../lib.jsx';
import { isEmail } from '../../../shared/a11y.js';
import { CheckIcon, Spinner, UndoIcon } from '../icons.jsx';

const validate = v => (!v.trim() ? 'Add your email to get the Sunday notes.' : !isEmail(v) ? 'That address looks incomplete — check it and try again.' : '');

export default function NewsletterForm({ onKeystroke, id = 'ch-newsletter-email', className = '' }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState('idle');
  const reduce = useReduced();
  const dy = reduce ? 0 : 6;
  const inputRef = useRef(null);
  const doneRef = useRef(null);
  const timer = useRef(0);
  const errId = `${id}-err`;

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (status === 'success') doneRef.current?.focus({ preventScroll: true });
  }, [status]);

  const submit = e => {
    e.preventDefault();
    if (status === 'loading') return;
    setTried(true);
    const msg = validate(value);
    setError(msg);
    if (msg) {
      inputRef.current?.focus();
      return;
    }
    setStatus('loading');
    timer.current = setTimeout(() => setStatus('success'), 1000);
  };

  const undo = () => {
    setStatus('idle');
    setValue('');
    setTried(false);
    setError('');
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 40);
  };

  return (
    <div className={`ch-news ${className}`} data-hero-fade>
      <AnimatePresence mode="wait" initial={false}>
        {status !== 'success' ? (
          <motion.form
            key="form"
            className="ch-news__form"
            noValidate
            onSubmit={submit}
            initial={{ opacity: 0, y: dy }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -dy }}
            transition={{ duration: 0.25 }}
            aria-label="Sunday editing notes"
          >
            <div className={`ch-news__field ${error ? 'is-invalid' : ''}`}>
              <label className="sr-only" htmlFor={id}>
                Email address
              </label>
              <input
                ref={inputRef}
                id={id}
                className="ch-news__input"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder=" "
                value={value}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? errId : undefined}
                readOnly={status === 'loading'}
                onChange={e => {
                  setValue(e.target.value);
                  if (tried) setError(validate(e.target.value));
                }}
                onBlur={() => tried && setError(validate(value))}
                onKeyDown={e => {
                  if (e.key.length === 1 || e.key === 'Backspace') onKeystroke?.();
                }}
              />
              <span className="ch-news__ph" aria-hidden="true">
                your@email<i>_</i>
              </span>
            </div>
            <button type="submit" className="ch-btn ch-btn--raised ch-news__btn" aria-disabled={status === 'loading' || undefined}>
              {status === 'loading' ? (
                <>
                  <Spinner size={16} />
                  <span>Adding you…</span>
                </>
              ) : (
                'Get the notes'
              )}
            </button>
            <span className="sr-only" aria-live="polite">
              {status === 'loading' ? 'Adding you to the list…' : ''}
            </span>
            {error && (
              <p className="ch-news__error" id={errId}>
                {error}
              </p>
            )}
          </motion.form>
        ) : (
          <motion.div
            key="done"
            className="ch-news__done"
            initial={{ opacity: 0, y: dy }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -dy }}
            transition={{ duration: 0.3 }}
          >
            <span className="ch-news__check" aria-hidden="true">
              <CheckIcon size={16} />
            </span>
            <p ref={doneRef} tabIndex={-1} role="status">
              You’re subscribed in this demo — no email was stored or sent.
            </p>
            <button type="button" className="ch-textbtn" onClick={undo}>
              <UndoIcon size={15} /> Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
