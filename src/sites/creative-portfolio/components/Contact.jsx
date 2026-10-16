import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { isEmail } from '../../../shared/a11y.js';
import { BUDGETS, EMAIL, PROJECT_TYPES } from '../data.js';
import { IconArrowRight, IconCheck, IconChevron, IconCopy } from '../icons.jsx';

const EMPTY = { name: '', email: '', type: '', budget: '', deadline: '', message: '' };
const FIELDS = ['name', 'email', 'type', 'budget', 'deadline', 'message'];
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Add your name so I know who is writing.';
  if (!v.email.trim()) e.email = 'Add an email address so I can reply.';
  else if (!isEmail(v.email)) e.email = 'This email address looks incomplete. Is something missing?';
  if (!v.type) e.type = 'Choose the kind of film.';
  if (!v.budget) e.budget = 'Choose a budget, or “Still deciding”.';
  if (v.deadline && v.deadline < today()) e.deadline = 'Pick a date that is today or later.';
  if (v.message.trim().length < 20) e.message = 'Tell me a little about the footage (20 characters or more).';
  return e;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

const Err = ({ id, msg }) =>
  msg ? (
    <p className="pf-err" id={id}>
      {msg}
    </p>
  ) : null;

export default function Contact({ prefillType, prefillKey }) {
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState('idle');
  const [copied, setCopied] = useState(null);
  const formRef = useRef(null);
  const refocus = useRef(false);
  const nameRef = useCallback(el => {
    if (el && refocus.current) {
      refocus.current = false;
      el.focus();
    }
  }, []);

  useEffect(() => {
    if (prefillType) setV(s => ({ ...s, type: prefillType }));
  }, [prefillType, prefillKey]);

  // The success panel mounts after the form has faded out; focus its heading and keep it in view.
  const focusDone = useCallback(el => {
    if (!el) return;
    el.focus({ preventScroll: true });
    const r = el.getBoundingClientRect();
    if (r.top < 90 || r.bottom > window.innerHeight) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    }
  }, []);

  const set = (k, val) => {
    const next = { ...v, [k]: val };
    setV(next);
    if (tried) setErrors(validate(next));
  };
  const blur = () => tried && setErrors(validate(v));

  const submit = e => {
    e.preventDefault();
    setTried(true);
    const errs = validate(v);
    setErrors(errs);
    const firstBad = FIELDS.find(k => errs[k]);
    if (firstBad) {
      const el = formRef.current.querySelector(`[data-field="${firstBad}"]`);
      el?.focus();
      return;
    }
    setStatus('loading');
    setTimeout(() => setStatus('done'), 1100);
  };

  const reset = () => {
    setV(EMPTY);
    setErrors({});
    setTried(false);
    refocus.current = true;
    setStatus('idle');
  };

  const copy = async () => {
    const ok = await copyText(EMAIL);
    setCopied(ok ? 'ok' : 'fail');
    setTimeout(() => setCopied(null), 2400);
  };

  const a = k => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `pf-e-${k}` : undefined,
  });

  return (
    <section id="contact" className="pf-sec pf-contact" aria-labelledby="pf-contact-title">
      <div className="pf-wrap pf-contact-grid">
        <div className="pf-contact-copy">
          <p className="pf-eyebrow pf-reveal">
            <span className="pf-eyebrow-n">05</span> Contact
          </p>
          <h2 id="pf-contact-title" className="pf-h2 pf-h2--xl pf-reveal">
            Send me <span className="pf-h2-soft">the footage.</span>
          </h2>
          <p className="pf-lede pf-reveal">
            A few lines are enough: what you shot, how long it should run and where it will be seen. I’ll come back
            with questions, a rough schedule and a quote.
          </p>

          <div className="pf-mail pf-reveal">
            <span className="pf-mail-k">Email</span>
            <span className="pf-mail-v">{EMAIL}</span>
            <button type="button" className="pf-mail-copy" onClick={copy}>
              {copied === 'ok' ? <IconCheck size={14} /> : <IconCopy size={14} />}
              {copied === 'ok' ? 'Copied' : copied === 'fail' ? 'Copy failed' : 'Copy email'}
            </button>
            <span className="sr-only" aria-live="polite">
              {copied === 'ok' ? 'Email address copied to clipboard.' : copied === 'fail' ? 'Could not copy. Select the address manually.' : ''}
            </span>
            <p className="pf-mail-note">Placeholder address for this concept — it doesn’t receive mail.</p>
          </div>
        </div>

        <div className="pf-contact-panel pf-reveal">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'done' ? (
              <motion.div
                key="done"
                className="pf-done"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="pf-done-icon" aria-hidden="true">
                  <IconCheck size={20} />
                </span>
                <h3 className="pf-done-h" tabIndex={-1} ref={focusDone}>
                  Thanks — this is a portfolio demo, so your message wasn’t sent.
                </h3>
                <p className="pf-done-p">
                  Nothing was stored either, {v.name.trim().split(' ')[0]}. On a real project, this is where you would get a
                  reply with a few questions and a rough schedule.
                </p>
                <dl className="pf-done-sum">
                  <div>
                    <dt>Film</dt>
                    <dd>{v.type}</dd>
                  </div>
                  <div>
                    <dt>Budget</dt>
                    <dd>{v.budget}</dd>
                  </div>
                  {v.deadline && (
                    <div>
                      <dt>Deadline</dt>
                      <dd>{v.deadline}</dd>
                    </div>
                  )}
                </dl>
                <button type="button" className="pf-btn pf-btn--ghost" onClick={reset}>
                  Write another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                className="pf-form"
                noValidate
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                aria-describedby="pf-form-note"
              >
                <div className="pf-row2">
                  <div className="pf-field">
                    <label htmlFor="pf-f-name">Name</label>
                    <input
                      id="pf-f-name"
                      ref={nameRef}
                      data-field="name"
                      type="text"
                      autoComplete="name"
                      value={v.name}
                      onChange={e => set('name', e.target.value)}
                      onBlur={blur}
                      {...a('name')}
                    />
                    <Err id="pf-e-name" msg={errors.name} />
                  </div>
                  <div className="pf-field">
                    <label htmlFor="pf-f-email">Email</label>
                    <input
                      id="pf-f-email"
                      data-field="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={v.email}
                      onChange={e => set('email', e.target.value)}
                      onBlur={blur}
                      {...a('email')}
                    />
                    <Err id="pf-e-email" msg={errors.email} />
                  </div>
                </div>

                <fieldset className="pf-field pf-typeset">
                  <legend>Project type</legend>
                  <div className="pf-typechips">
                    {PROJECT_TYPES.map((t, i) => (
                      <label key={t} className="pf-typechip">
                        <input
                          type="radio"
                          name="pf-type"
                          value={t}
                          data-field={i === 0 ? 'type' : undefined}
                          checked={v.type === t}
                          onChange={() => set('type', t)}
                          onBlur={blur}
                          {...a('type')}
                        />
                        <span>{t}</span>
                      </label>
                    ))}
                  </div>
                  <Err id="pf-e-type" msg={errors.type} />
                </fieldset>

                <div className="pf-row2">
                  <div className="pf-field">
                    <label htmlFor="pf-f-budget">Budget</label>
                    <div className="pf-select">
                      <select
                        id="pf-f-budget"
                        data-field="budget"
                        value={v.budget}
                        onChange={e => set('budget', e.target.value)}
                        onBlur={blur}
                        {...a('budget')}
                      >
                        <option value="">Select a range</option>
                        {BUDGETS.map(b => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                      <IconChevron dir="down" size={14} />
                    </div>
                    <Err id="pf-e-budget" msg={errors.budget} />
                  </div>
                  <div className="pf-field">
                    <label htmlFor="pf-f-deadline">
                      Deadline <span className="pf-opt">optional</span>
                    </label>
                    <input
                      id="pf-f-deadline"
                      data-field="deadline"
                      type="date"
                      min={today()}
                      value={v.deadline}
                      onChange={e => set('deadline', e.target.value)}
                      onBlur={blur}
                      {...a('deadline')}
                    />
                    <Err id="pf-e-deadline" msg={errors.deadline} />
                  </div>
                </div>

                <div className="pf-field">
                  <label htmlFor="pf-f-message">Message</label>
                  <textarea
                    id="pf-f-message"
                    data-field="message"
                    rows={5}
                    placeholder="What did you shoot, how long should it run, and where will people watch it?"
                    value={v.message}
                    onChange={e => set('message', e.target.value)}
                    onBlur={blur}
                    {...a('message')}
                  />
                  <Err id="pf-e-message" msg={errors.message} />
                </div>

                <div className="pf-form-end">
                  <p className="pf-form-note" id="pf-form-note">
                    Demo only: nothing is sent or saved.
                  </p>
                  <button type="submit" className="pf-btn pf-btn--signal pf-btn--lg" disabled={status === 'loading'}>
                    {status === 'loading' ? (
                      <>
                        <span className="pf-spin" aria-hidden="true" /> Sending…
                      </>
                    ) : (
                      <>
                        Send message <IconArrowRight size={14} />
                      </>
                    )}
                  </button>
                  <span className="sr-only" aria-live="polite">
                    {status === 'loading' ? 'Sending your message.' : ''}
                  </span>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
