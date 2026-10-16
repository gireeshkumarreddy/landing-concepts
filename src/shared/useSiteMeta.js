import { useLayoutEffect } from 'react';

function setMeta(name, content) {
  let el = document.head.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  const previous = el.getAttribute('content');
  el.setAttribute('content', content);
  return () => el.setAttribute('content', previous ?? '');
}

/**
 * Per-route document setup: title, description, theme colour and the page
 * background (so overscroll and route transitions never flash another site's colour).
 */
export function useSiteMeta({ title, description, themeColor, background, colorScheme = 'light', site }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const prevTitle = document.title;
    document.title = title;
    const undo = [];
    if (description) undo.push(setMeta('description', description));
    if (themeColor) undo.push(setMeta('theme-color', themeColor));
    root.style.background = background || '';
    document.body.style.background = background || '';
    root.style.colorScheme = colorScheme;
    if (site) root.dataset.site = site;
    return () => {
      document.title = prevTitle;
      undo.forEach(fn => fn());
      root.style.background = '';
      document.body.style.background = '';
      root.style.colorScheme = '';
      delete root.dataset.site;
    };
  }, [title, description, themeColor, background, colorScheme, site]);
}
