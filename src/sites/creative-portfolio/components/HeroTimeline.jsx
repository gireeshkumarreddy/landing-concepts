import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../../shared/gsap.js';
import { unsplash } from '../../../shared/img.js';
import { FPS, PROJECTS, REEL_FRAMES, REEL_SECONDS, TYPE_TONE } from '../data.js';
import { clamp, timecode } from '../utils.js';
import { useMedia } from '../hooks.js';
import { IconArrowUpRight, IconPause, IconPlay } from '../icons.jsx';

const LAST = REEL_FRAMES - 1;
const segAt = f => {
  const s = f / FPS;
  const i = PROJECTS.findIndex(p => s >= p.seconds[0] && s < p.seconds[1]);
  return i < 0 ? PROJECTS.length - 1 : i;
};
const startOf = i => PROJECTS[i].seconds[0] * FPS;

function Monitor({ index, frame, playing, onOpen, style, monRef }) {
  const p = PROJECTS[index];
  const [a, b] = p.seconds;
  const local = clamp((frame / FPS - a) / (b - a), 0, 1);
  return (
    <button
      ref={monRef}
      type="button"
      className="pf-mon"
      data-cursor="Open"
      style={style}
      onClick={() => onOpen(p.id)}
      aria-label={`Open project: ${p.title}`}
    >
      <span className="pf-mon-frame">
        {PROJECTS.map((q, i) => (
          <img
            key={q.id}
            className={i === index ? 'is-on' : undefined}
            src={unsplash(q.img, { w: 420, h: 236 })}
            srcSet={`${unsplash(q.img, { w: 420, h: 236 })} 420w, ${unsplash(q.img, { w: 840, h: 472 })} 840w`}
            sizes="(min-width: 768px) 210px, 92vw"
            width="420"
            height="236"
            alt=""
            decoding="async"
            style={i === index ? { transform: `scale(${(1.03 + local * 0.09).toFixed(4)})` } : undefined}
          />
        ))}
        <span className="pf-mon-burn pf-mon-title">
          {String(index + 1).padStart(2, '0')} {p.title}
        </span>
        <span className="pf-mon-burn pf-mon-reel">
          {playing && <i className="pf-mon-live" />}
          {p.reel}
        </span>
        <span className="pf-mon-burn pf-mon-tc">{timecode(frame)}</span>
        <span className="pf-mon-open">
          Open film <IconArrowUpRight size={12} />
        </span>
      </span>
    </button>
  );
}

const TICKS = Array.from({ length: REEL_SECONDS / 2 + 1 }, (_, i) => i * 2);

export default function HeroTimeline({ onOpen }) {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(null);
  const [size, setSize] = useState({ w: 0, m: 0 });
  const wide = useMedia('(min-width: 768px)', true);

  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const monRef = useRef(null);
  const frameRef = useRef(0);
  const interacted = useRef(false);
  const visible = useRef(true);
  frameRef.current = frame;

  // Measure the track and the riding monitor so positions can be applied as transforms.
  useLayoutEffect(() => {
    const measure = () =>
      setSize({ w: trackRef.current?.offsetWidth || 0, m: monRef.current?.offsetWidth || 0 });
    measure();
    const ro = new ResizeObserver(measure);
    trackRef.current && ro.observe(trackRef.current);
    monRef.current && ro.observe(monRef.current);
    return () => ro.disconnect();
  }, [wide]);

  // Pause the loop while the hero is off screen.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting));
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);

  // Gentle autoplay shortly after load; never under reduced motion.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = setTimeout(() => !interacted.current && setPlaying(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf;
    let last = performance.now();
    let acc = frameRef.current;
    const tick = now => {
      // rAF timestamps can precede the performance.now() taken above, so never step backwards.
      const dt = clamp(now - last, 0, 80);
      last = now;
      if (visible.current && !document.hidden) {
        acc = (acc + (dt * FPS) / 1000) % REEL_FRAMES;
        const f = Math.floor(acc);
        if (f !== frameRef.current) setFrame(f);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const takeOver = () => {
    interacted.current = true;
    setPlaying(false);
  };

  const frameAt = useCallback(clientX => {
    const r = trackRef.current.getBoundingClientRect();
    return clamp(Math.round(((clientX - r.left) / r.width) * LAST), 0, LAST);
  }, []);

  const onPointerDown = e => {
    if (e.button !== 0) return;
    takeOver();
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setFrame(frameAt(e.clientX));
  };
  const onPointerMove = e => {
    if (dragging) {
      setFrame(frameAt(e.clientX));
      return;
    }
    if (e.pointerType === 'mouse') setHover(segAt(frameAt(e.clientX)));
  };
  const endDrag = () => setDragging(false);

  const onKeyDown = e => {
    const step = e.shiftKey ? 1 : FPS;
    const seg = segAt(frame);
    let f = frame;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        f += step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        f -= step;
        break;
      case 'PageDown':
        f = startOf(Math.min(PROJECTS.length - 1, seg + 1));
        break;
      case 'PageUp':
        f = frame - startOf(seg) > FPS ? startOf(seg) : startOf(Math.max(0, seg - 1));
        break;
      case 'Home':
        f = 0;
        break;
      case 'End':
        f = LAST;
        break;
      case ' ':
      case 'k':
        e.preventDefault();
        interacted.current = true;
        setPlaying(v => !v);
        return;
      default:
        return;
    }
    e.preventDefault();
    takeOver();
    setFrame(clamp(f, 0, LAST));
  };

  const index = segAt(frame);
  const project = PROJECTS[index];
  const x = (frame / LAST) * size.w;
  const monX = clamp(x - size.m / 2, 0, Math.max(0, size.w - size.m));

  return (
    <div className="pf-tl" ref={wrapRef}>
      <div className="pf-tl-stage">
        <Monitor
          index={index}
          frame={frame}
          playing={playing}
          onOpen={onOpen}
          monRef={monRef}
          style={wide ? { transform: `translate3d(${monX.toFixed(2)}px,0,0)` } : undefined}
        />
      </div>

      <div
        ref={trackRef}
        className={`pf-tl-track${dragging ? ' is-dragging' : ''}`}
        role="slider"
        tabIndex={0}
        aria-label="Reel timeline. Drag, or use the arrow keys to scrub; Page Up and Page Down jump between films."
        aria-valuemin={0}
        aria-valuemax={LAST}
        aria-valuenow={frame}
        aria-valuetext={`${timecode(frame)}, ${project.title}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => setHover(null)}
        onKeyDown={onKeyDown}
      >
        <div className="pf-tl-labels" aria-hidden="true">
          {[10, 20, 30, 40, 50].map(s => (
            <span key={s} className={`pf-tl-label${s % 20 ? ' is-minor' : ''}`} style={{ left: `${(s / REEL_SECONDS) * 100}%` }}>
              {timecode(s * FPS)}
            </span>
          ))}
        </div>
        <div className="pf-tl-ticks" aria-hidden="true">
          {TICKS.map(s => (
            <i
              key={s}
              className={`pf-tl-tick${s % 10 === 0 ? ' is-major' : ''}${s % 4 ? ' is-odd' : ''}`}
              style={{ left: `${(s / REEL_SECONDS) * 100}%` }}
            />
          ))}
        </div>
        <div className="pf-tl-clips" aria-hidden="true">
          {PROJECTS.map((p, i) => (
            <span
              key={p.id}
              className={`pf-tl-seg pf-tone-${TYPE_TONE[p.type]}${i === index ? ' is-current' : ''}${
                i === hover ? ' is-hover' : ''
              }`}
              style={{
                left: `${(p.seconds[0] / REEL_SECONDS) * 100}%`,
                width: `${((p.seconds[1] - p.seconds[0]) / REEL_SECONDS) * 100}%`,
              }}
            />
          ))}
        </div>
        {hover !== null && !dragging && (
          <span
            className="pf-tl-tip"
            aria-hidden="true"
            style={{
              left: `${(((PROJECTS[hover].seconds[0] + PROJECTS[hover].seconds[1]) / 2 / REEL_SECONDS) * 100).toFixed(3)}%`,
            }}
          >
            <b>{String(hover + 1).padStart(2, '0')}</b> {PROJECTS[hover].title}
            <em>{PROJECTS[hover].type}</em>
          </span>
        )}
        <span className="pf-tl-head" aria-hidden="true" style={{ transform: `translate3d(${x.toFixed(2)}px,0,0)` }}>
          <i />
        </span>
      </div>

      <div className="pf-tl-meta">
        <button
          type="button"
          className="pf-tl-play"
          onClick={() => {
            interacted.current = true;
            setPlaying(v => !v);
          }}
          aria-label={playing ? 'Pause reel' : 'Play reel'}
        >
          {playing ? <IconPause size={12} /> : <IconPlay size={12} />}
        </button>
        <span className="pf-tl-tc">{timecode(frame)}</span>
        <span className="pf-tl-now" aria-live="off">
          <i className={`pf-dot pf-tone-${TYPE_TONE[project.type]}`} />
          {project.title}
          <span className="pf-tl-type"> · {project.type}</span>
        </span>
        <span className="pf-tl-frames">
          FR {String(frame + 1).padStart(4, '0')}
          <span className="pf-tl-of"> / {REEL_FRAMES}</span>
          <span className="pf-tl-fps"> · {FPS} FPS</span>
        </span>
      </div>
    </div>
  );
}
