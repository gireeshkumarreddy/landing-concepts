import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { isEmail } from '../../../shared/a11y.js';
import { FORMATS, TALKS } from '../data.js';
import { scrollToTarget } from '../../../shared/motion/index.js';
import { required, useDemoForm, useReduced } from '../lib.jsx';
import { ArrowRight, CheckIcon, GroupIcon, Spinner, UndoIcon } from '../icons.jsx';
import Field from './Field.jsx';

const today = () => {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const RULES = {
  name: required('your name'),
  email: v => (!v.trim() ? 'Please add your email.' : !isEmail(v) ? 'Enter a valid email, like name@example.com.' : ''),
  event: required('your group or organisation'),
  date: v => (!v ? 'Choose a preferred date.' : v < today() ? 'That date has already passed — pick a later one.' : ''),
  audience: v => (v ? '' : 'Choose roughly how many writers will attend.'),
};

const INITIAL = { name: '', email: '', event: '', date: '', audience: '', talk: '', message: '' };
const AUDIENCE = ['Up to 6 writers', '7–12 writers', '13–20 writers', 'More than 20 writers'];

function RequestForm({ talk, setTalk, formRef: outerRef }) {
  const f = useDemoForm(INITIAL, RULES, { delay: 1100 });
  const doneRef = useRef(null);

  useEffect(() => {
    f.set('talk', talk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [talk]);
  useEffect(() => {
    if (f.status === 'success') doneRef.current?.focus({ preventScroll: true });
  }, [f.status]);

  const loading = f.status === 'loading';

  if (f.status === 'success') {
    const picked = TALKS.find(t => t.id === f.values.talk);
    return (
      <div className="ch-formcard__done" ref={outerRef}>
        <span className="ch-donemark" aria-hidden="true">
          <CheckIcon size={20} />
        </span>
        <h3 tabIndex={-1} ref={doneRef} className="ch-h3">
          Request held — in this demo only.
        </h3>
        <p role="status">Nothing was sent. This is a concept page, so the details below stay on your screen.</p>
        <dl className="ch-summary">
          <div>
            <dt>Group</dt>
            <dd>{f.values.event}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{new Date(f.values.date + 'T12:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
          </div>
          <div>
            <dt>Workshop</dt>
            <dd>{picked ? picked.title : 'Undecided'}</dd>
          </div>
        </dl>
        <button
          type="button"
          className="ch-btn ch-btn--ghost"
          onClick={() => {
            f.reset();
            setTalk('');
          }}
        >
          <UndoIcon size={15} /> Start a new request
        </button>
      </div>
    );
  }

  return (
    <form ref={el => { f.formRef.current = el; if (outerRef) outerRef.current = el; }} noValidate onSubmit={f.onSubmit} className="ch-form" aria-labelledby="ch-talkform-title">
      <h3 className="ch-h3" id="ch-talkform-title">
        Request a workshop
      </h3>
      <div className="ch-form__grid">
        <Field id="ch-talk-name" label="Name" autoComplete="name" error={f.errors.name} readOnly={loading} {...f.bind('name')} />
        <Field id="ch-talk-email" label="Email" type="email" autoComplete="email" inputMode="email" error={f.errors.email} readOnly={loading} {...f.bind('email')} />
        <Field id="ch-talk-event" label="Group or organisation" className="ch-span2" error={f.errors.event} readOnly={loading} {...f.bind('event')} />
        <Field id="ch-talk-date" label="Preferred date" type="date" min={today()} error={f.errors.date} readOnly={loading} {...f.bind('date')} />
        <Field id="ch-talk-audience" as="select" label="Group size" error={f.errors.audience} disabled={loading} {...f.bind('audience')}>
          <option value="">Select…</option>
          {AUDIENCE.map(a => (
            <option key={a}>{a}</option>
          ))}
        </Field>
        <Field
          id="ch-talk-topic"
          as="select"
          label="Workshop"
          className="ch-span2"
          disabled={loading}
          {...f.bind('talk')}
          onChange={e => {
            f.set('talk', e.target.value);
            setTalk(e.target.value);
          }}
        >
          <option value="">Undecided — suggest one</option>
          {TALKS.map(t => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </Field>
        <Field id="ch-talk-msg" as="textarea" rows={3} label="Message (optional)" className="ch-span2" readOnly={loading} {...f.bind('message')} />
      </div>
      <div className="ch-form__foot">
        <p className="ch-note">Demo form: nothing leaves this page.</p>
        <button type="submit" className="ch-btn ch-btn--raised" aria-disabled={loading || undefined}>
          {loading ? (
            <>
              <Spinner /> Sending…
            </>
          ) : (
            <>
              Send the request <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {loading ? 'Sending the request…' : ''}
      </p>
    </form>
  );
}

export default function Workshops() {
  const [fmt, setFmt] = useState('All');
  const [talk, setTalk] = useState('');
  const formRef = useRef(null);
  const reduce = useReduced();
  const list = fmt === 'All' ? TALKS : TALKS.filter(t => t.formats.includes(fmt));

  const request = id => {
    setTalk(id);
    const el = formRef.current;
    if (!el) return;
    scrollToTarget(el, { offset: -Math.max(96, (window.innerHeight - el.offsetHeight) / 2) });
    setTimeout(() => el.querySelector('#ch-talk-name')?.focus({ preventScroll: true }), reduce ? 0 : 900);
  };

  return (
    <section className="ch-section ch-speaking" id="workshops" aria-labelledby="ch-speaking-title">
      <div className="ch-wrap ch-speak">
        <div className="ch-speak__main">
          <header className="ch-shead">
            <p className="ch-label" data-reveal="fade">
              <GroupIcon size={15} /> Workshops
            </p>
            <h2 className="ch-h2" id="ch-speaking-title" data-reveal="lines">
              Small rooms, real pages, practical change.
            </h2>
            <p className="ch-lede" data-reveal="fade" data-reveal-delay="0.15">
              Three sample workshops for writing groups, festivals and courses. Filter by format, then choose one to request.
            </p>
          </header>

          <LayoutGroup id="ch-formats">
            <div className="ch-chips" role="group" aria-label="Filter workshops by format" data-reveal="fade" data-reveal-delay="0.1">
              {['All', ...FORMATS].map(c => {
                const on = c === fmt;
                return (
                  <button key={c} type="button" className={`ch-chip ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => setFmt(c)}>
                    {on && <motion.span layoutId="ch-fmt-bg" className="ch-chip__bg" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }} />}
                    <span className="ch-chip__label">{c === 'All' ? 'Every format' : c}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
          <p className="sr-only" aria-live="polite">
            {`${list.length} ${list.length === 1 ? 'workshop' : 'workshops'} shown`}
          </p>

          <ol role="list" className="ch-talks" data-reveal="stagger" data-reveal-stagger="0.1">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map(t => {
                const n = TALKS.indexOf(t) + 1;
                return (
                  <motion.li
                    key={t.id}
                    layout={reduce ? false : 'position'}
                    className={`ch-talk ${talk === t.id ? 'is-picked' : ''}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                  >
                    <span className="ch-talk__num">0{n}</span>
                    <div className="ch-talk__body">
                      <h3 className="ch-talk__title">{t.title}</h3>
                      <p className="ch-talk__text">{t.text}</p>
                      <div className="ch-talk__foot">
                        <ul role="list" className="ch-tags" aria-label="Formats">
                          {t.formats.map(f => (
                            <li key={f} className={`ch-tag ${fmt === f ? 'is-match' : ''}`}>
                              {f}
                            </li>
                          ))}
                        </ul>
                        <button type="button" className="ch-textbtn ch-textbtn--strong" onClick={() => request(t.id)}>
                          {talk === t.id ? 'Chosen' : 'Request this one'}
                          <span className="sr-only">: {t.title}</span>
                          {talk === t.id ? <CheckIcon size={15} /> : <ArrowRight size={15} />}
                        </button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ol>
        </div>

        <aside className="ch-formcard" aria-label="Workshop request form" data-reveal="fade" data-reveal-delay="0.1">
          <RequestForm talk={talk} setTalk={setTalk} formRef={formRef} />
        </aside>
      </div>
    </section>
  );
}
