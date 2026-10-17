import { scrollToTarget } from '../../shared/motion/index.js';
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

/** Glides to the contact section (shared smooth scroll) and focuses the first field once it lands. */
export function goToContact(e) {
  e?.preventDefault?.();
  const section = document.getElementById('contact');
  if (!section) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scrollToTarget(section, { immediate: reduce });
  history.replaceState?.(history.state, '', '#contact');
  setTimeout(() => document.getElementById('pf-f-name')?.focus({ preventScroll: true }), reduce ? 0 : 1350);
}

/** True on devices with a precise pointer that can hover. */
export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
