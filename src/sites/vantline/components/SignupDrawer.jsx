import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { isEmail, useEscape, useFocusTrap, useScrollLock } from '../../../shared/a11y.js';
import { PLANS, TEAM_SIZES, money, priceFor } from '../data.js';
import { Check, ChevronDown, Close } from '../icons.jsx';
import { BillingToggle } from './Pricing.jsx';
import Logo from './Logo.jsx';
import { useMediaQuery, useReducedPref } from './ui.jsx';

const EMPTY = { name: '', email: '', team: '', note: '' };

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Please enter your name.';
  if (!v.email.trim()) e.email = 'Please enter your work email.';
  else if (!isEmail(v.email)) e.email = 'That email doesn’t look complete. Check for typos, e.g. name@company.com.';
  if (!v.team) e.team = 'Choose your team size.';
  return e;
}

function Field({ id, label, error, hint, children }) {
  return (
    <div className={`au-field${error ? ' has-error' : ''}`}>
      <label className="au-field__label" htmlFor={id}>
        {label}
        {hint && <span className="au-field__hint">{hint}</span>}
      </label>
      {children}
      {error && (
        <p className="au-field__error" id={`${id}-err`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function SignupDrawer({ open, onClose, plan, onPlan, billing, onBilling }) {
  const panelRef = useRef(null);
  const formRef = useRef(null);
  const doneRef = useRef(null);
  const uid = useId();
  const sheet = useMediaQuery('(max-width: 767px)');
  const reduced = useReducedPref();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState('idle');

  useEscape(open, onClose);
  useFocusTrap(panelRef, open);
  useScrollLock(open);

  // Fresh form each time the drawer opens after a completed demo request.
  useEffect(() => {
    if (open && status === 'done') {
      setValues(EMPTY);
      setErrors({});
      setTried(false);
      setStatus('idle');
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (status === 'done') doneRef.current?.focus();
  }, [status]);

  const ids = { name: `${uid}-name`, email: `${uid}-email`, team: `${uid}-team`, note: `${uid}-note` };

  const set = k => e => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    // Once the person has tried to submit, clear errors as soon as a field becomes valid.
    if (tried && errors[k] && !validate(next)[k]) setErrors(({ [k]: _, ...rest }) => rest);
  };
  const blur = k => () => {
    if (!tried) return;
    const err = validate(values)[k];
    setErrors(prev => {
      const next = { ...prev };
      if (err) next[k] = err;
      else delete next[k];
      return next;
    });
  };

  const submit = e => {
    e.preventDefault();
    if (status === 'loading') return;
    setTried(true);
    const errs = validate(values);
    setErrors(errs);
    const first = ['name', 'email', 'team'].find(k => errs[k]);
    if (first) {
      formRef.current?.querySelector(`#${CSS.escape(ids[first])}`)?.focus();
      return;
    }
    setStatus('loading');
    setTimeout(() => setStatus('done'), 1100);
  };

  const aria = k => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${ids[k]}-err` : undefined,
  });

  const chosen = PLANS.find(p => p.id === plan) || PLANS[0];

  const panelMotion = sheet
    ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }
    : { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } };

  return (
    <AnimatePresence>
      {open && (
        <div className="au-drawer" key="drawer">
          <motion.div
            className="au-drawer__scrim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.35 }}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            className="au-drawer__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${uid}-title`}
            tabIndex={-1}
            data-autofocus
            {...panelMotion}
            transition={reduced ? { duration: 0 } : { duration: 0.6, ease: [0.2, 0.75, 0.15, 1] }}
          >
            <div className="au-drawer__head">
              <div>
                <p className="au-wordmark au-drawer__kicker">
                  <Logo />
                </p>
                <h2 className="au-drawer__title" id={`${uid}-title`}>
                  Start your <em>workspace</em>
                </h2>
              </div>
              <button type="button" className="au-drawer__close" onClick={onClose} aria-label="Close workspace form">
                <Close />
              </button>
            </div>

            {status === 'done' ? (
              <div className="au-done">
                <span className="au-done__icon" aria-hidden="true">
                  <Check />
                </span>
                <h3 className="au-done__title" tabIndex={-1} ref={doneRef}>
                  Saved, <em>in this demo only</em>
                </h3>
                <p className="au-done__text">
                  Workspace request saved in this demo only — no account was created.
                </p>
                <dl className="au-done__summary">
                  <div>
                    <dt>Plan</dt>
                    <dd>
                      {chosen.name} · {money(priceFor(chosen, billing))} per seat / month, billed {billing}
                    </dd>
                  </div>
                  <div>
                    <dt>Name</dt>
                    <dd>{values.name}</dd>
                  </div>
                  <div>
                    <dt>Team</dt>
                    <dd>{values.team}</dd>
                  </div>
                </dl>
                <button type="button" className="au-btn au-btn--dark" onClick={onClose}>
                  Close
                </button>
              </div>
            ) : (
              <form className="au-form" ref={formRef} onSubmit={submit} noValidate>
                <fieldset className="au-plans-pick">
                  <legend className="au-field__label">Plan</legend>
                  <div className="au-plans-pick__billing">
                    <BillingToggle billing={billing} onChange={onBilling} id="drawer" />
                  </div>
                  <div className="au-plans-pick__grid">
                    {PLANS.map(p => (
                      <label key={p.id} className={`au-pick${plan === p.id ? ' is-on' : ''}`}>
                        <input
                          type="radio"
                          name={`${uid}-plan`}
                          value={p.id}
                          checked={plan === p.id}
                          onChange={() => onPlan(p.id)}
                          className="au-pick__input"
                        />
                        <span className="au-pick__name">{p.name}</span>
                        <span className="au-pick__price">
                          {money(priceFor(p, billing))}
                          <small>/seat/mo</small>
                        </span>
                        <span className="au-pick__meta">{p.features[1]}</span>
                        <span className="au-pick__tick" aria-hidden="true">
                          <Check />
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <Field id={ids.name} label="Name" error={errors.name}>
                  <input
                    id={ids.name}
                    className="au-input"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={set('name')}
                    onBlur={blur('name')}
                    {...aria('name')}
                  />
                </Field>
                <Field id={ids.email} label="Work email" error={errors.email}>
                  <input
                    id={ids.email}
                    className="au-input"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={set('email')}
                    onBlur={blur('email')}
                    {...aria('email')}
                  />
                </Field>
                <Field id={ids.team} label="Team size" error={errors.team}>
                  <div className="au-select">
                    <select id={ids.team} className="au-input" value={values.team} onChange={set('team')} onBlur={blur('team')} {...aria('team')}>
                      <option value="" disabled>
                        Select a size
                      </option>
                      {TEAM_SIZES.map(t => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown />
                  </div>
                </Field>
                <Field id={ids.note} label="Which numbers should Vantline watch first?" hint="Optional">
                  <textarea
                    id={ids.note}
                    className="au-input au-input--area"
                    rows={3}
                    value={values.note}
                    onChange={set('note')}
                    placeholder="e.g. Trial-to-paid conversion and weekly churn"
                  />
                </Field>

                <div className="au-form__foot">
                  <button type="submit" className="au-btn au-btn--dark" aria-busy={status === 'loading'} disabled={status === 'loading'}>
                    {status === 'loading' ? (
                      <>
                        <span className="au-spinner" aria-hidden="true" /> Saving…
                      </>
                    ) : (
                      'Save request'
                    )}
                  </button>
                  <p className="au-form__note">Demo form. Nothing leaves this page.</p>
                </div>
                <p className="sr-only" aria-live="polite">
                  {status === 'loading' ? 'Saving your request' : ''}
                </p>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
