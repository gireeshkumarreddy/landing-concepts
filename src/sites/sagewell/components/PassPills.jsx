import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, MOTION_OK, useGSAP } from '../../../shared/gsap.js';
import { PASSES } from '../data.js';
import { IconCompare, IconFlag, IconPlan, IconSearch } from '../icons.jsx';

// One capsule per pass. Alternating sides, each in a different tone of the palette.
const PILLS = [
  { side: 'l', tone: 'moss', Icon: IconPlan },
  { side: 'r', tone: 'leaf', Icon: IconSearch },
  { side: 'l', tone: 'sand', Icon: IconCompare },
  { side: 'r', tone: 'ink', Icon: IconFlag },
];

const DOT_GAP = 11;

/** Offset of `el` measured inside `ancestor` (layout position, unaffected by transforms). */
function offsetWithin(el, ancestor) {
  let x = 0;
  let y = 0;
  let n = el;
  while (n && n !== ancestor) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent;
  }
  return { x, y };
}

/** Elbow path chip → gap → next chip, sampled into evenly spaced dots. */
function connectorDots(track) {
  const rows = [...track.querySelectorAll('.cr-pill')];
  const chips = rows.map(r => r.querySelector('.cr-pill__chip'));
  const pts = [];
  for (let i = 0; i < rows.length - 1; i++) {
    const a = offsetWithin(chips[i], track);
    const b = offsetWithin(chips[i + 1], track);
    const ac = { x: a.x + chips[i].offsetWidth / 2, y: a.y + chips[i].offsetHeight / 2 };
    const bc = { x: b.x + chips[i + 1].offsetWidth / 2, y: b.y + chips[i + 1].offsetHeight / 2 };
    const rowA = offsetWithin(rows[i], track);
    const rowB = offsetWithin(rows[i + 1], track);
    const midY = (rowA.y + rows[i].offsetHeight + rowB.y) / 2;
    pts.push(ac, { x: ac.x, y: midY }, { x: bc.x, y: midY }, bc);
  }
  const dots = [];
  let carry = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const p = pts[i];
    const q = pts[i + 1];
    const len = Math.hypot(q.x - p.x, q.y - p.y);
    for (let d = carry; d <= len; d += DOT_GAP) {
      const t = len ? d / len : 0;
      dots.push({ x: Math.round(p.x + (q.x - p.x) * t), y: Math.round(p.y + (q.y - p.y) * t) });
    }
    carry = len ? (DOT_GAP - ((len - carry) % DOT_GAP)) % DOT_GAP : carry;
  }
  return dots;
}

/**
 * Signature moment for the Research section: the four passes as long capsules on a track.
 * On entering view they slide in from alternating sides and stretch to width, the round chips
 * pop in, and a dotted thread stitches them together. Reduced motion shows the finished layout.
 */
export default function PassPills() {
  const trackRef = useRef(null);
  const [dots, setDots] = useState([]);

  // Measure the connector from the real layout and keep it in sync with resizes.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      setDots(connectorDots(track));
    };
    measure();
    const ro = new ResizeObserver(() => {
      if (!raf) raf = requestAnimationFrame(measure);
    });
    ro.observe(track);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rows = gsap.utils.toArray('.cr-pill', trackRef.current);
        const tl = gsap.timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: { trigger: trackRef.current, start: 'top 78%', once: true },
        });
        rows.forEach((row, i) => {
          const fromLeft = row.dataset.side === 'l';
          const at = i * 0.16;
          tl.from(row.querySelector('.cr-pill__bg'), { xPercent: fromLeft ? -55 : 55, scaleX: 0.28, opacity: 0, duration: 1.35 }, at)
            .from(row.querySelector('.cr-pill__word'), { x: fromLeft ? -80 : 80, opacity: 0, duration: 1.2 }, at + 0.18)
            .from(row.querySelector('.cr-pill__text'), { y: 12, opacity: 0, duration: 1 }, at + 0.42)
            .from(row.querySelector('.cr-pill__chip'), { scale: 0.2, opacity: 0, duration: 0.8, ease: 'power3.out' }, at + 0.55);
        });
        const dotEls = gsap.utils.toArray('.cr-pills__dot', trackRef.current);
        if (dotEls.length) tl.from(dotEls, { opacity: 0, scale: 0.4, duration: 0.35, ease: 'power2.out', stagger: { each: 1.4 / dotEls.length } }, 0.7);
      });
    },
    { scope: trackRef, dependencies: [dots.length > 0], revertOnUpdate: true }
  );

  return (
    <div className="cr-pills">
      <div className="cr-pills__track" ref={trackRef}>
        <div className="cr-pills__thread" aria-hidden="true">
          {dots.map((d, i) => (
            <span key={i} className="cr-pills__dot" style={{ left: d.x, top: d.y }} />
          ))}
        </div>
        <ol className="cr-pills__list" role="list" aria-label="The four passes">
        {PASSES.map((p, i) => {
          const { side, tone, Icon } = PILLS[i];
          return (
            <li key={p.title} className={`cr-pill cr-pill--${side} cr-pill--${tone}`} data-side={side}>
              <div className="cr-pill__shape">
                <span className="cr-pill__bg" aria-hidden="true" />
                <h3 className="cr-pill__word">
                  <span className="sr-only">Pass {i + 1}: </span>
                  {p.title}
                </h3>
                <p className="cr-pill__text">
                  <span className="cr-pill__line">{p.line}</span>
                  <span className="cr-pill__detail">{p.detail}</span>
                </p>
                <span className="cr-pill__chip" aria-hidden="true">
                  <Icon size={26} />
                  <span className="cr-pill__num">0{i + 1}</span>
                </span>
              </div>
            </li>
          );
        })}
        </ol>
      </div>
    </div>
  );
}
