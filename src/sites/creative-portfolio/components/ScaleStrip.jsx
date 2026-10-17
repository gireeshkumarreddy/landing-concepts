import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../../shared/gsap.js';
import { unsplash } from '../../../shared/img.js';
import { PROJECTS } from '../data.js';
import { clamp } from '../utils.js';

// Frames on the strip: every film's still plus a few alternate frames from the same shoots.
// `ar` is width / height; `tc` is the frame's timecode in its film.
const byId = id => PROJECTS.find(p => p.id === id);
const FRAMES = [
  { project: 'coastline', img: '1541617219835-3689726fa8e7', ar: 1.5, tc: '00:00:21:08' },
  { project: 'afterglow', ar: 1.5, tc: '00:02:14:19' },
  { project: 'neon-hours', img: '1561344640-2453889cde5b', ar: 0.78, tc: '00:00:09:12' },
  { project: 'grandfathers-hands', ar: 0.8, tc: '00:06:42:03' },
  { project: 'backstreet-bloom', ar: 0.8, tc: '00:00:04:16' },
  { project: 'neon-hours', ar: 1, tc: '00:00:31:22' },
  { project: 'ocean-avenue', ar: 1.5, tc: '00:01:58:07' },
  { project: 'grandfathers-hands', img: '1587397845856-e6cf49176c70', ar: 0.8, tc: '00:14:05:11' },
  { project: 'coastline', ar: 1.25, tc: '00:00:12:04' },
  { project: 'afterglow', img: '1630769660701-3454835913dc', ar: 0.78, tc: '00:03:01:09' },
  { project: 'backstreet-bloom', img: '1599060052009-24d6d0b0161c', ar: 1.5, tc: '00:00:09:00' },
].map((f, i) => {
  const p = byId(f.project);
  return { ...f, key: `${f.project}-${i}`, img: f.img || p.img, title: p.title, type: p.type };
});

const N = FRAMES.length;
const MID = (N - 1) / 2;
const MIN_SCALE = 0.13;

/** Size curve: full size at the centre, falling away smoothly to a sliver at the edges. */
const scaleAt = (u, sigma) => MIN_SCALE + (1 - MIN_SCALE) * Math.exp(-(u * u) / (2 * sigma * sigma));

export default function ScaleStrip({ onOpen }) {
  const rootRef = useRef(null);
  const rowRef = useRef(null);
  const itemRefs = useRef([]);
  const dragRef = useRef(null);
  const [focus, setFocus] = useState(Math.round(MID));

  useEffect(() => {
    const root = rootRef.current;
    const items = itemRefs.current;
    const reduce = prefersReducedMotion();

    let baseH = 300;
    let sigma = 1.35;
    let width = root.clientWidth;
    let scrollF = MID; // driven by page scroll
    let userF = 0; // added by drag / horizontal wheel / keyboard focus
    let current = MID;
    let shown = -1;
    let running = false;
    const run = on => {
      if (on === running) return;
      running = on;
      if (on) gsap.ticker.add(tick);
      else gsap.ticker.remove(tick);
    };

    const measure = () => {
      width = root.clientWidth;
      const small = width < 640;
      baseH = small ? Math.min(230, width * 0.62) : clamp(width * 0.21, 240, 330);
      sigma = small ? 1.05 : 1.35;
    };

    const layout = f => {
      // Sizes first, then pack the scaled frames edge to edge around the focus point.
      const scales = FRAMES.map((_, i) => scaleAt(i - f, sigma));
      const widths = FRAMES.map((fr, i) => baseH * fr.ar * scales[i]);
      const gap = 6;
      const centres = [];
      let x = 0;
      widths.forEach((w, i) => {
        centres.push(x + w / 2);
        x += w + gap * scales[i];
      });
      const k = clamp(Math.floor(f), 0, N - 1);
      const t = clamp(f - k, 0, 1);
      const focusX = k + 1 < N ? centres[k] + (centres[k + 1] - centres[k]) * t : centres[k];
      const shift = width / 2 - focusX;
      items.forEach((el, i) => {
        if (!el) return;
        const w = baseH * FRAMES[i].ar;
        const s = scales[i];
        el.style.transform = `translate3d(${(centres[i] + shift - w / 2).toFixed(2)}px, -50%, 0) scale(${s.toFixed(4)})`;
        el.style.zIndex = String(100 - Math.round(Math.abs(i - f) * 10));
      });
      const idx = clamp(Math.round(f), 0, N - 1);
      if (idx !== shown) {
        shown = idx;
        setFocus(idx);
      }
    };

    const target = () => clamp(scrollF + userF, 0, N - 1);

    const tick = () => {
      const goal = target();
      current += (goal - current) * 0.14;
      if (Math.abs(goal - current) < 0.0005) current = goal;
      layout(current);
    };

    measure();
    // Frames have a fixed base size; only transforms change while animating.
    items.forEach((el, i) => {
      if (!el) return;
      el.style.width = `${baseH * FRAMES[i].ar}px`;
      el.style.height = `${baseH}px`;
    });
    layout(current);

    const resize = () => {
      measure();
      items.forEach((el, i) => {
        if (!el) return;
        el.style.width = `${baseH * FRAMES[i].ar}px`;
        el.style.height = `${baseH}px`;
      });
      layout(current);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(root);

    if (reduce) {
      // Static arrangement: the middle frame is largest; nothing moves.
      return () => ro.disconnect();
    }

    // The row slides with the page: scrubbed by ScrollTrigger, eased in one ticker callback
    // that only runs while the strip is on screen.
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => {
        scrollF = 0.6 + self.progress * (N - 2.2);
      },
      onToggle: self => run(self.isActive),
    });
    scrollF = 0.6 + st.progress * (N - 2.2);
    current = target();
    layout(current);
    run(st.isActive);

    // Drag (mouse, pen, touch) moves the row; vertical touch scrolling stays native.
    const pitch = () => baseH * 0.9;
    const onDown = e => {
      if (e.button !== 0) return;
      dragRef.current = { x: e.clientX, start: userF, moved: 0, id: e.pointerId };
    };
    const onMove = e => {
      const d = dragRef.current;
      if (!d || d.id !== e.pointerId) return;
      const dx = e.clientX - d.x;
      d.moved = Math.max(d.moved, Math.abs(dx));
      if (d.moved > 4 && !d.captured) {
        d.captured = true;
        root.setPointerCapture?.(e.pointerId);
        root.classList.add('is-dragging');
      }
      if (d.captured) userF = d.start - dx / pitch();
    };
    const onUp = () => {
      const d = dragRef.current;
      if (!d) return;
      if (d.captured) {
        root.classList.remove('is-dragging');
        // Settle on the nearest frame.
        userF = Math.round(target()) - scrollF;
        root.dataset.justDragged = '1';
        setTimeout(() => delete root.dataset.justDragged, 50);
      }
      dragRef.current = null;
    };
    const onWheel = e => {
      // Only sideways wheel/trackpad movement is taken; vertical wheel keeps scrolling the page.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      userF = clamp(userF + e.deltaX / (pitch() * 1.4), -N, N);
    };
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);
    root.addEventListener('wheel', onWheel, { passive: false });

    // Keyboard: focusing a frame brings it to the centre.
    const onFocus = e => {
      const i = items.indexOf(e.target.closest?.('.pf-strip-item'));
      if (i >= 0 && e.target.matches(':focus-visible')) userF = i - scrollF;
    };
    root.addEventListener('focusin', onFocus);

    return () => {
      ro.disconnect();
      st.kill();
      run(false);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerup', onUp);
      root.removeEventListener('pointercancel', onUp);
      root.removeEventListener('wheel', onWheel);
      root.removeEventListener('focusin', onFocus);
    };
  }, []);

  const f = FRAMES[focus];
  const projectIndex = PROJECTS.findIndex(p => p.id === f.project);

  return (
    <div className="pf-strip-wrap">
      <p className="pf-strip-k" aria-hidden="true">
        <span>Frames from the reel</span>
        <span>Scroll or drag</span>
      </p>
      <div className="pf-strip" ref={rootRef} role="group" aria-label="Frames from the reel. Select a frame to open its film.">
        <div className="pf-strip-row" ref={rowRef}>
          {FRAMES.map((fr, i) => (
            <button
              key={fr.key}
              ref={el => (itemRefs.current[i] = el)}
              type="button"
              className={`pf-strip-item${i === focus ? ' is-focus' : ''}`}
              data-cursor="Open"
              aria-label={`Open project: ${fr.title}, frame at ${fr.tc}`}
              onClick={e => {
                if (rootRef.current?.dataset.justDragged) {
                  e.preventDefault();
                  return;
                }
                onOpen(fr.project);
              }}
            >
              <img
                src={unsplash(fr.img, { w: Math.round(330 * fr.ar * 1.6), h: 528, q: 70 })}
                alt=""
                width={Math.round(330 * fr.ar)}
                height="330"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </button>
          ))}
        </div>
      </div>
      <p className="pf-strip-cap" aria-hidden="true">
        <span className="pf-strip-n">{String(projectIndex + 1).padStart(2, '0')}</span>
        <span className="pf-strip-t">{f.title}</span>
        <span className="pf-strip-tc">{f.tc}</span>
      </p>
    </div>
  );
}
