import { useRef, useState } from 'react';
import { unsplash, unsplashSrcSet } from '../../../shared/img.js';
import { clamp } from '../utils.js';
import { IconChevron } from '../icons.jsx';

/** Before/after grade comparison: flat camera log on the left, the finished grade on the right. */
export default function GradeSlider({ img, title }) {
  const [pos, setPos] = useState(50);
  const [drag, setDrag] = useState(false);
  const boxRef = useRef(null);

  const fromX = x => {
    const r = boxRef.current.getBoundingClientRect();
    return clamp(((x - r.left) / r.width) * 100, 0, 100);
  };

  const onKey = e => {
    const step = e.shiftKey ? 10 : 2;
    const map = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step };
    if (e.key in map) setPos(p => clamp(p + map[e.key], 0, 100));
    else if (e.key === 'Home') setPos(0);
    else if (e.key === 'End') setPos(100);
    else return;
    e.preventDefault();
  };

  const src = unsplash(img, { w: 1400, h: 788 });
  const srcSet = unsplashSrcSet(img, [700, 1000, 1400, 2000], { ratio: 0.5625 });
  const sizes = '(min-width: 1100px) 1000px, 94vw';
  const p = Math.round(pos);

  return (
    <figure className="pf-grade">
      <div
        ref={boxRef}
        className={`pf-grade-box${drag ? ' is-dragging' : ''}`}
        style={{ backgroundImage: `url(${unsplash(img, { w: 420, h: 236 })})` }}
        onPointerDown={e => {
          if (e.button !== 0) return;
          setDrag(true);
          e.currentTarget.setPointerCapture?.(e.pointerId);
          setPos(fromX(e.clientX));
        }}
        onPointerMove={e => drag && setPos(fromX(e.clientX))}
        onPointerUp={() => setDrag(false)}
        onPointerCancel={() => setDrag(false)}
      >
        <img
          className="pf-grade-img pf-grade-img--after"
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          width="1400"
          height="788"
          alt={`${title}, frame shown with the final grade.`}
          decoding="async"
        />
        <img
          className="pf-grade-img pf-grade-img--before"
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          width="1400"
          height="788"
          alt=""
          decoding="async"
          style={{ clipPath: `inset(0 ${(100 - pos).toFixed(2)}% 0 0)` }}
        />
        <span className="pf-grade-tag pf-grade-tag--l" aria-hidden="true">
          Log · S-Log3
        </span>
        <span className="pf-grade-tag pf-grade-tag--r" aria-hidden="true">
          Graded · Rec.709
        </span>
        <div className="pf-grade-rail" style={{ transform: `translateX(${pos.toFixed(2)}%)`, '--pos': pos }}>
          <span className="pf-grade-line" />
          <span
            className="pf-grade-knob"
            role="slider"
            tabIndex={0}
            aria-label="Grade comparison"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={p}
            aria-valuetext={`${p}% log, ${100 - p}% graded`}
            onKeyDown={onKey}
          >
            <IconChevron dir="left" size={12} sw={2} />
            <IconChevron dir="right" size={12} sw={2} />
          </span>
        </div>
      </div>
      <figcaption className="pf-grade-cap">
        <span>Before / after grade</span>
        <span>Drag the handle, or focus it and use the arrow keys.</span>
      </figcaption>
    </figure>
  );
}
