import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, prefersReducedMotion } from '../../../shared/gsap.js';
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

export default function HowItWorks() {
  const ref = useRef(null);
  const deckRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const btnRefs = useRef([]);
  const dealt = useRef(false);
  const focusAfter = useRef(false);
  const [active, setActive] = useState(0);
  const [size, setSize] = useState(0);
  const mobile = useMediaQuery('(max-width: 767px)');

  // Track deck width so the fan re-lays out on resize.
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setSize(Math.round(e.contentRect.width)));
    ro.observe(deckRef.current);
    return () => ro.disconnect();
  }, []);

  const activeRef = useRef(active);
  activeRef.current = active;
  const laidOutFor = useRef(active);

  const layout = (duration, stagger = 0) => {
    const items = itemRefs.current;
    const w = items[0]?.offsetWidth || 240;
    laidOutFor.current = activeRef.current;
    items.forEach((el, i) => {
      const d = offsetOf(i, activeRef.current);
      const a = Math.abs(d);
      gsap.set(el, { zIndex: 10 - a * 2 });
      gsap.to(el, {
        x: d === 0 ? 0 : Math.sign(d) * (a === 1 ? w * 0.94 : w * 1.68),
        y: a === 0 ? 0 : a === 1 ? w * 0.085 : w * 0.31,
        rotation: d * 7,
        scale: a === 0 ? 1 : a === 1 ? 0.88 : 0.78,
        opacity: 1,
        duration,
        delay: stagger ? a * stagger : 0,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    });
  };

  // Desktop + motion: start stacked, then deal the cards out when the deck scrolls into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
        if (dealt.current) return;
        const items = itemRefs.current;
        gsap.set(items, { x: 0, y: 40, rotation: 0, scale: 0.86, opacity: 0 });
        gsap.set(items[activeRef.current], { opacity: 1, zIndex: 10 });
        ScrollTrigger.create({
          trigger: deckRef.current,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            if (dealt.current) return;
            dealt.current = true;
            layout(1.3, 0.08);
          },
        });
      });
    },
    { scope: ref }
  );

  // Desktop fan layout on change / resize. Mobile uses a native scroll-snap carousel instead.
  useGSAP(
    () => {
      const items = itemRefs.current;
      if (mobile) {
        gsap.set(items, { clearProps: 'transform,zIndex,opacity' });
        return;
      }
      const reduce = prefersReducedMotion();
      // Still waiting for the deal and only the size changed: stay stacked.
      if (!dealt.current && !reduce && laidOutFor.current === activeRef.current) return;
      const first = !dealt.current;
      dealt.current = true;
      layout(reduce ? 0 : first ? 1.3 : 0.85, first && !reduce ? 0.08 : 0);
    },
    { dependencies: [active, mobile, size], scope: ref }
  );

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
        <h2 className="au-h2" id="au-how-title" data-au-reveal>
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

      <div className="au-fan__controls" data-au-reveal>
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
    </section>
  );
}
