import { useEffect, useRef, useState } from 'react';
import { isEmail } from '../../../shared/a11y.js';
import { BUILD_OPTIONS } from '../data.js';
import { useCopy } from '../lib.js';
import { IconCheck, IconChevronDown, IconCopy } from '../icons.jsx';
import Modal from './Modal.jsx';

const EMPTY = { name: '', email: '', company: '', build: '', agree: false };

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Add the name we should use.';
  if (!v.email.trim()) e.email = 'Add a work email address.';
  else if (!isEmail(v.email)) e.email = 'This address looks incomplete — something like rowan@harbour.studio.';
  if (!v.build) e.build = 'Pick the closest match to your work.';
  if (!v.agree) e.agree = 'Tick the box to confirm this is a demo.';
  return e;
}

function demoKey() {
  const bytes = new Uint8Array(12);
  (window.crypto || {}).getRandomValues?.(bytes);
  return 'sw_demo_' + [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function AccessModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="cr-access-title" className="cr-access" sheet closeLabel="Close">
      <AccessForm onClose={onClose} />
    </Modal>
  );
}

function AccessForm({ onClose }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | done
  const [key, setKey] = useState('');
  const [copyState, copy] = useCopy();
  const formRef = useRef(null);
  const doneRef = useRef(null);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (status === 'done') doneRef.current?.focus();
  }, [status]);

  const set = (k, v) => {
    const next = { ...values, [k]: v };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };
  const blur = () => submitted && setErrors(validate(values));

  const onSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(values);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('loading');
    timer.current = setTimeout(() => {
      setKey(demoKey());
      setStatus('done');
    }, 900);
  };

  const fieldProps = name => ({
    id: `cr-f-${name}`,
    name,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `cr-f-${name}-err` : undefined,
    onBlur: blur,
  });

  const Err = ({ name }) =>
    errors[name] ? (
      <p className="cr-form__err" id={`cr-f-${name}-err`}>
        {errors[name]}
      </p>
    ) : null;

  if (status === 'done') {
    const masked = `${key.slice(0, 12)}${'•'.repeat(12)}${key.slice(-4)}`;
    return (
      <div className="cr-access__done" ref={doneRef} tabIndex={-1}>
        <span className="cr-access__ok" aria-hidden="true">
          <IconCheck size={18} />
        </span>
        <h2 id="cr-access-title" className="cr-access__title">
          Thank you, {values.name.trim().split(/\s+/)[0]}.
        </h2>
        <p className="cr-access__lede" role="status">
          Request saved in this demo only — no account was created and nothing was sent.
        </p>
        <div className="cr-key">
          <span className="cr-key__label">Sample preview key (decorative)</span>
          <code className="cr-key__value" aria-label="Sample key, partly hidden">
            {masked}
          </code>
          <button type="button" className="cr-btn cr-btn--ghost cr-btn--sm" onClick={() => copy(key)}>
            {copyState === 'copied' ? <IconCheck size={14} /> : <IconCopy size={14} />}
            {copyState === 'copied' ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="cr-access__fine">Generated in your browser for this demo. It unlocks nothing.</p>
        <button type="button" className="cr-btn cr-btn--ink" onClick={onClose}>
          Back to the page
        </button>
      </div>
    );
  }

  return (
    <form className="cr-form" ref={formRef} onSubmit={onSubmit} noValidate>
      <p className="cr-access__eyebrow">Preview programme</p>
      <h2 id="cr-access-title" className="cr-access__title">
        Request early access
      </h2>
      <p className="cr-access__lede">A few details about your work. This is a concept page, so the form stays in your browser.</p>

      <div className="cr-form__row">
        <div className="cr-form__field">
          <label htmlFor="cr-f-name">Name</label>
          <input
            {...fieldProps('name')}
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={e => set('name', e.target.value)}
            data-autofocus
          />
          <Err name="name" />
        </div>
        <div className="cr-form__field">
          <label htmlFor="cr-f-email">Work email</label>
          <input
            {...fieldProps('email')}
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={e => set('email', e.target.value)}
          />
          <Err name="email" />
        </div>
      </div>

      <div className="cr-form__field">
        <label htmlFor="cr-f-company">
          Organisation <span className="cr-form__opt">optional</span>
        </label>
        <input
          {...fieldProps('company')}
          type="text"
          autoComplete="organization"
          value={values.company}
          onChange={e => set('company', e.target.value)}
        />
      </div>

      <div className="cr-form__field">
        <label htmlFor="cr-f-build">What are you working on?</label>
        <span className="cr-select cr-select--block">
          <select {...fieldProps('build')} value={values.build} onChange={e => set('build', e.target.value)}>
            <option value="">Select an area</option>
            {BUILD_OPTIONS.map(o => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <IconChevronDown size={14} />
        </span>
        <Err name="build" />
      </div>

      <div className="cr-form__field cr-form__check">
        <input
          {...fieldProps('agree')}
          type="checkbox"
          checked={values.agree}
          onChange={e => set('agree', e.target.checked)}
        />
        <label htmlFor="cr-f-agree">I understand this is a design demo: no account is made and nothing is sent.</label>
        <Err name="agree" />
      </div>

      <button type="submit" className="cr-btn cr-btn--ink cr-btn--lg cr-form__submit" disabled={status === 'loading'}>
        {status === 'loading' ? (
          <>
            <span className="cr-spinner" aria-hidden="true" />
            Saving…
          </>
        ) : (
          'Save my request'
        )}
      </button>
      <p className="sr-only" role="status">
        {status === 'loading' ? 'Saving your request in this demo.' : ''}
      </p>
    </form>
  );
}
