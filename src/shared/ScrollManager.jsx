import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Resets scroll on route change, and honours a #hash once the lazy page has rendered.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }
    let tries = 0;
    const id = decodeURIComponent(hash.slice(1));
    const timer = setInterval(() => {
      const el = document.getElementById(id);
      if (el || ++tries > 40) {
        clearInterval(timer);
        el?.scrollIntoView({ block: 'start' });
      }
    }, 50);
    return () => clearInterval(timer);
  }, [pathname, hash]);
  return null;
}
