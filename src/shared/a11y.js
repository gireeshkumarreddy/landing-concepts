import { useEffect, useRef } from 'react';
import { pauseScroll, resumeScroll } from './motion/smooth.js';

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Calls onEscape when Escape is pressed while `active`. */
export function useEscape(active, onEscape) {
  const cb = useRef(onEscape);
  cb.current = onEscape;
  useEffect(() => {
    if (!active) return;
    const onKey = e => {
      if (e.key === 'Escape') cb.current?.(e);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);
}

/**
 * Keeps Tab focus inside `ref` while active, focuses the first field on open
 * and returns focus to the element that opened it on close.
 */
export function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const node = ref.current;
    const opener = document.activeElement;
    const items = () => [...node.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null || el === document.activeElement);
    const first = node.querySelector('[data-autofocus]') || items()[0];
    const t = setTimeout(() => (first || node).focus({ preventScroll: true }), 30);
    const onKey = e => {
      if (e.key !== 'Tab') return;
      const list = items();
      if (!list.length) return;
      const [a, z] = [list[0], list[list.length - 1]];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    node.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      node.removeEventListener('keydown', onKey);
      if (opener && typeof opener.focus === 'function') opener.focus({ preventScroll: true });
    };
  }, [ref, active]);
}

/** Locks page scroll (used by modals and mobile menus) without layout shift. */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    const { body, documentElement } = document;
    const gap = window.innerWidth - documentElement.clientWidth;
    const prev = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    pauseScroll();
    return () => {
      resumeScroll();
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
    };
  }, [active]);
}

/** Basic email check used by every demo form. */
export const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());
