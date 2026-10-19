import { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../../shared/gsap.js';
import { CHIP_EXAMPLES } from '../data.js';
import { formatBytes } from '../lib.js';
import { IconArrowRight, IconClose, IconFile, IconMic, IconPaperclip, IconPlus } from '../icons.jsx';

export const DEPTHS = [
  { id: 'brief', label: 'Brief' },
  { id: 'standard', label: 'Standard' },
  { id: 'thorough', label: 'Thorough' },
];

const MAX_LINES = 5;

/* ------------------------------------------------------------------ */
/* Rotating, typed placeholder (decorative; the textarea has a label)  */
/* ------------------------------------------------------------------ */
function TypedPlaceholder() {
  const phrases = CHIP_EXAMPLES.map(e => e.question);
  const [text, setText] = useState(phrases[0]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let timer;
    if (prefersReducedMotion()) {
      let n = 0;
      timer = setInterval(() => setText(phrases[(n = (n + 1) % phrases.length)]), 5000);
      return () => clearInterval(timer);
    }
    let idx = 0;
    let len = phrases[0].length;
    let phase = 'hold';
    const tick = () => {
      const full = phrases[idx];
      if (phase === 'hold') {
        phase = 'erase';
        setTyping(true);
        timer = setTimeout(tick, 30);
      } else if (phase === 'erase') {
        len = Math.max(0, len - 2);
        setText(full.slice(0, len));
        if (len === 0) {
          phase = 'type';
          idx = (idx + 1) % phrases.length;
          timer = setTimeout(tick, 380);
        } else timer = setTimeout(tick, 16);
      } else {
        const next = phrases[idx];
        len += 1;
        setText(next.slice(0, len));
        if (len >= next.length) {
          phase = 'hold';
          setTyping(false);
          timer = setTimeout(tick, 2600);
        } else timer = setTimeout(tick, 34 + Math.random() * 46);
      }
    };
    timer = setTimeout(tick, 3200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className="cr-composer__ph" aria-hidden="true">
      {text}
      <span className={`cr-composer__caret${typing ? ' is-on' : ''}`} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Dictation via the Web Speech API, with honest fallbacks             */
/* ------------------------------------------------------------------ */
const ERRORS = {
  'not-allowed': 'The microphone is blocked for this page. Allow it in your browser settings to dictate.',
  'service-not-allowed': 'Dictation is switched off in this browser.',
  'audio-capture': 'No microphone could be found.',
  'no-speech': 'Heard nothing that time. Tap the microphone to try again.',
  network: 'Dictation in this browser needs a network connection.',
};

function useDictation(getValue, setValue) {
  const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
  const [listening, setListening] = useState(false);
  const [note, setNote] = useState('');
  const rec = useRef(null);
  const noteTimer = useRef(0);

  const flash = useCallback(msg => {
    setNote(msg);
    clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNote(''), 5200);
  }, []);

  useEffect(
    () => () => {
      clearTimeout(noteTimer.current);
      try {
        rec.current?.abort();
      } catch {
        /* already stopped */
      }
    },
    []
  );

  const stop = useCallback(() => {
    try {
      rec.current?.stop();
    } catch {
      /* already stopped */
    }
  }, []);

  const toggle = useCallback(() => {
    if (!SR) {
      flash('This browser can’t take dictation. Type your question instead.');
      return;
    }
    if (rec.current) {
      stop();
      return;
    }
    const base = getValue().trimEnd();
    let r;
    try {
      r = new SR();
    } catch {
      flash('This browser can’t take dictation. Type your question instead.');
      return;
    }
    r.lang = navigator.language || 'en-US';
    r.continuous = true;
    r.interimResults = true;
    r.onresult = e => {
      let t = '';
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setValue((base ? base + ' ' : '') + t.trimStart());
    };
    r.onerror = e => {
      if (e.error !== 'aborted') flash(ERRORS[e.error] || 'Dictation stopped unexpectedly.');
    };
    r.onend = () => {
      rec.current = null;
      setListening(false);
    };
    rec.current = r;
    try {
      r.start();
      setNote('');
      setListening(true);
    } catch {
      rec.current = null;
      flash('Dictation couldn’t start. Try once more.');
    }
  }, [SR, flash, getValue, setValue, stop]);

  return { listening, note, toggle, stop };
}

/* ------------------------------------------------------------------ */
/* Composer                                                            */
/* ------------------------------------------------------------------ */
export default function Composer({ ref, onSubmit }) {
  const [value, setValue] = useState('');
  const [file, setFile] = useState(null);
  const [depth, setDepth] = useState('standard');
  const [menuOpen, setMenuOpen] = useState(false);
  const taRef = useRef(null);
  const fileRef = useRef(null);
  const plusRef = useRef(null);
  const popRef = useRef(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  const getValue = useCallback(() => valueRef.current, []);
  const dictation = useDictation(getValue, setValue);

  // Auto-grow up to MAX_LINES, then scroll inside. No data-lenis-prevent on the box: Lenis'
  // nested-scroll check hands it the wheel only while it can scroll, so the page still scrolls
  // over the composer (the attribute's overscroll containment also stopped touch swipes here).
  useLayoutEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    const cs = getComputedStyle(ta);
    const lh = parseFloat(cs.lineHeight) || 22;
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const max = lh * MAX_LINES + pad;
    ta.style.height = 'auto';
    const h = Math.min(ta.scrollHeight, max);
    ta.style.height = `${h}px`;
    ta.style.overflowY = ta.scrollHeight > max + 1 ? 'auto' : 'hidden';
  }, [value]);

  useImperativeHandle(
    ref,
    () => ({
      load(text) {
        setValue(text);
        const ta = taRef.current;
        if (!ta) return;
        ta.focus({ preventScroll: true });
        requestAnimationFrame(() => ta.setSelectionRange(text.length, text.length));
      },
      focus() {
        taRef.current?.focus({ preventScroll: true });
      },
    }),
    []
  );

  // Popover: outside click, Escape, focus-out.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = e => {
      if (!popRef.current?.contains(e.target) && !plusRef.current?.contains(e.target)) setMenuOpen(false);
    };
    const onKey = e => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setMenuOpen(false);
        plusRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => popRef.current?.querySelector('button')?.focus(), 20);
    return () => {
      clearTimeout(t);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    if (dictation.listening) dictation.stop();
    onSubmit({ text, depth, file });
    setValue('');
  };

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  const onFile = e => {
    const f = e.target.files?.[0];
    if (f) setFile({ name: f.name, size: f.size });
    e.target.value = '';
    taRef.current?.focus({ preventScroll: true });
  };

  const empty = !value.trim();
  const depthLabel = DEPTHS.find(d => d.id === depth)?.label;

  return (
    <form
      className={`cr-composer${dictation.listening ? ' is-listening' : ''}`}
      data-cr-intro="composer"
      onSubmit={e => {
        e.preventDefault();
        submit();
      }}
    >
      <label htmlFor="cr-prompt" className="sr-only">
        Ask Sagewell a question
      </label>
      <div className="cr-composer__field">
        <textarea
          id="cr-prompt"
          ref={taRef}
          className="cr-composer__input"
          rows={1}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          aria-describedby="cr-composer-hint"
          autoComplete="off"
          spellCheck="true"
        />
        {!value && <TypedPlaceholder />}
      </div>
      <p id="cr-composer-hint" className="sr-only">
        Enter asks the question; Shift and Enter starts a new line. Replies on this page are scripted samples.
      </p>

      <p className="cr-composer__note" role="status" aria-live="polite">
        {dictation.note}
      </p>

      <div className="cr-composer__bar">
        <div className="cr-composer__left">
          <div className="cr-plus-wrap">
            <button
              ref={plusRef}
              type="button"
              className={`cr-plus${menuOpen ? ' is-open' : ''}`}
              aria-label="Add a document or change thinking depth"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-controls="cr-composer-menu"
              onClick={() => setMenuOpen(o => !o)}
            >
              <IconPlus size={15} />
            </button>
            {menuOpen && (
              <div
                id="cr-composer-menu"
                ref={popRef}
                className="cr-pop"
                role="group"
                aria-label="Question options"
                onBlur={e => {
                  const n = e.relatedTarget;
                  if (n && !popRef.current?.contains(n) && n !== plusRef.current) setMenuOpen(false);
                }}
              >
                <button
                  type="button"
                  className="cr-pop__item"
                  onClick={() => {
                    setMenuOpen(false);
                    fileRef.current?.click();
                  }}
                >
                  <IconPaperclip size={18} />
                  <span>
                    <strong>Add a document</strong>
                    <small>Appears as a chip here; nothing is uploaded.</small>
                  </span>
                </button>
                <fieldset className="cr-pop__depth">
                  <legend>Thinking depth</legend>
                  <div className="cr-seg cr-seg--sm">
                    {DEPTHS.map(d => (
                      <label key={d.id} className={depth === d.id ? 'is-on' : ''}>
                        <input
                          type="radio"
                          name="cr-depth"
                          value={d.id}
                          checked={depth === d.id}
                          onChange={() => setDepth(d.id)}
                        />
                        <span>{d.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}
          </div>

          {file && (
            <span className="cr-chip-in" title={file.name}>
              <IconFile size={14} />
              <span className="cr-chip-in__name">{file.name}</span>
              <span className="cr-chip-in__meta">{formatBytes(file.size)}</span>
              <button type="button" aria-label={`Remove ${file.name}`} onClick={() => setFile(null)}>
                <IconClose size={12} />
              </button>
            </span>
          )}
          {depth !== 'standard' && (
            <span className="cr-chip-in cr-chip-in--depth">
              <span className="cr-chip-in__dot" aria-hidden="true" />
              {depthLabel} depth
              <button type="button" aria-label="Reset thinking depth to Standard" onClick={() => setDepth('standard')}>
                <IconClose size={12} />
              </button>
            </span>
          )}
        </div>

        <div className="cr-composer__right">
          {dictation.listening && (
            <span className="cr-listening" aria-hidden="true">
              Listening — tap to finish
            </span>
          )}
          <button
            type="button"
            className={`cr-mic${dictation.listening ? ' is-on' : ''}`}
            aria-label={dictation.listening ? 'Stop dictation' : 'Dictate a question'}
            aria-pressed={dictation.listening}
            onClick={dictation.toggle}
          >
            <IconMic size={16} />
          </button>
          <button type="submit" className="cr-send" aria-label="Ask Sagewell" disabled={empty}>
            <IconArrowRight size={16} />
          </button>
        </div>
      </div>

      <input ref={fileRef} type="file" className="sr-only" tabIndex={-1} aria-hidden="true" aria-label="Choose a document" onChange={onFile} />
    </form>
  );
}
