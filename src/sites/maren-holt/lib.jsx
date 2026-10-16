import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useIsPresent } from 'motion/react';
import { unsplash } from '../../shared/img.js';
import { useEscape, useFocusTrap, useScrollLock } from '../../shared/a11y.js';
import { PHOTOS } from './data.js';

/* ---------- Images ---------- */

// Server-side crop at a given ratio (h / w) around the photo's focal point.
export function photoSrc(key, w, ratio) {
  const p = PHOTOS[key];
  const url = unsplash(p.id, { w, h: ratio ? Math.round(w * ratio) : undefined, q: 72, crop: 'focalpoint' });
  return `${url}&fp-x=${p.fpX ?? 0.5}&fp-y=${p.fpY}`;
}

export function photoSet(key, widths, ratio) {
  return widths.map(w => `${photoSrc(key, w, ratio)} ${w}w`).join(', ');
}

/* ---------- Reduced motion ---------- */

const RM = '(prefers-reduced-motion: reduce)';
const rmSubscribe = cb => {
  const mq = window.matchMedia(RM);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
/** Live prefers-reduced-motion flag (each Motion animation chooses its own reduced variant). */
export const useReduced = () => useSyncExternalStore(rmSubscribe, () => window.matchMedia(RM).matches, () => false);

/* ---------- Dialog plumbing ---------- */

// Focus trap, Escape and scroll lock that release as soon as an exit animation starts,
// so a dialog that opens another dialog hands focus over cleanly.
export function useDialog(ref, onClose) {
  const present = useIsPresent();
  useFocusTrap(ref, present);
  useEscape(present, onClose);
  useScrollLock(present);
}

/* ---------- Search highlighting ---------- */

export const terms = q =>
  q
    .toLowerCase()
    .split(/\s+/)
    .map(t => t.trim())
    .filter(Boolean);

export function highlight(text, ts) {
  if (!ts.length) return text;
  const esc = ts.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${esc.join('|')})`, 'gi');
  return text.split(re).map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part));
}

/* ---------- Demo forms ---------- */

/**
 * Small form state machine shared by every demo form.
 * - validates everything on submit, then each field on blur/change after the first submit
 * - focuses the first invalid field
 * - fakes a short network delay, then shows a success state (nothing is sent anywhere)
 */
export function useDemoForm(initial, validators, { delay = 900 } = {}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success
  const formRef = useRef(null);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const validateField = useCallback(
    (name, v, all) => {
      const fn = validators[name];
      return fn ? fn(v ?? '', all) || '' : '';
    },
    [validators]
  );

  const set = useCallback(
    (name, v) => {
      setValues(prev => {
        const next = { ...prev, [name]: v };
        if (submitted) setErrors(e => ({ ...e, [name]: validateField(name, v, next) }));
        return next;
      });
    },
    [submitted, validateField]
  );

  const bind = name => ({
    name,
    value: values[name] ?? '',
    onChange: e => set(name, e.target.value),
    onBlur: () => {
      if (submitted) setErrors(e => ({ ...e, [name]: validateField(name, values[name], values) }));
    },
  });

  const onSubmit = e => {
    e.preventDefault();
    if (status === 'loading') return;
    setSubmitted(true);
    const next = {};
    Object.keys(validators).forEach(k => {
      const msg = validateField(k, values[k], values);
      if (msg) next[k] = msg;
    });
    setErrors(next);
    const firstBad = Object.keys(validators).find(k => next[k]);
    if (firstBad) {
      formRef.current?.querySelector(`[name="${firstBad}"]`)?.focus();
      return;
    }
    setStatus('loading');
    timer.current = setTimeout(() => setStatus('success'), delay);
  };

  const reset = (keep = {}) => {
    setValues({ ...initial, ...keep });
    setErrors({});
    setSubmitted(false);
    setStatus('idle');
  };

  return { values, errors, status, bind, set, onSubmit, reset, formRef, setValues };
}

export const required = label => v => (String(v).trim() ? '' : `Please add ${label}.`);
