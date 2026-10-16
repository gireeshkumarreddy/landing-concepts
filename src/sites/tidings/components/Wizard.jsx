import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Dialog, { Field, fieldAria } from './Dialog.jsx';
import { useTidings } from '../hooks.jsx';
import { AUDIENCE_SIZES, COUNTRIES, PLANS, REGIONS, TEMPLATES } from '../data.js';
import { IconArrow, IconCheck, IconChevronLeft, Spinner } from '../icons.jsx';
import { unsplash } from '../../../shared/img.js';
import { prefersReducedMotion } from '../../../shared/gsap.js';

const STEP_NAMES = ['Your business', 'Message & list', 'Check & save'];
const defaultCountry = region => (region === 'UK' ? 'GB' : region === 'US' ? 'US' : '');
const phoneOk = v => /^\+\d{8,15}$/.test(v.replace(/\s+/g, ''));

function blank(region, plan) {
  return { business: '', phone: '', country: defaultCountry(region), template: '', audience: '', plan: plan || 'growth', name: '' };
}

function validate(step, d) {
  const e = {};
  if (step === 0) {
    if (d.business.trim().length < 2) e.business = 'Add the name customers know you by.';
    if (!d.phone.trim()) e.phone = 'Enter your WhatsApp Business number.';
    else if (!phoneOk(d.phone)) e.phone = 'Use international format: + then 8–15 digits, e.g. +44 7700 900456.';
    if (!d.country) e.country = 'Choose the country your number is registered in.';
  }
  if (step === 1) {
    if (!d.template) e.template = 'Pick a template to start from.';
    if (!d.audience) e.audience = 'Choose roughly how many contacts you’ll message.';
  }
  if (step === 2) {
    if (d.name.trim().length < 3) e.name = 'Name the campaign (3 characters or more).';
  }
  return e;
}

export default function Wizard({ open, plan, onClose }) {
  const { region } = useTidings();
  const [d, setD] = useState(() => blank(region, plan));
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [tried, setTried] = useState([false, false, false]);
  const [status, setStatus] = useState('idle');
  const [confirm, setConfirm] = useState(false);
  const initial = useRef(blank(region, plan));
  const headRef = useRef(null);
  const confirmRef = useRef(null);
  const timer = useRef();

  useEffect(() => {
    if (!open) return;
    const b = blank(region, plan);
    initial.current = b;
    setD(b);
    setStep(0);
    setTried([false, false, false]);
    setStatus('idle');
    setConfirm(false);
    return () => clearTimeout(timer.current);
    // region intentionally read once per opening
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, plan]);

  const errors = useMemo(() => (tried[step] ? validate(step, d) : {}), [tried, step, d]);
  const dirty = status !== 'saved' && JSON.stringify(d) !== JSON.stringify(initial.current);
  const set = k => e => setD(s => ({ ...s, [k]: e.target ? e.target.value : e }));

  const requestClose = () => {
    if (confirm) {
      setConfirm(false);
      return;
    }
    if (dirty) setConfirm(true);
    else onClose();
  };

  useEffect(() => {
    if (confirm) requestAnimationFrame(() => confirmRef.current?.focus());
  }, [confirm]);

  const focusHead = () => requestAnimationFrame(() => headRef.current?.focus({ preventScroll: true }));

  const go = n => {
    setDir(n > step ? 1 : -1);
    setStep(n);
    focusHead();
  };

  const next = () => {
    const e = validate(step, d);
    setTried(t => t.map((v, i) => (i === step ? true : v)));
    if (Object.keys(e).length) {
      requestAnimationFrame(() => {
        const el = document.querySelector('.ar-wizard [aria-invalid="true"]');
        el?.focus();
      });
      return;
    }
    if (step === 1 && !d.name) {
      const t = TEMPLATES.find(x => x.id === d.template);
      setD(s => ({ ...s, name: `${t.name} — ${s.business.trim()}` }));
    }
    go(step + 1);
  };

  const save = e => {
    e.preventDefault();
    const errs = validate(2, d);
    setTried(t => [t[0], t[1], true]);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => document.getElementById('ar-w-name')?.focus());
      return;
    }
    setStatus('saving');
    timer.current = setTimeout(() => {
      setStatus('saved');
      focusHead();
    }, 1000);
  };

  const restart = () => {
    const b = blank(region, d.plan);
    initial.current = b;
    setD(b);
    setTried([false, false, false]);
    setStatus('idle');
    setDir(-1);
    setStep(0);
    focusHead();
  };

  const tpl = TEMPLATES.find(t => t.id === d.template);
  const planObj = PLANS.find(p => p.id === d.plan);
  const price = planObj?.price ? `${REGIONS[region].symbol}${planObj.price[region]} / month` : 'Custom pricing';
  const reduced = prefersReducedMotion();
  const slide = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, x: 28 * dir },
    animate: { opacity: 1, x: 0 },
    exit: reduced ? { opacity: 0 } : { opacity: 0, x: -20 * dir },
    transition: { duration: 0.28, ease: [0.2, 0.7, 0.2, 1] },
  };

  return (
    <Dialog open={open} onRequestClose={requestClose} labelledBy="ar-wizard-title" size="lg" className="ar-wizard">
      <div className="ar-wizard-main" inert={confirm || undefined}>
      <div className="ar-wizard-head">
        <p className="ar-eyebrow">New campaign</p>
        <h2 id="ar-wizard-title" className="ar-modal-title">
          Launch a campaign
        </h2>
        <ol className="ar-steps" aria-label="Progress">
          {STEP_NAMES.map((n, i) => (
            <li
              key={n}
              className={`ar-step ${i === step && status !== 'saved' ? 'is-current' : ''} ${i < step || status === 'saved' ? 'is-done' : ''}`}
              aria-current={i === step && status !== 'saved' ? 'step' : undefined}
            >
              <span className="ar-step-dot" aria-hidden="true">
                {i < step || status === 'saved' ? <IconCheck size={12} sw={3} /> : i + 1}
              </span>
              <span className="ar-step-name">
                <span className="sr-only">Step {i + 1}: </span>
                {n}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="ar-wizard-body">
        <AnimatePresence mode="wait" initial={false}>
          {status === 'saved' ? (
            <motion.div key="saved" {...slide} className="ar-wizard-pane">
              <div className="ar-success is-large" role="status">
                <span className="ar-success-ico">
                  <IconCheck size={22} sw={2.4} />
                </span>
                <h3 ref={headRef} tabIndex={-1} className="ar-pane-title">
                  “{d.name.trim()}” is waiting in drafts
                </h3>
                <p>Campaign draft saved in this demo — nothing was sent and no account was created.</p>
                <div className="ar-wizard-actions is-center">
                  <button type="button" className="ar-btn ar-btn-ghost" onClick={restart}>
                    Start another
                  </button>
                  <button type="button" className="ar-btn ar-btn-blue" onClick={onClose}>
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          ) : step === 0 ? (
            <motion.div key="s0" {...slide} className="ar-wizard-pane">
              <h3 ref={headRef} tabIndex={-1} className="ar-pane-title">
                Who’s sending?
              </h3>
              <Field id="ar-w-business" label="Business name" error={errors.business}>
                <input {...fieldAria('ar-w-business', errors.business)} data-autofocus className="ar-input" autoComplete="organization" placeholder="e.g. Fern & Field" value={d.business} onChange={set('business')} />
              </Field>
              <div className="ar-grid-2">
                <Field id="ar-w-phone" label="WhatsApp Business number" error={errors.phone} hint="International format, e.g. +44 7700 900456">
                  <input {...fieldAria('ar-w-phone', errors.phone, true)} type="tel" inputMode="tel" autoComplete="tel" className="ar-input" placeholder="+44 7700 900456" value={d.phone} onChange={set('phone')} />
                </Field>
                <Field id="ar-w-country" label="Country" error={errors.country}>
                  <select {...fieldAria('ar-w-country', errors.country)} className="ar-input ar-select" value={d.country} onChange={set('country')}>
                    <option value="">Choose a country</option>
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </motion.div>
          ) : step === 1 ? (
            <motion.div key="s1" {...slide} className="ar-wizard-pane">
              <h3 ref={headRef} tabIndex={-1} className="ar-pane-title">
                Pick a message and a list size
              </h3>
              <fieldset className={`ar-fieldset ${errors.template ? 'has-error' : ''}`} aria-describedby={errors.template ? 'ar-w-tpl-err' : undefined}>
                <legend className="ar-label">Template</legend>
                <div className="ar-tpl-grid">
                  {TEMPLATES.map(t => (
                    <label key={t.id} className={`ar-tpl ${d.template === t.id ? 'is-on' : ''}`}>
                      <input
                        type="radio"
                        name="ar-w-template"
                        value={t.id}
                        checked={d.template === t.id}
                        onChange={() => setD(s => ({ ...s, template: t.id }))}
                        aria-invalid={errors.template ? true : undefined}
                        className="sr-only"
                      />
                      <span className="ar-tpl-thumb" aria-hidden="true">
                        {t.media ? (
                          <img src={unsplash(t.media, { w: 160, h: 100, q: 65 })} alt="" width="80" height="50" loading="lazy" decoding="async" />
                        ) : (
                          <span className={`ar-tpl-glyph is-${t.tone}`}>{t.glyph}</span>
                        )}
                      </span>
                      <span className="ar-tpl-name">{t.name}</span>
                      <span className="ar-tpl-desc">{t.desc}</span>
                      <span className="ar-tpl-check" aria-hidden="true">
                        <IconCheck size={12} sw={3} />
                      </span>
                    </label>
                  ))}
                </div>
                {errors.template && (
                  <p className="ar-error" id="ar-w-tpl-err">
                    {errors.template}
                  </p>
                )}
              </fieldset>
              <fieldset className={`ar-fieldset ${errors.audience ? 'has-error' : ''}`} aria-describedby={errors.audience ? 'ar-w-aud-err' : undefined}>
                <legend className="ar-label">Audience size</legend>
                <div className="ar-aud-grid">
                  {AUDIENCE_SIZES.map(a => (
                    <label key={a.id} className={`ar-aud ${d.audience === a.id ? 'is-on' : ''}`}>
                      <input
                        type="radio"
                        name="ar-w-audience"
                        value={a.id}
                        checked={d.audience === a.id}
                        onChange={() => setD(s => ({ ...s, audience: a.id }))}
                        aria-invalid={errors.audience ? true : undefined}
                        className="sr-only"
                      />
                      <span className="ar-aud-label">{a.label}</span>
                      <span className="ar-aud-note">{a.note}</span>
                    </label>
                  ))}
                </div>
                {errors.audience && (
                  <p className="ar-error" id="ar-w-aud-err">
                    {errors.audience}
                  </p>
                )}
              </fieldset>
            </motion.div>
          ) : (
            <motion.form key="s2" {...slide} className="ar-wizard-pane" onSubmit={save} noValidate id="ar-wizard-form">
              <h3 ref={headRef} tabIndex={-1} className="ar-pane-title">
                Check the details
              </h3>
              <Field id="ar-w-name" label="Campaign name" error={errors.name}>
                <input {...fieldAria('ar-w-name', errors.name)} className="ar-input" value={d.name} onChange={set('name')} />
              </Field>
              <dl className="ar-review">
                <div>
                  <dt>Business</dt>
                  <dd>{d.business.trim()}</dd>
                </div>
                <div>
                  <dt>Number</dt>
                  <dd>
                    {d.phone.trim()} · {COUNTRIES.find(c => c.code === d.country)?.name}
                  </dd>
                </div>
                <div>
                  <dt>Template</dt>
                  <dd>{tpl?.name}</dd>
                </div>
                <div>
                  <dt>Audience</dt>
                  <dd>{AUDIENCE_SIZES.find(a => a.id === d.audience)?.label} contacts</dd>
                </div>
                <div className="ar-review-plan">
                  <dt>
                    <label htmlFor="ar-w-plan">Plan</label>
                  </dt>
                  <dd>
                    <select id="ar-w-plan" className="ar-input ar-select is-compact" value={d.plan} onChange={set('plan')}>
                      {PLANS.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <span className="ar-review-price">{price}</span>
                  </dd>
                </div>
              </dl>
              <p className="ar-fineprint">Meta’s conversation fees are passed through at cost. Saving a draft sends nothing.</p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {status !== 'saved' && (
        <div className="ar-wizard-actions">
          {step > 0 ? (
            <button type="button" className="ar-btn ar-btn-ghost" onClick={() => go(step - 1)}>
              <IconChevronLeft size={16} sw={2} /> Back
            </button>
          ) : (
            <button type="button" className="ar-btn ar-btn-ghost" onClick={requestClose}>
              Cancel
            </button>
          )}
          <span className="ar-wizard-count" aria-hidden="true">
            Step {step + 1} of 3
          </span>
          {step < 2 ? (
            <button type="button" className="ar-btn ar-btn-blue" onClick={next}>
              Next <IconArrow size={16} sw={2} />
            </button>
          ) : (
            <button type="submit" form="ar-wizard-form" className="ar-btn ar-btn-blue" disabled={status === 'saving'}>
              {status === 'saving' ? (
                <>
                  <Spinner /> Saving…
                </>
              ) : (
                <>
                  Save draft <IconCheck size={16} sw={2.2} />
                </>
              )}
            </button>
          )}
        </div>
      )}
      </div>

      <AnimatePresence>
        {confirm && (
          <motion.div
            className="ar-confirm"
            role="alertdialog"
            aria-labelledby="ar-confirm-title"
            aria-describedby="ar-confirm-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="ar-confirm-card">
              <h3 id="ar-confirm-title" className="ar-pane-title">
                Leave without saving?
              </h3>
              <p id="ar-confirm-text">You’ve started this campaign. If you close now, what you entered will be cleared.</p>
              <div className="ar-wizard-actions is-center">
                <button ref={confirmRef} type="button" className="ar-btn ar-btn-ghost" onClick={() => setConfirm(false)}>
                  Keep editing
                </button>
                <button
                  type="button"
                  className="ar-btn ar-btn-danger"
                  onClick={() => {
                    setConfirm(false);
                    onClose();
                  }}
                >
                  Discard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
