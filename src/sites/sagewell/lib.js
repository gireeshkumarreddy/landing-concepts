import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../shared/gsap.js';
import { scrollToTarget } from '../../shared/motion/index.js';

/** Page-level actions shared by sections (open the access modal, load a prompt, open a note). */
export const SagewellCtx = createContext(null);
export const useSagewell = () => useContext(SagewellCtx);

/** Motion transition that collapses to an instant change for reduced-motion users. */
export const tx = t => (prefersReducedMotion() ? { duration: 0 } : t);

/** Glides to a section through the shared smooth scroller ("top" scrolls to the page start). */
export function scrollToId(id) {
  scrollToTarget(`#${id}`);
}

/** Copies text with the async clipboard API, falling back to a hidden textarea. */
export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Returns [state, copy] where state is 'idle' | 'copied' | 'failed' for ~1.8s after copying. */
export function useCopy() {
  const [state, setState] = useState('idle');
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = useCallback(async text => {
    const ok = await copyText(text);
    setState(ok ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 1800);
  }, []);
  return [state, copy];
}

export function useMediaQuery(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return matches;
}

export const formatBytes = n => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
};

export const money = (v, digits) => {
  const d = digits ?? (v < 10 ? 2 : 0);
  return v.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: d, maximumFractionDigits: d });
};
