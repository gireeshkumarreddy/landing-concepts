import { FPS } from './data.js';

const pad = n => String(n).padStart(2, '0');

/** Frames → SMPTE-style timecode HH:MM:SS:FF. */
export function timecode(frames, fps = FPS) {
  const f = Math.max(0, Math.floor(frames));
  const ff = f % fps;
  const s = Math.floor(f / fps);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(ff)}`;
}

/** Seconds → MM:SS for short labels. */
export const mmss = sec => `${pad(Math.floor(sec / 60))}:${pad(Math.round(sec) % 60)}`;

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/** Deterministic pseudo-random generator so waveforms are stable between renders. */
export function seeded(seed) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Scrolls to the contact section and puts focus on the first field once the scroll settles. */
export function goToContact(e) {
  e?.preventDefault?.();
  const section = document.getElementById('contact');
  const field = document.getElementById('pf-f-name');
  if (!section) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  section.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  if (!field) return;
  let done = false;
  const focus = () => {
    if (done) return;
    done = true;
    window.removeEventListener('scrollend', focus);
    field.focus({ preventScroll: true });
  };
  if ('onscrollend' in window && !reduce) {
    window.addEventListener('scrollend', focus, { once: true });
    setTimeout(focus, 1400);
  } else {
    setTimeout(focus, reduce ? 0 : 700);
  }
  if (history.replaceState) history.replaceState(null, '', '#contact');
}

/** True on devices with a precise pointer that can hover. */
export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
