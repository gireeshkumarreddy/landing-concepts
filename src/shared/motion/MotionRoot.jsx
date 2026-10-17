import { useEffect, useRef } from 'react';
import { gsap } from '../gsap.js';
import { startSmoothScroll, stopSmoothScroll, scrollToTarget } from './smooth.js';

/**
 * Mounted once in App: starts smooth scrolling, routes plain in-page anchor links
 * through it, and renders the floating cursor label used by [data-cursor] elements.
 */
export default function MotionRoot() {
  const label = useRef(null);

  useEffect(() => {
    startSmoothScroll();

    // Plain <a href="#id"> links that no component handled get the same eased scroll.
    const onClick = e => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      const el = href === '#' || href === '#top' ? 0 : document.getElementById(decodeURIComponent(href.slice(1)));
      if (el == null) return;
      e.preventDefault();
      scrollToTarget(el);
      if (el !== 0) {
        if (!el.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
        history.replaceState(history.state, '', href);
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      stopSmoothScroll();
    };
  }, []);

  // Cursor label: a small pill that follows the pointer over [data-cursor="Label"] elements.
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const node = label.current;
    if (!fine.matches || !node) return;
    const xTo = gsap.quickTo(node, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(node, 'y', { duration: 0.45, ease: 'power3.out' });
    let current = null;
    const show = (host, x, y) => {
      const cs = getComputedStyle(host);
      node.textContent = host.getAttribute('data-cursor');
      node.style.setProperty('--ml-bg', cs.getPropertyValue('--cursor-bg').trim() || '#111');
      node.style.setProperty('--ml-fg', cs.getPropertyValue('--cursor-fg').trim() || '#fff');
      gsap.set(node, { x, y });
      gsap.to(node, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
    };
    const hide = () => gsap.to(node, { autoAlpha: 0, scale: 0.6, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
    const onMove = e => {
      const host = e.target.closest?.('[data-cursor]');
      if (host !== current) {
        current = host;
        host ? show(host, e.clientX, e.clientY) : hide();
      }
      if (host) {
        xTo(e.clientX);
        yTo(e.clientY);
      }
    };
    const onLeave = () => {
      current = null;
      hide();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, []);

  return <div ref={label} className="motion-cursor-label" aria-hidden="true" />;
}
