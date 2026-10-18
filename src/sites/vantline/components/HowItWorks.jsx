import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, useGSAP, MOTION_OK, prefersReducedMotion } from '../../../shared/gsap.js';
import { STEPS } from '../data.js';
import { ArrowLeft, ArrowRight } from '../icons.jsx';
import { Eyebrow, Photo, PillButton, useMediaQuery } from './ui.jsx';

const N = STEPS.length;
const wrap = i => ((i % N) + N) % N;
// Signed distance from the active card on a loop: -2 … 2 for five cards.
const offsetOf = (i, active) => {
  let d = wrap(i - active);
  if (d > N / 2) d -= N;
  return d;
};
// Keep a continuous slot value inside (-2.5, 2.5]; cards crossing the back of the loop wrap while invisible.
const wrapSlot = d => (d > N / 2 ? d - N : d <= -N / 2 ? d + N : d);
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = v => Math.max(0, Math.min(1, v));
const easeInOut = gsap.parseEase('power2.inOut');
const easeIn = gsap.parseEase('power1.in');

/**
 * Scroll progress through the deck (0 = deck top at the viewport bottom, 1 = deck bottom at the top)
 * mapped to how far the fan is open: stacked while it enters, fully spread around the centre,
 * easing partly closed again as it leaves.
 */
function spreadFor(t) {
  if (t <= 0.1) return 0;
  if (t < 0.44) return easeInOut((t - 0.1) / 0.34);
  if (t <= 0.62) return 1;
  return 1 - 0.6 * easeIn(clamp01((t - 0.62) / 0.38));
}

export default function HowItWorks() {
  const ref = useRef(null);
  const deckRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const btnRefs = useRef([]);
  const focusAfter = useRef(false);
  const [active, setActive] = useState(0);
  const [size, setSize] = useState(0);
  const mobile = useMediaQuery('(max-width: 767px)');

  // Fan state: `open` (0 stacked → 1 spread) comes from scroll; `slots` are each card's
  // continuous position on the arc (-2 … 2, 0 = centre) and glide when the active card changes.
  const fan = useRef({ open: 1, slots: STEPS.map((_, i) => offsetOf(i, 0)), live: false });

  // Track deck width so the fan re-lays out on resize.
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setSize(Math.round(e.contentRect.width)));
    ro.observe(deckRef.current);
    return () => ro.disconnect();
  }, []);

  /** Writes every card's transform from the current open amount and slots (transforms only). */
  const render = () => {
    const f = fan.current;
    if (!f.live) return;
    const items = itemRefs.current;
    const w = items[0]?.offsetWidth || 240;
    const p = f.open;
    items.forEach((el, i) => {
      if (!el) return;
      const d = wrapSlot(f.slots[i]);
      const a = Math.abs(d);
      const sgn = Math.sign(d);
      // Spread: cards sit on an arc, tilting outward and stepping down and back from the centre.
      // The outer pair steps far enough out that its neighbour never covers the start of its copy.
      const xs = sgn * w * (a <= 1 ? 0.94 * a : a <= 2 ? 0.94 + 0.84 * (a - 1) : 1.78 + 0.64 * (a - 2));
      const ys = w * 0.0775 * a * a;
      const rs = d * 7;
      const ss = 1 - 0.11 * a;
      // Stacked: a tight pile tucked up under the heading, each card barely offset.
      const xc = d * w * 0.045;
      const yc = -w * 0.34 + a * w * 0.025;
      const rc = d * 2.4;
      const sc = 0.8 - 0.015 * a;
      gsap.set(el, {
        x: lerp(xc, xs, p),
        y: lerp(yc, ys, p),
        rotation: lerp(rc, rs, p),
        scale: lerp(sc, ss, p),
        opacity: a <= 2 ? 1 : Math.max(0, 1 - (a - 2) * 2),
        zIndex: Math.round(20 - a * 4),
      });
    });
  };

  // Desktop: the fan's spread is scrubbed by scroll. Reduced motion: a static, fully spread fan.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        const f = fan.current;
        f.live = true;
        f.open = 1;
        render();
        return () => {
          f.live = false;
          gsap.set(itemRefs.current, { clearProps: 'transform,zIndex,opacity' });
        };
      });
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        const f = fan.current;
        const progress = { t: 0 };
        gsap.to(progress, {
          t: 1,
          ease: 'none',
          scrollTrigger: { trigger: deckRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
          onUpdate: () => {
            f.open = spreadFor(progress.t);
            render();
          },
        });
        return () => {
          f.open = 1;
        };
      });
    },
    { scope: ref }
  );

  // Glide the cards to their new slots when the active card changes (desktop only).
  useLayoutEffect(() => {
    const f = fan.current;
    if (!f.live) return;
    const targets = {};
    f.slots = f.slots.map(wrapSlot);
    f.slots.forEach((cur, i) => {
      let delta = offsetOf(i, active) - cur;
      if (delta > N / 2) delta -= N;
      if (delta < -N / 2) delta += N;
      targets[i] = cur + delta;
    });
    const reduce = prefersReducedMotion();
    const tween = gsap.to(f.slots, {
      ...targets,
      duration: reduce ? 0 : 0.9,
      ease: 'expo.out',
      overwrite: true,
      onUpdate: render,
      onComplete: () => {
        f.slots = f.slots.map(wrapSlot);
        render();
      },
    });
    return () => tween.kill();
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-measure on resize.
  useLayoutEffect(render, [size, mobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep keyboard focus on the card that just became active.
  useEffect(() => {
    if (focusAfter.current) {
      focusAfter.current = false;
      btnRefs.current[active]?.focus({ preventScroll: true });
    }
  }, [active]);

  // Mobile: derive the active card from the scroll position.
  useEffect(() => {
    if (!mobile) return;
    const list = listRef.current;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = list.scrollLeft + list.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        itemRefs.current.forEach((el, i) => {
          const c = el.offsetLeft + el.offsetWidth / 2;
          const dist = Math.abs(c - mid);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        setActive(best);
      });
    };
    list.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      list.removeEventListener('scroll', onScroll);
    };
  }, [mobile]);

  const scrollToCard = i => {
    const list = listRef.current;
    const el = itemRefs.current[i];
    if (!list || !el) return;
    list.scrollTo({
      left: el.offsetLeft - (list.clientWidth - el.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  const go = (i, { focus = false } = {}) => {
    if (mobile) {
      const t = Math.max(0, Math.min(N - 1, i));
      scrollToCard(t);
      if (focus) btnRefs.current[t]?.focus({ preventScroll: true });
      return;
    }
    focusAfter.current = focus;
    setActive(wrap(i));
  };

  const onKeyDown = e => {
    const keys = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: N - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    go(keys[e.key], { focus: true });
  };

  const current = STEPS[active];

  return (
    <section className="au-how au-section" id="workflows" aria-labelledby="au-how-title" ref={ref}>
      <div className="au-head">
        <Eyebrow>The Vantline loop</Eyebrow>
        <h2 className="au-h2" id="au-how-title" data-reveal="lines">
          From raw numbers to a clear brief —<em className="au-break">in minutes</em>
        </h2>
      </div>

      <div
        className="au-fan"
        ref={deckRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="The Vantline loop, five stages"
      >
        <ol className="au-fan__list" ref={listRef} onKeyDown={onKeyDown}>
          {STEPS.map((s, i) => {
            const on = i === active;
            return (
              <li className={`au-fan__item${on ? ' is-active' : ''}`} key={s.id} ref={el => (itemRefs.current[i] = el)}>
                <button
                  type="button"
                  className="au-fan__card"
                  ref={el => (btnRefs.current[i] = el)}
                  tabIndex={on ? 0 : -1}
                  aria-current={on ? 'step' : undefined}
                  data-cursor={on ? undefined : 'Open'}
                  aria-label={`Stage ${i + 1} of ${N}: ${s.title}. ${s.text}`}
                  onClick={() => (on ? undefined : go(mobile ? i : active + offsetOf(i, active)))}
                >
                  <span className="au-fan__media">
                    <Photo id={s.img} alt="" widths={[400, 640, 900]} sizes="(max-width: 767px) 72vw, 280px" ratio={0.8} style={{ objectPosition: s.pos }} />
                    <span className="au-fan__num">{String(i + 1).padStart(2, '0')}</span>
                  </span>
                  <span className="au-fan__body">
                    <span className="au-fan__title">{s.title}</span>
                    <span className="au-fan__text">{s.text}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="sr-only" aria-live="polite">
        Stage {active + 1} of {N}: {current.title}
      </p>

      {/* Arrows, pill and progress dots reveal together, as soon as they reach the bottom of the screen. */}
      <div data-reveal="fade" data-reveal-delay="0.15" data-reveal-start="top 98%">
        <div className="au-fan__controls">
          <button
            type="button"
            className="au-round"
            onClick={() => go(active - 1)}
            aria-label="Previous stage"
            disabled={mobile && active === 0}
          >
            <ArrowLeft />
          </button>
          <PillButton as="a" href="#product" tone="dark">
            Walk through the loop
          </PillButton>
          <button
            type="button"
            className="au-round"
            onClick={() => go(active + 1)}
            aria-label="Next stage"
            disabled={mobile && active === N - 1}
          >
            <ArrowRight />
          </button>
        </div>
        <ol className="au-fan__dots" aria-hidden="true">
          {STEPS.map((s, i) => (
            <li key={s.id} className={i === active ? 'is-on' : ''} />
          ))}
        </ol>
      </div>
    </section>
  );
}
