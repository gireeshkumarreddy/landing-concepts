import { forwardRef, useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '../../../shared/gsap.js';
import { IMG } from '../data.js';
import { Photo, PillButton } from './ui.jsx';

const Hero = forwardRef(function Hero({ onSignup }, outerRef) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(ref);
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo(q('.au-hero__img'), { scale: 1.08 }, { scale: 1, duration: 2.4, ease: 'expo.out' }, 0)
          .from(
            q('.au-hero__line'),
            { yPercent: 55, opacity: 0, filter: 'blur(14px)', duration: 1.15, stagger: 0.13, clearProps: 'filter' },
            0.3
          )
          .from(q('.au-hero__sub'), { y: 18, opacity: 0, filter: 'blur(6px)', duration: 0.95, clearProps: 'filter' }, 0.62)
          .from(q('.au-hero__cta'), { y: 18, opacity: 0, duration: 0.95 }, 0.74)
          .from(q('.au-slab__pane'), { yPercent: 14, opacity: 0, duration: 1.6, ease: 'expo.out' }, 0.7)
          .from(q('.au-hero__hint'), { opacity: 0, duration: 1 }, 1.1);

        // Scroll: photo drifts slower than the page, copy lifts and fades, the slab sinks a touch.
        const st = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to(q('.au-hero__media'), { yPercent: 14, ease: 'none', scrollTrigger: st });
        gsap.to(q('.au-hero__content'), { y: -90, opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '65% top' } });
        gsap.to(q('.au-slab'), { yPercent: 10, ease: 'none', scrollTrigger: st });

        // Pointer drift on the glass slab (fine pointers only).
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
          const pane = q('.au-slab__drift')[0];
          const xTo = gsap.quickTo(pane, 'x', { duration: 1.4, ease: 'power3.out' });
          const yTo = gsap.quickTo(pane, 'y', { duration: 1.4, ease: 'power3.out' });
          const rTo = gsap.quickTo(pane, 'rotation', { duration: 1.6, ease: 'power3.out' });
          const onMove = e => {
            const r = ref.current.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5;
            const ny = (e.clientY - r.top) / r.height - 0.5;
            xTo(nx * 22);
            yTo(ny * 10);
            rTo(nx * 1.2);
          };
          const onLeave = () => {
            xTo(0);
            yTo(0);
            rTo(0);
          };
          const el = ref.current;
          el.addEventListener('pointermove', onMove);
          el.addEventListener('pointerleave', onLeave);
          return () => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
          };
        }
      });
    },
    { scope: ref }
  );

  return (
    <section
      className="au-hero"
      aria-labelledby="au-hero-title"
      ref={node => {
        ref.current = node;
        if (typeof outerRef === 'function') outerRef(node);
        else if (outerRef) outerRef.current = node;
      }}
    >
      <div className="au-hero__frame">
        <div className="au-hero__media" aria-hidden="true">
          <Photo
            className="au-hero__img"
            id={IMG.hero}
            widths={[800, 1200, 1600, 2200, 2800]}
            sizes="(max-aspect-ratio: 1/1) 165vh, 100vw"
            priority
            alt=""
          />
          <div className="au-hero__grade" />
          <div className="au-hero__shade" />
        </div>

        <div className="au-hero__haze" aria-hidden="true" />

        <div className="au-slab" aria-hidden="true">
          <div className="au-slab__drift">
            <div className="au-slab__pane">
              <span className="au-slab__edge" />
            </div>
            <span className="au-slab__shadow" />
          </div>
        </div>

        <div className="au-hero__content">
          <h1 className="au-hero__title" id="au-hero-title">
            <span className="au-hero__line au-hero__line--sans">Know what changed</span>
            <span className="au-hero__line au-hero__line--serif">and what to do about it.</span>
          </h1>
          <p className="au-hero__sub">
            Vantline reads your metrics, docs and team threads, explains every shift in plain language, and suggests the next move.
          </p>
          <PillButton className="au-hero__cta" tone="light" onClick={onSignup}>
            Try Vantline free
          </PillButton>
        </div>

        <a className="au-hero__hint" href="#workflows">
          (Keep scrolling)
        </a>
      </div>
    </section>
  );
});

export default Hero;
