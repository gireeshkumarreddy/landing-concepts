import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../shared/gsap.js';
import { useEscape } from '../../shared/a11y.js';

/* ---------- Page-wide context: region + overlays ---------- */
export const TidingsCtx = createContext(null);
export const useTidings = () => useContext(TidingsCtx);

/* ---------- Animated numbers ---------- */
const easeOut = t => 1 - Math.pow(1 - t, 3);

/**
 * Tweens a number towards `target` whenever it changes (or when `active` flips on).
 * Jumps straight to the value for reduced-motion users.
 */
export function useCountUp(target, { duration = 900, active = true, from } = {}) {
  const [value, setValue] = useState(active ? (from ?? target) : 0);
  const current = useRef(value);
  useEffect(() => {
    if (!active) return;
    if (prefersReducedMotion()) {
      current.current = target;
      setValue(target);
      return;
    }
    const start = current.current;
    const t0 = performance.now();
    let raf;
    const tick = now => {
      const p = Math.min(1, (now - t0) / duration);
      const v = start + (target - start) * easeOut(p);
      current.current = v;
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

/** 0 → 1 over `duration` ms when `active`; restarts whenever `runKey` changes. */
export function useProgress(active, duration, runKey) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (prefersReducedMotion()) {
      setP(1);
      return;
    }
    setP(0);
    const t0 = performance.now();
    let raf;
    const tick = now => {
      const v = Math.min(1, (now - t0) / duration);
      setP(v);
      if (v < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, duration, runKey]);
  return p;
}

/* ---------- Disclosure dropdowns (nav menus, region picker) ---------- */
export function useDropdown() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  useEscape(open, () => {
    setOpen(false);
    btnRef.current?.focus();
  });

  const items = () => (panelRef.current ? [...panelRef.current.querySelectorAll('[data-dd-item]')] : []);

  const focusItem = useCallback(which => {
    requestAnimationFrame(() => {
      const list = items();
      if (!list.length) return;
      const el = which === 'last' ? list[list.length - 1] : list.find(n => n.getAttribute('aria-checked') === 'true') || list[0];
      el.focus();
    });
  }, []);

  const onButtonKeyDown = e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      focusItem(e.key === 'ArrowUp' ? 'last' : 'first');
    }
  };

  const onPanelKeyDown = e => {
    const list = items();
    const i = list.indexOf(document.activeElement);
    let next = null;
    if (e.key === 'ArrowDown') next = list[(i + 1) % list.length];
    else if (e.key === 'ArrowUp') next = list[(i - 1 + list.length) % list.length];
    else if (e.key === 'Home') next = list[0];
    else if (e.key === 'End') next = list[list.length - 1];
    if (next) {
      e.preventDefault();
      next.focus();
    }
  };

  const onWrapBlur = e => {
    if (wrapRef.current && !wrapRef.current.contains(e.relatedTarget)) setOpen(false);
  };

  return { open, setOpen, wrapRef, btnRef, panelRef, onButtonKeyDown, onPanelKeyDown, onWrapBlur };
}

/** Tracks whether the window has scrolled past a threshold. */
export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [threshold]);
  return scrolled;
}

/** Copies text to the clipboard, falling back to a hidden textarea. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Renders WhatsApp-style *bold* segments inside a string. */
export function richText(str, keyPrefix = 'r') {
  const parts = String(str).split(/(\*[^*\n]+\*)/g);
  return parts.map((p, i) =>
    p.startsWith('*') && p.endsWith('*') && p.length > 2 ? <strong key={`${keyPrefix}${i}`}>{p.slice(1, -1)}</strong> : p
  );
}
