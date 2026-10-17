import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../../../shared/gsap.js';
import { getLenis } from '../../../shared/motion/index.js';
import { ARTICLES } from '../data.js';
import { photoSet, photoSrc } from '../lib.jsx';
import { ArrowRight, PapersIcon } from '../icons.jsx';

/*
 * Signature moment: essay cards ride a large circle whose upper half arcs over the intro copy.
 * One gsap.ticker loop places every card (position, tangent tilt, apex scale); it only runs while
 * the ring is on screen. The ring drifts on its own, and on fine pointers Lenis scroll velocity
 * speeds it up or reverses it. Hover or focus pauses it; focus also brings that card to the apex.
 */

const MOBILE_Q = '(max-width: 700px)';
const CFG = {
  desktop: { n: 14, w: 154, h: 192, apex: 1.18, side: 0.84, base: 4, gap: 112 },
  mobile: { n: 12, w: 96, h: 120, apex: 1.14, side: 0.88, base: 3, gap: 104 },
};
const VELOCITY_GAIN = 0.9; // deg/s per unit of Lenis velocity
const MAX_BOOST = 46; // deg/s

const useMobile = () => {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(MOBILE_Q).matches);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_Q);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return m;
};

export default function EssayArc({ onOpen }) {
  const mobile = useMobile();
  const cfg = mobile ? CFG.mobile : CFG.desktop;
  const stage = useRef(null);
  const items = useRef([]);
  const api = useRef({ pause: () => {}, resume: () => {}, focusSlot: () => {} });

  const slots = Array.from({ length: cfg.n }, (_, i) => ARTICLES[i % ARTICLES.length]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const reduce = prefersReducedMotion();
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !mobile;
    const step = 360 / cfg.n;
    const s = { phi: 0, speed: cfg.base, paused: false, focusing: false, R: 0, visible: false, tween: null };

    const render = () => {
      for (let i = 0; i < cfg.n; i++) {
        const node = items.current[i];
        if (!node) continue;
        let a = (i * step + s.phi) % 360;
        if (a > 180) a -= 360;
        if (a < -180) a += 360;
        const rad = (a * Math.PI) / 180;
        const c = Math.cos(rad);
        const scale = cfg.side + (cfg.apex - cfg.side) * Math.max(0, c) ** 2;
        node.style.transform = `translate3d(${(s.R * Math.sin(rad)).toFixed(2)}px, ${(-s.R * c).toFixed(2)}px, 0) rotate(${a.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      }
    };

    const layout = () => {
      const w = el.clientWidth;
      s.R = mobile ? Math.min(360, Math.max(290, w * 0.86)) : Math.min(580, Math.max(360, w * 0.43));
      const apexPad = (cfg.h * cfg.apex) / 2 + 28;
      el.style.setProperty('--arc-cy', `${Math.round(s.R + apexPad)}px`);
      el.style.setProperty('--arc-card-w', `${cfg.w}px`);
      el.style.setProperty('--arc-card-h', `${cfg.h}px`);
      el.style.setProperty('--arc-copy-top', `${Math.round(cfg.h * cfg.apex + 28 + cfg.gap)}px`);
      render();
    };

    const tick = (_t, dtMs) => {
      const d = Math.min(dtMs, 64) / 1000;
      let target = s.paused ? 0 : cfg.base;
      if (!s.paused && fine) {
        const v = getLenis()?.velocity || 0;
        target += gsap.utils.clamp(-MAX_BOOST, MAX_BOOST, v * VELOCITY_GAIN);
      }
      s.speed += (target - s.speed) * (1 - Math.exp(-d * 4));
      if (!s.focusing) s.phi = (s.phi + s.speed * d) % 360;
      render();
    };

    const start = () => !reduce && gsap.ticker.add(tick);
    const stop = () => gsap.ticker.remove(tick);

    api.current = {
      pause: () => (s.paused = true),
      resume: () => {
        s.paused = false;
        s.focusing = false;
      },
      // Bring slot i to the apex (keyboard focus), taking the short way round.
      focusSlot: i => {
        s.paused = true;
        s.focusing = true;
        const target = -i * step;
        const delta = ((((target - s.phi) % 360) + 540) % 360) - 180;
        s.tween?.kill();
        s.tween = gsap.to(s, { phi: s.phi + delta, duration: reduce ? 0 : 0.9, ease: 'power3.out', onUpdate: render });
      },
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting;
      s.visible ? start() : stop();
    });
    io.observe(el);

    return () => {
      stop();
      s.tween?.kill();
      ro.disconnect();
      io.disconnect();
    };
  }, [mobile, cfg]);

  return (
    <div className="ch-arc" ref={stage}>
      <div className="ch-arc__ring" data-reveal="fade" data-reveal-start="top 170%" role="group" aria-label="Essays on the ring">
        {slots.map((a, i) => {
          const dup = i >= ARTICLES.length;
          return (
            <button
              key={i}
              type="button"
              ref={node => (items.current[i] = node)}
              className="ch-arc__item"
              data-cursor="Read"
              data-slug={a.slug}
              aria-label={dup ? undefined : `Read “${a.title}”`}
              aria-hidden={dup || undefined}
              tabIndex={dup ? -1 : 0}
              onClick={() => onOpen(a.slug)}
              onPointerEnter={() => api.current.pause()}
              onPointerLeave={() => api.current.resume()}
              onFocus={() => api.current.focusSlot(i)}
              onBlur={() => api.current.resume()}
            >
              <span className="ch-arc__card">
                <img
                  src={photoSrc(a.photo, 360, 1.25)}
                  srcSet={photoSet(a.photo, [200, 360, 480], 1.25)}
                  sizes={`${cfg.w}px`}
                  width="360"
                  height="450"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
              </span>
            </button>
          );
        })}
      </div>

      <div className="ch-arc__copy">
        <p className="ch-label" data-reveal="fade">
          <PapersIcon size={15} /> From the Sunday notes
        </p>
        <h2 className="ch-arc__title" id="ch-articles-title" data-reveal="lines">
          Short reads for the <em>long</em> work of a book.
        </h2>
        <p className="ch-arc__lede" data-reveal="fade" data-reveal-delay="0.12">
          Pick one from the ring — each essay takes about two minutes and fixes one thing.
        </p>
        <div data-reveal="fade" data-reveal-delay="0.2">
          <span className="ch-magnet" data-magnetic="0.25">
            <a href="#essays-list" className="ch-btn ch-btn--raised ch-arc__cta">
              Browse all essays <ArrowRight size={16} />
            </a>
          </span>
        </div>
        <ul role="list" className="ch-arc__facts" data-reveal="fade" data-reveal-delay="0.28">
          <li>
            <strong>Eight essays</strong>
            <span>Sample writing for this concept</span>
          </li>
          <li>
            <strong>Four themes</strong>
            <span>From structure to the writing life</span>
          </li>
          <li>
            <strong>Two-minute reads</strong>
            <span>One idea you can use today</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

