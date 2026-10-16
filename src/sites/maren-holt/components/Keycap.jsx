import { BookmarkIcon, PenIcon, PencilIcon } from '../icons.jsx';

const GLYPHS = { pen: PenIcon, bookmark: BookmarkIcon, pencil: PencilIcon };

/** Briefly presses a keycap element (used by the typewriter and by keystrokes in the newsletter field). */
export function pressKey(el, ms = 140) {
  if (!el) return;
  el.classList.add('is-pressed');
  clearTimeout(el._chT);
  el._chT = setTimeout(() => el.classList.remove('is-pressed'), ms);
}

const down = e => {
  e.currentTarget.classList.add('is-pressed');
};
const up = e => {
  e.currentTarget.classList.remove('is-pressed');
};

/**
 * A CSS-built 3D keycap: a darker "skirt" (base) under a lighter rounded top face (cap).
 * Decorative (aria-hidden), but it presses under the pointer.
 */
export default function Keycap({ tone = 'white', glyph = 'pen', ref, className = '', ...rest }) {
  const Glyph = GLYPHS[glyph];
  return (
    <span
      ref={ref}
      className={`ch-key ch-key--${tone} ${className}`}
      aria-hidden="true"
      onPointerDown={down}
      onPointerUp={up}
      onPointerLeave={up}
      onPointerCancel={up}
      {...rest}
    >
      <span className="ch-key__tilt">
        <span className="ch-key__float">
          <span className="ch-key__base" />
          <span className="ch-key__cap">
            <span className="ch-key__face" />
            <Glyph className="ch-key__glyph" size={24} />
          </span>
        </span>
      </span>
    </span>
  );
}
