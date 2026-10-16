import { PEOPLE, initialsOf } from '../data.js';
import { face } from '../lib.js';

/**
 * Photo avatar when we have one, otherwise an initials tile — mixed, as real inboxes are.
 * `letter` forces the single-letter style used in the inbox sidebar.
 */
export default function Avatar({ id, person, size = 28, shape = 'circle', letter = false, eager = false, className = '' }) {
  const p = person || PEOPLE[id] || { name: '?' };
  const cls = `ta-av ta-av--${shape} ${className}`;
  const style = { '--ta-av': `${size}px` };
  if (p.photo && !letter) {
    const { src, srcSet } = face(p.photo, size);
    return (
      <img
        className={cls}
        style={style}
        src={src}
        srcSet={srcSet}
        width={size}
        height={size}
        alt=""
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }
  const text = letter ? p.letter || p.name[0] : initialsOf(p);
  return (
    <span className={`${cls} ta-av--text ta-av--${p.tone || (p.service ? 'service' : 'grey')}`} style={style} aria-hidden="true">
      {text}
    </span>
  );
}
