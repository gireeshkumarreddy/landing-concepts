import { useEffect, useState } from 'react';
import { unsplash, unsplashSrcSet } from '../../../shared/img.js';
import { ArrowUpRight } from '../icons.jsx';

/** Unsplash photo with srcset. `ratio` = height / width of the crop requested from the CDN. */
export function Photo({ id, alt = '', widths = [480, 800, 1200, 1600], sizes = '100vw', ratio, priority = false, className, style, ...rest }) {
  const w = widths[Math.min(2, widths.length - 1)];
  return (
    <img
      className={className}
      style={style}
      src={unsplash(id, { w, h: ratio ? Math.round(w * ratio) : undefined })}
      srcSet={unsplashSrcSet(id, widths, { ratio })}
      sizes={sizes}
      alt={alt}
      width={w}
      height={Math.round(w * (ratio || 0.66))}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      {...rest}
    />
  );
}

/** Pill button with the round arrow chip. tone: 'light' (white pill, teal chip) | 'dark' (teal pill, ivory chip). */
export function PillButton({ as: Tag = 'button', tone = 'light', children, className = '', ...rest }) {
  const extra = Tag === 'button' && !rest.type ? { type: 'button' } : {};
  return (
    <Tag className={`au-pill au-pill--${tone} ${className}`} {...extra} {...rest}>
      <span className="au-pill__label">{children}</span>
      <span className="au-pill__chip" aria-hidden="true">
        <ArrowUpRight />
      </span>
    </Tag>
  );
}

/** Small rounded label that sits above a section heading. */
export function Eyebrow({ children, mark = 'plus' }) {
  return (
    <p className="au-eyebrow" data-reveal="fade">
      <span className={`au-eyebrow__mark au-eyebrow__mark--${mark}`} aria-hidden="true" />
      {children}
    </p>
  );
}

/** Reduced-motion preference. Motion's own 'user' mode logs a dev warning, so the page handles it itself. */
export const useReducedPref = () => useMediaQuery('(prefers-reduced-motion: reduce)');

export function useMediaQuery(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [match, setMatch] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}
