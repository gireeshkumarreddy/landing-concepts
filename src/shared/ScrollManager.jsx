import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis } from './motion/smooth.js';

// Resets scroll on route change, and honours a #hash once the lazy page has rendered.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      getLenis()?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }
    let tries = 0;
    const id = decodeURIComponent(hash.slice(1));
    const timer = setInterval(() => {
      const el = document.getElementById(id);
      if (el || ++tries > 40) {
        clearInterval(timer);
        if (!el) return;
        const lenis = getLenis();
        // Lenis applies scroll-padding-top itself, matching native scrollIntoView.
        lenis ? lenis.scrollTo(el, { immediate: true, force: true }) : el.scrollIntoView({ block: 'start' });
      }
    }, 50);
    return () => clearInterval(timer);
  }, [pathname, hash]);
  return null;
}
