import { useEffect, useState } from 'react';
import { scrollToTarget } from '../../shared/motion/index.js';
import { unsplash } from '../../shared/img.js';

/** Square, face-cropped Unsplash avatar at 1x / 2x. */
export function face(id, size) {
  const at = s => unsplash(id, { w: s, h: s, crop: 'faces', q: 70 });
  return { src: at(size * 2), srcSet: `${at(size)} 1x, ${at(size * 2)} 2x` };
}

/** Portrait-crop Unsplash photo (faces) at 1x / 2x for a w×h CSS box. */
export function portrait(id, w, h) {
  const at = s => unsplash(id, { w: Math.round(w * s), h: Math.round(h * s), crop: 'faces', q: 72 });
  return { src: at(2), srcSet: `${at(1)} 1x, ${at(2)} 2x` };
}

/** Subscribes to a media query. */
export function useMedia(query, initial = false) {
  const [match, setMatch] = useState(() =>
    typeof window === 'undefined' ? initial : window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

/**
 * Every waitlist call to action: glide to the form, then focus the email field and briefly
 * highlight the form once it is on screen (it fades in as it arrives). Works the same on mobile.
 */
export function goToWaitlist(event) {
  event?.preventDefault?.();
  const section = document.getElementById('waitlist');
  if (!section) return;
  scrollToTarget(section);
  cancelAnimationFrame(goToWaitlist.raf);
  const started = performance.now();
  const settle = () => {
    const form = document.getElementById('ta-ea-form');
    const target = document.getElementById('ta-ea-email') || document.getElementById('ta-ea-done');
    const r = form?.getBoundingClientRect();
    const onScreen = r && r.top < innerHeight * 0.8 && getComputedStyle(form).visibility !== 'hidden';
    if (onScreen || performance.now() - started > 2500) {
      target?.focus({ preventScroll: true });
      if (form) {
        form.classList.remove('is-flash');
        void form.offsetWidth; // restart the highlight animation
        form.classList.add('is-flash');
        window.clearTimeout(goToWaitlist.t);
        goToWaitlist.t = window.setTimeout(() => form.classList.remove('is-flash'), 1900);
      }
      return;
    }
    goToWaitlist.raf = requestAnimationFrame(settle);
  };
  goToWaitlist.raf = requestAnimationFrame(settle);
}

export const isMac = () =>
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/** Short time for a message header: drops the year. */
export const shortAt = at => at.replace(' 2026', '');
