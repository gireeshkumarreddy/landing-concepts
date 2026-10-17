import { useEffect, useRef } from 'react';
import { isEmail } from '../../../shared/a11y.js';
import { CONTACT_TOPICS } from '../data.js';
import { required, useDemoForm } from '../lib.jsx';
import { ArrowRight, CheckIcon, MailIcon, Spinner, UndoIcon } from '../icons.jsx';
import Field from './Field.jsx';

const RULES = {
  name: required('your name'),
  email: v => (!v.trim() ? 'Please add your email.' : !isEmail(v) ? 'Enter a valid email, like name@example.com.' : ''),
  message: v => (!v.trim() ? 'Tell me a little about the draft.' : v.trim().length < 12 ? 'Just a few more words — at least 12 characters.' : ''),
};

export default function Contact({ topic, setTopic }) {
  const f = useDemoForm({ name: '', email: '', message: '' }, RULES, { delay: 1000 });
  const doneRef = useRef(null);
  const loading = f.status === 'loading';

  useEffect(() => {
    if (f.status === 'success') doneRef.current?.focus({ preventScroll: true });
  }, [f.status]);

  return (
    <section className="ch-section ch-contact-sec" id="contact" aria-labelledby="ch-contact-title" data-bg="#fafaf9">
      <div className="ch-wrap">
        <div className="ch-contact" data-reveal="fade">
          <div className="ch-contact__intro">
            <p className="ch-label">
              <MailIcon size={15} /> Contact
            </p>
            <h2 className="ch-h2" id="ch-contact-title" data-reveal="lines" data-reveal-delay="0.15">
              Tell me about your draft.
            </h2>
            <p className="ch-lede">Where is the manuscript now, and what would you like it to become? A few lines is enough to begin.</p>
            <p className="ch-note">This form is a demo. Messages never leave the page.</p>
          </div>

          {f.status === 'success' ? (
            <div className="ch-contact__done">
              <span className="ch-donemark" aria-hidden="true">
                <CheckIcon size={20} />
              </span>
              <h3 className="ch-h3" tabIndex={-1} ref={doneRef}>
                Kept in this demo only.
              </h3>
              <p role="status">No message was sent, and nothing you typed has been stored.</p>
              <button type="button" className="ch-btn ch-btn--ghost" onClick={() => f.reset()}>
                <UndoIcon size={15} /> Start a new note
              </button>
            </div>
          ) : (
            <form ref={f.formRef} noValidate onSubmit={f.onSubmit} className="ch-form ch-contact__form">
              <fieldset className="ch-topics">
                <legend className="ch-field__label">I’m interested in</legend>
                <div className="ch-topics__opts">
                  {CONTACT_TOPICS.map(t => (
                    <label key={t} className={`ch-topic ${topic === t ? 'is-on' : ''}`}>
                      <input type="radio" name="topic" value={t} checked={topic === t} onChange={() => setTopic(t)} />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="ch-form__grid">
                <Field id="ch-contact-name" label="Name" autoComplete="name" error={f.errors.name} readOnly={loading} {...f.bind('name')} />
                <Field id="ch-contact-email" label="Email" type="email" autoComplete="email" inputMode="email" error={f.errors.email} readOnly={loading} {...f.bind('email')} />
                <Field id="ch-contact-msg" as="textarea" rows={4} label="Message" className="ch-span2" error={f.errors.message} readOnly={loading} {...f.bind('message')} />
              </div>
              <div className="ch-form__foot">
                <p className="ch-note">Demo only — nothing is sent.</p>
                <button type="submit" className="ch-btn ch-btn--raised" aria-disabled={loading || undefined}>
                  {loading ? (
                    <>
                      <Spinner /> Sending…
                    </>
                  ) : (
                    <>
                      Send the note <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
              <p className="sr-only" aria-live="polite">
                {loading ? 'Sending the note…' : ''}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
