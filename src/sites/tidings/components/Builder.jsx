import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import SectionHead from './SectionHead.jsx';
import Columns from './Columns.jsx';
import { PhoneFrame, Avatar, Ticks } from './Phone.jsx';
import { useTidings } from '../hooks.jsx';
import { MAX_CHARS, PEOPLE, PREVIEW_CONTACTS, SEGMENTS, TEMPLATES, fmt, templateLink } from '../data.js';
import { unsplash } from '../../../shared/img.js';
import { prefersReducedMotion } from '../../../shared/gsap.js';
import { IconCheck, IconChevronLeft, IconClock, IconExternal, IconPlus, IconSend } from '../icons.jsx';

const VARS = ['first_name', 'item', 'link'];
const valuesFor = (t, person) => ({ first_name: person.first, item: t.item, link: templateLink(t, person) });
const pad = n => String(n).padStart(2, '0');
const toLocalInput = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
const tomorrowNine = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return toLocalInput(d);
};
const niceDate = (v, long = true) =>
  new Date(v).toLocaleString('en-GB', { ...(long ? { weekday: 'short' } : {}), day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

/** Renders a template body with variables filled for one contact (plus *bold*). */
function renderBody(text, vals) {
  return String(text)
    .split(/(\{\{\s*[a-z_]+\s*\}\}|\*[^*\n]+\*)/gi)
    .map((part, i) => {
      const v = part.match(/^\{\{\s*([a-z_]+)\s*\}\}$/i);
      if (v) {
        const key = v[1].toLowerCase();
        if (!(key in vals)) return <span key={i} className="ar-var-bad" title="Unknown variable">{part}</span>;
        return (
          <span key={i} className={key === 'link' ? 'ar-fake-link' : 'ar-var-fill'}>
            {vals[key]}
          </span>
        );
      }
      if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) return <strong key={i}>{part.slice(1, -1)}</strong>;
      return part;
    });
}

function TemplateBubble({ tpl, body, vals, draft, at }) {
  return (
    <div className={`ar-bmsg ${draft ? 'is-draft' : ''}`}>
      {draft && <span className="ar-bmsg-flag">Live preview</span>}
      <div className="ar-msg-bubble">
        {tpl.media && (
          <div className="ar-msg-media">
            <img src={unsplash(tpl.media, { w: 480, h: 280, q: 70 })} alt={tpl.mediaAlt} width="240" height="140" loading="lazy" decoding="async" />
          </div>
        )}
        <p>{renderBody(body, vals)}</p>
        <span className="ar-msg-meta">
          {at}
          {!draft && <Ticks />}
          {draft && <IconClock size={12} sw={2} />}
        </span>
        <span className="ar-msg-action is-static">
          <IconExternal size={14} sw={2} />
          {tpl.button}
        </span>
      </div>
    </div>
  );
}

export default function Builder() {
  const { toast } = useTidings();
  const [tplId, setTplId] = useState('restock');
  const tpl = TEMPLATES.find(t => t.id === tplId);
  const [body, setBody] = useState(tpl.body);
  const [segs, setSegs] = useState(['regulars', 'recent', 'browsed', 'news']);
  const [schedule, setSchedule] = useState('now');
  const [when, setWhen] = useState(tomorrowNine);
  const [whenTouched, setWhenTouched] = useState(false);
  const [contactId, setContactId] = useState('priya');
  const [sent, setSent] = useState([]);
  const [error, setError] = useState('');
  const taRef = useRef(null);
  const scrollRef = useRef(null);
  const seq = useRef(0);

  const contact = PEOPLE[contactId];
  const vals = useMemo(
    () => valuesFor(tpl, contact),
    [contact, tpl]
  );
  const total = SEGMENTS.filter(s => segs.includes(s.id)).reduce((s, x) => s + x.count, 0);
  const whenError = schedule === 'later' && whenTouched && (!when || new Date(when) <= new Date()) ? 'Choose a date and time in the future.' : '';
  const nearLimit = body.length > MAX_CHARS - 80;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [sent.length, contactId, tplId]);

  const changeTemplate = id => {
    const t = TEMPLATES.find(x => x.id === id);
    setTplId(id);
    setBody(t.body);
    setError('');
  };

  const insert = name => {
    const el = taRef.current;
    const token = `{{${name}}}`;
    const start = el ? el.selectionStart : body.length;
    const end = el ? el.selectionEnd : body.length;
    const next = body.slice(0, start) + token + body.slice(end);
    if (next.length > MAX_CHARS) {
      setError(`That would go over the ${fmt(MAX_CHARS)}-character limit.`);
      return;
    }
    setBody(next);
    setError('');
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      el.setSelectionRange(start + token.length, start + token.length);
    });
  };

  const toggleSeg = id => setSegs(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));

  const sendTest = e => {
    e.preventDefault();
    if (!body.trim()) {
      setError('Write a message before sending a test.');
      taRef.current?.focus();
      return;
    }
    setError('');
    const at = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setSent(list => [...list.slice(-5), { id: ++seq.current, body, tplId, contactId, at }]);
    toast('Test shown in the preview only — nothing was sent.');
  };

  return (
    <section id="builder" className="ar-section ar-builder" aria-labelledby="ar-builder-title" data-bg="">
      <div className="ar-wrap">
        <SectionHead
          id="ar-builder-title"
          eyebrow="Campaign builder"
          title={
            <>
              Write it once.
              <br />
              It reads personal.
            </>
          }
          lead="Choose a template, drop in personal details and preview exactly what each customer sees — nothing leaves until you say so."
        />
        <div className="ar-builder-grid" data-reveal="stagger" data-reveal-stagger="0.12">
          <form className="ar-controls" onSubmit={sendTest} noValidate aria-label="Campaign settings">
            <div className="ar-ctl">
              <label htmlFor="ar-b-tpl" className="ar-label">
                Template
              </label>
              <select id="ar-b-tpl" className="ar-input ar-select" value={tplId} onChange={e => changeTemplate(e.target.value)}>
                {TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={`ar-ctl ${error ? 'has-error' : ''}`}>
              <div className="ar-ctl-row">
                <label htmlFor="ar-b-msg" className="ar-label">
                  Message
                </label>
                <span id="ar-b-count" className={`ar-count ${nearLimit ? 'is-warn' : ''}`}>
                  {fmt(body.length)} / {fmt(MAX_CHARS)}
                  <span className="sr-only"> characters</span>
                </span>
              </div>
              <textarea
                id="ar-b-msg"
                ref={taRef}
                className="ar-input ar-textarea ar-msg-input"
                rows={6}
                maxLength={MAX_CHARS}
                value={body}
                onChange={e => {
                  setBody(e.target.value);
                  if (error && e.target.value.trim()) setError('');
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={`ar-b-count${error ? ' ar-b-err' : ''}`}
                spellCheck="true"
              />
              <div className="ar-vars" role="group" aria-label="Insert a variable at the cursor">
                {VARS.map(v => (
                  <button key={v} type="button" className="ar-var-btn" onClick={() => insert(v)}>
                    <IconPlus size={13} sw={2.4} />
                    <code>{`{{${v}}}`}</code>
                  </button>
                ))}
              </div>
              {error && (
                <p className="ar-error" id="ar-b-err">
                  {error}
                </p>
              )}
            </div>

            <fieldset className="ar-ctl">
              <legend className="ar-label">Audience segments</legend>
              <div className="ar-chipset">
                {SEGMENTS.map(s => {
                  const on = segs.includes(s.id);
                  return (
                    <label key={s.id} className={`ar-check-chip ${on ? 'is-on' : ''}`}>
                      <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleSeg(s.id)} />
                      <span className="ar-check-box" aria-hidden="true">
                        <IconCheck size={11} sw={3} />
                      </span>
                      {s.label}
                      <span className="ar-check-count">{fmt(s.count)}</span>
                    </label>
                  );
                })}
              </div>
              <p className="ar-hint" aria-live="polite">
                {segs.length === 0 ? (
                  'Choose at least one segment to estimate recipients.'
                ) : (
                  <>
                    Estimated recipients: <strong>{segs.length > 1 ? `up to ${fmt(total)}` : fmt(total)}</strong>
                    {segs.length > 1 && '. Contacts in several segments get the message once.'}
                  </>
                )}
              </p>
            </fieldset>

            <div className="ar-ctl-split">
              <fieldset className="ar-ctl">
                <legend className="ar-label">Schedule</legend>
                <div className="ar-seg" role="radiogroup" aria-label="Schedule">
                  {[
                    ['now', 'Send now'],
                    ['later', 'Pick a time'],
                  ].map(([id, label]) => (
                    <label key={id} className={`ar-seg-opt ${schedule === id ? 'is-on' : ''}`}>
                      <input type="radio" name="ar-b-schedule" className="sr-only" checked={schedule === id} onChange={() => setSchedule(id)} />
                      {label}
                    </label>
                  ))}
                </div>
                <AnimatePresence initial={false}>
                  {schedule === 'later' && (
                    <motion.div
                      className="ar-when"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <label htmlFor="ar-b-when" className="sr-only">
                        Send at
                      </label>
                      <input
                        id="ar-b-when"
                        type="datetime-local"
                        className="ar-input"
                        value={when}
                        min={toLocalInput(new Date())}
                        onChange={e => {
                          setWhen(e.target.value);
                          setWhenTouched(true);
                        }}
                        onBlur={() => setWhenTouched(true)}
                        aria-invalid={whenError ? true : undefined}
                        aria-describedby={whenError ? 'ar-b-when-err' : undefined}
                      />
                      {whenError && (
                        <p className="ar-error" id="ar-b-when-err">
                          {whenError}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </fieldset>

              <fieldset className="ar-ctl">
                <legend className="ar-label">Preview as</legend>
                <div className="ar-people">
                  {PREVIEW_CONTACTS.map(p => (
                    <label key={p.id} className={`ar-person ${contactId === p.id ? 'is-on' : ''}`} title={p.name}>
                      <input type="radio" name="ar-b-contact" className="sr-only" checked={contactId === p.id} onChange={() => setContactId(p.id)} />
                      <Avatar person={p} size={30} />
                      <span>{p.first}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="ar-controls-foot">
              <button type="submit" className="ar-btn ar-btn-blue">
                Send test message <IconSend size={16} sw={2} />
              </button>
              <p className="ar-fineprint">Tests appear in the preview phone only — no customer receives anything.</p>
            </div>
          </form>

          <div className="ar-builder-stage">
            <Columns className="is-stage" specks={false} />
            <dl className="ar-bstats">
              <div>
                <dt>Recipients</dt>
                <dd>{segs.length === 0 ? '—' : segs.length > 1 ? `≤ ${fmt(total)}` : fmt(total)}</dd>
              </div>
              <div>
                <dt>Characters</dt>
                <dd>
                  {fmt(body.length)}
                  <small>/{fmt(MAX_CHARS)}</small>
                </dd>
              </div>
              <div>
                <dt>Sends</dt>
                <dd>{schedule === 'now' ? 'Now' : when ? niceDate(when, false) : '—'}</dd>
              </div>
            </dl>
            <PhoneFrame className="ar-phone--builder">
              <div className="ar-app is-full" role="region" aria-label={`Message preview for ${contact.name}`}>
                <div className="ar-conv">
                  <div className="ar-conv-head">
                    <span className="ar-conv-back is-static" aria-hidden="true">
                      <IconChevronLeft size={22} sw={2.2} />
                    </span>
                    <Avatar person={contact} size={36} />
                    <span className="ar-conv-who">
                      <span className="ar-conv-name">{contact.name}</span>
                      <span className="ar-conv-status">Template · {tpl.name}</span>
                    </span>
                  </div>
                  <div className="ar-conv-scroll" ref={scrollRef}>
                    <p className="ar-conv-day">
                      <span>{schedule === 'later' && when ? `Scheduled · ${niceDate(when)}` : 'Today'}</span>
                    </p>
                    <ol className="ar-conv-log" aria-label="Sent test messages" role="list">
                      <AnimatePresence initial={false}>
                        {sent.map(s => {
                          const t = TEMPLATES.find(x => x.id === s.tplId);
                          const c = PEOPLE[s.contactId];
                          return (
                            <motion.li
                              key={s.id}
                              className="ar-msg is-me is-rich"
                              initial={{ opacity: 0, y: 14, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                            >
                              <TemplateBubble
                                tpl={t}
                                body={s.body}
                                vals={valuesFor(t, c)}
                                at={s.at}
                              />
                            </motion.li>
                          );
                        })}
                      </AnimatePresence>
                    </ol>
                    <div className="ar-msg is-me is-rich">
                      <TemplateBubble tpl={tpl} body={body || ' '} vals={vals} draft at={schedule === 'now' ? 'Now' : 'Later'} />
                    </div>
                  </div>
                  <div className="ar-bfoot" aria-hidden="true">
                    <Avatar person={contact} size={20} />
                    Seen by {contact.first} · details filled in
                  </div>
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
