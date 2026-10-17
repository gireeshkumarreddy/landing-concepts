// App-wide smooth scrolling (Lenis) driven by the GSAP ticker so ScrollTrigger,
// scrubbed timelines and the scroll position stay in lockstep.
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../gsap.js';

let lenis = null;
let tick = null;

/** Ease used for programmatic scrolls (anchor links, "back to top"). */
const easeOutExpo = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export const getLenis = () => lenis;

export function startSmoothScroll() {
  if (lenis || typeof window === 'undefined' || prefersReducedMotion()) return lenis;
  lenis = new Lenis({
    lerp: 0.085, // ~1s glide, close to a "smooth: 1" scroll smoother
    wheelMultiplier: 0.95,
    smoothWheel: true,
    syncTouch: false, // keep native momentum on touch devices
    allowNestedScroll: true, // modals, chat lists and code panels scroll natively
  });
  lenis.on('scroll', ScrollTrigger.update);
  tick = time => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function stopSmoothScroll() {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  gsap.ticker.lagSmoothing(500, 33);
  lenis.destroy();
  lenis = null;
}

/** Pause/resume page scrolling (used by modals, drawers and menus). */
export const pauseScroll = () => lenis?.stop();
export const resumeScroll = () => lenis?.start();

const scrollPad = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 88;

/**
 * Smoothly scroll to an element, selector, "#id" or y position.
 * Falls back to native scrolling when Lenis is off (reduced motion).
 */
export function scrollToTarget(target, { offset, immediate = false, duration = 1.3 } = {}) {
  let el = target;
  if (typeof target === 'string') el = target === '#' || target === '#top' ? 0 : document.querySelector(target);
  if (el == null) return;
  if (lenis) {
    // Lenis aims at elements from its last-known scroll position, which only catches up with a native
    // scroll (focus, find-in-page, automation) on the next scroll event. Re-sync it before aiming.
    lenis.resize();
    // Lenis already subtracts the page's scroll-padding-top and the target's scroll-margin-top.
    lenis.scrollTo(el, { offset: offset ?? 0, immediate, duration, easing: easeOutExpo, force: true });
    return;
  }
  const off = offset ?? (typeof el === 'number' ? 0 : -scrollPad());
  const top = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY + off;
  window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' });
}
