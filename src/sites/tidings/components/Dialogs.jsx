import { useEffect, useRef, useState } from 'react';
import Dialog, { Field, fieldAria } from './Dialog.jsx';
import { isEmail } from '../../../shared/a11y.js';
import { IconArrow, IconCheck, Spinner } from '../icons.jsx';

/* ---------- Log in ---------- */
export function LoginDialog({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState('idle');
  const inputRef = useRef(null);
  const timer = useRef();

  useEffect(() => {
    if (open) {
      setEmail('');
      setTried(false);
      setStatus('idle');
    }
    return () => clearTimeout(timer.current);
  }, [open]);

  const error = tried && !isEmail(email) ? (email.trim() ? 'Enter a valid email, like name@company.com.' : 'Enter your work email.') : '';

  const submit = e => {
    e.preventDefault();
    setTried(true);
    if (!isEmail(email)) {
      inputRef.current?.focus();
      return;
    }
    setStatus('loading');
    timer.current = setTimeout(() => setStatus('done'), 800);
  };

  return (
    <Dialog open={open} onRequestClose={onClose} labelledBy="ar-login-title" size="sm">
      <div className="ar-modal-body">
        <p className="ar-eyebrow">Sign in</p>
        <h2 id="ar-login-title" className="ar-modal-title">
          Welcome back to Tidings
        </h2>
        {status === 'done' ? (
          <div className="ar-success" role="status">
            <span className="ar-success-ico">
              <IconCheck size={18} sw={2.4} />
            </span>
            <p>
              <strong>Email sign-in is switched off in this demo.</strong> Nothing was sent to {email.trim()}.
            </p>
            <button type="button" className="ar-btn ar-btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <p className="ar-modal-lead">Enter your work email and we’d send a one-time link — no password to remember.</p>
            <Field id="ar-login-email" label="Work email" error={error}>
              <input
                ref={inputRef}
                {...fieldAria('ar-login-email', error)}
                data-autofocus
                type="email"
                autoComplete="email"
                className="ar-input"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Field>
            <button type="submit" className="ar-btn ar-btn-primary is-block" disabled={status === 'loading'}>
              {status === 'loading' ? (
                <>
                  <Spinner /> Preparing link…
                </>
              ) : (
                <>
                  Send my sign-in link <IconArrow size={16} sw={2} />
                </>
              )}
            </button>
            <p className="ar-fineprint">Demo only — nothing is sent from this page.</p>
          </form>
        )}
      </div>
    </Dialog>
  );
}

/* ---------- Talk to sales ---------- */
const VOLUMES = ['Fewer than 50,000 messages a month', '50,000 – 250,000 a month', '250,000 – 1 million a month', 'Over 1 million a month'];

export function ContactDialog({ open, onClose }) {
  const empty = { name: '', email: '', company: '', volume: '', note: '' };
  const [v, setV] = useState(empty);
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState('idle');
  const refs = { name: useRef(null), email: useRef(null), volume: useRef(null) };
  const timer = useRef();

  useEffect(() => {
    if (open) {
      setV(empty);
      setTried(false);
      setStatus('idle');
    }
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const errs = {
    name: v.name.trim().length < 2 ? 'Tell us your name.' : '',
    email: !isEmail(v.email) ? (v.email.trim() ? 'Enter a valid email, like name@company.com.' : 'Enter your work email.') : '',
    volume: !v.volume ? 'Choose your expected message volume.' : '',
  };
  const shown = k => (tried ? errs[k] : '');
  const set = k => e => setV(s => ({ ...s, [k]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    setTried(true);
    const first = ['name', 'email', 'volume'].find(k => errs[k]);
    if (first) {
      refs[first].current?.focus();
      return;
    }
    setStatus('loading');
    timer.current = setTimeout(() => setStatus('done'), 900);
  };

  return (
    <Dialog open={open} onRequestClose={onClose} labelledBy="ar-contact-title">
      <div className="ar-modal-body">
        <p className="ar-eyebrow">Scale & multi-site</p>
        <h2 id="ar-contact-title" className="ar-modal-title">
          Talk to sales
        </h2>
        {status === 'done' ? (
          <div className="ar-success" role="status">
            <span className="ar-success-ico">
              <IconCheck size={18} sw={2.4} />
            </span>
            <p>
              <strong>Thanks, {v.name.trim().split(' ')[0]}.</strong> This is a demo, so your note was not sent to anyone.
            </p>
            <button type="button" className="ar-btn ar-btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <p className="ar-modal-lead">Share a little about your volume and locations, and we’ll shape a plan around your real numbers.</p>
            <div className="ar-grid-2">
              <Field id="ar-c-name" label="Your name" error={shown('name')}>
                <input ref={refs.name} {...fieldAria('ar-c-name', shown('name'))} data-autofocus className="ar-input" autoComplete="name" value={v.name} onChange={set('name')} />
              </Field>
              <Field id="ar-c-email" label="Work email" error={shown('email')}>
                <input ref={refs.email} {...fieldAria('ar-c-email', shown('email'))} type="email" className="ar-input" autoComplete="email" value={v.email} onChange={set('email')} />
              </Field>
            </div>
            <div className="ar-grid-2">
              <Field id="ar-c-company" label="Company (optional)">
                <input {...fieldAria('ar-c-company')} className="ar-input" autoComplete="organization" value={v.company} onChange={set('company')} />
              </Field>
              <Field id="ar-c-volume" label="Monthly volume" error={shown('volume')}>
                <select ref={refs.volume} {...fieldAria('ar-c-volume', shown('volume'))} className="ar-input ar-select" value={v.volume} onChange={set('volume')}>
                  <option value="">Choose a range</option>
                  {VOLUMES.map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field id="ar-c-note" label="What should we know? (optional)">
              <textarea {...fieldAria('ar-c-note')} rows={3} className="ar-input ar-textarea" value={v.note} onChange={set('note')} />
            </Field>
            <button type="submit" className="ar-btn ar-btn-primary is-block" disabled={status === 'loading'}>
              {status === 'loading' ? (
                <>
                  <Spinner /> Sending…
                </>
              ) : (
                <>
                  Send to the sales team <IconArrow size={16} sw={2} />
                </>
              )}
            </button>
            <p className="ar-fineprint">Demo only — nothing is sent from this page.</p>
          </form>
        )}
      </div>
    </Dialog>
  );
}
