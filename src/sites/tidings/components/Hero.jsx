import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../../../shared/gsap.js';
import { unsplash } from '../../../shared/img.js';
import { useTidings } from '../hooks.jsx';
import { IMG_BISTRO } from '../data.js';
import { IconArrow, IconCalendar, IconChatBubble, IconExternal, IconLink } from '../icons.jsx';
import Columns from './Columns.jsx';
import HeroPhone from './HeroPhone.jsx';

function TypingMarker({ className }) {
  return (
    <span className={`ar-marker-bubble ${className}`}>
      <i />
      <i />
      <i />
    </span>
  );
}

function RestockCard({ onOpen }) {
  return (
    <div className="ar-fcard is-promo" data-cursor="Open chat">
      <div className="ar-fcard-bubble">
        <p>Hi Priya — the linen shirt you saved is back in your size.</p>
        <p>
          Reply <strong>YES</strong> and we’ll hold one for 24 hours.
        </p>
        <span className="ar-fcard-time">11:02 am</span>
      </div>
      <button type="button" className="ar-fcard-link" onClick={onOpen}>
        <IconExternal size={15} sw={2} />
        Reserve mine
        <span className="sr-only"> (opens Priya’s conversation in the demo phone)</span>
      </button>
    </div>
  );
}

function BookingCard({ onOpen }) {
  return (
    <div className="ar-fcard is-travel" data-cursor="Open chat">
      <div className="ar-fcard-bubble">
        <p>
          Hi Tomás — your table for four at <strong>Casa Verde</strong> is confirmed for Friday at 8:00 pm.
        </p>
        <span className="ar-fcard-time">10:16 am</span>
      </div>
      <div className="ar-fcard-photo">
        <span className="ar-fcard-frame">
          <img
            data-parallax="0.1"
          src={unsplash(IMG_BISTRO, { w: 520, h: 300, q: 72 })}
          srcSet={`${unsplash(IMG_BISTRO, { w: 300, h: 173, q: 72 })} 300w, ${unsplash(IMG_BISTRO, { w: 520, h: 300, q: 72 })} 520w`}
          sizes="260px"
          alt="A bistro table set with wine glasses"
          width="260"
          height="150"
          decoding="async"
          fetchPriority="high"
          />
        </span>
      </div>
      <button type="button" className="ar-fcard-link" onClick={onOpen}>
        <IconExternal size={15} sw={2} />
        View booking
        <span className="sr-only"> (opens Tomás’s conversation in the demo phone)</span>
      </button>
    </div>
  );
}

export default function Hero() {
  const root = useRef(null);
  const { openWizard } = useTidings();
  const [active, setActive] = useState(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('.ar-badge', { y: 14, opacity: 0, duration: 0.7 }, 0.1)
          .from('.ar-h1-line', { yPercent: 108, duration: 1.05, stagger: 0.09, ease: 'expo.out' }, 0.18)
          .from('.ar-hero-sub', { y: 16, opacity: 0, duration: 0.8 }, 0.5)
          .from('.ar-hero-cta', { y: 16, opacity: 0, duration: 0.8 }, 0.6)
          .from('.ar-rise-phone', { yPercent: 22, opacity: 0, duration: 1.3, ease: 'expo.out' }, 0.62)
          .from(
            '.ar-rise-card',
            { y: 110, opacity: 0, rotation: i => (i ? 7 : -7), duration: 1.2, stagger: 0.1, ease: 'expo.out' },
            0.78
          )
          .from('.ar-rise-marker', { scale: 0.4, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' }, 1.15);
      });

      // Signature: floating 3D phone. Scroll turn + depth (fine pointers; touch keeps the float only).
      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
        const el = root.current;
        const turn = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.7 },
        });
        turn
          .fromTo('.ar-phone-scroll', { rotationY: 0, rotationX: 0, y: 0 }, { rotationY: -9, rotationX: 7, y: -70 }, 0)
          .to('.ar-slot.is-left', { yPercent: -38 }, 0)
          .to('.ar-slot.is-right', { yPercent: -60 }, 0)
          .to('.ar-slot.is-m1, .ar-slot.is-m3', { yPercent: -160 }, 0)
          .to('.ar-slot.is-m2, .ar-slot.is-m4', { yPercent: -110 }, 0);
      });

      // Pause the hero's ambient loops while it is off-screen.
      const idle = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: self => root.current?.classList.toggle('is-offscreen', !self.isActive),
      });

      // Depth parallax + pointer tilt for fine pointers only.
      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
        const el = root.current;
        const tiltNode = el.querySelector('.ar-phone-tilt');
        const anchor = el.querySelector('.ar-rise-phone'); // untilted box, so tilt never feeds back into itself
        const tiltY = gsap.quickTo(tiltNode, 'rotationY', { duration: 1.1, ease: 'power3' });
        const tiltX = gsap.quickTo(tiltNode, 'rotationX', { duration: 1.1, ease: 'power3' });
        const MAX = 8;
        const layers = gsap.utils.toArray('[data-depth]', el).map(node => ({
          d: parseFloat(node.dataset.depth),
          x: gsap.quickTo(node, 'x', { duration: 1, ease: 'power3' }),
          y: gsap.quickTo(node, 'y', { duration: 1, ease: 'power3' }),
        }));
        const move = e => {
          const r = el.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          layers.forEach(l => {
            l.x(nx * l.d);
            l.y(ny * l.d * 0.6);
          });
          // tilt toward the pointer, measured from the phone's own centre
          const p = anchor.getBoundingClientRect();
          const px = gsap.utils.clamp(-1, 1, (e.clientX - (p.left + p.width / 2)) / (r.width / 2));
          const py = gsap.utils.clamp(-1, 1, (e.clientY - (p.top + Math.min(p.height, 420) / 2)) / (r.height / 2));
          tiltY(px * MAX);
          tiltX(-py * MAX * 0.75);
        };
        const leave = () => {
          layers.forEach(l => (l.x(0), l.y(0)));
          tiltY(0);
          tiltX(0);
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        return () => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        };
      });
      return () => {
        idle.kill();
        mm.revert();
      };
    },
    { scope: root }
  );

  return (
    <section id="top" className="ar-hero" ref={root} aria-labelledby="ar-hero-title">
      <div className="ar-hero-bg" aria-hidden="true">
        <div className="ar-hero-bg-glow" />
        <div className="ar-hero-bg-cols" data-depth="-10">
          <Columns />
        </div>
      </div>

      <div className="ar-wrap ar-hero-copy">
        <p className="ar-badge">
          <IconChatBubble size={20} className="ar-badge-ico" />
          New — take payments inside the chat
        </p>
        <h1 id="ar-hero-title" className="ar-h1">
          <span className="ar-h1-mask">
            <span className="ar-h1-line">Turn WhatsApp into</span>
          </span>{' '}
          <span className="ar-h1-mask">
            <span className="ar-h1-line ar-h1-grad">your best sales channel</span>
          </span>
        </h1>
        <p className="ar-hero-sub">
          Send personalised broadcasts, win back abandoned carts and take payments right in the chat — with opt-in built in and every message measured.
        </p>
        <div className="ar-hero-cta">
          <button type="button" className="ar-cta" data-magnetic="0.3" onClick={() => openWizard()}>
            Launch a campaign
            <span className="ar-cta-dot">
              <IconArrow size={18} sw={2.2} />
            </span>
          </button>
        </div>
      </div>

      <div className="ar-stage">
        <div className="ar-stage-inner">
          <div className="ar-slot is-left" data-depth="22">
            <div className="ar-rise-card">
              <div className="ar-bob is-a">
                <RestockCard onOpen={() => setActive('priya')} />
              </div>
            </div>
          </div>
          <div className="ar-slot is-right" data-depth="26">
            <div className="ar-rise-card">
              <div className="ar-bob is-b">
                <BookingCard onOpen={() => setActive('tomas')} />
              </div>
            </div>
          </div>

          <div className="ar-slot is-m1" data-depth="34" aria-hidden="true">
            <div className="ar-rise-marker">
              <TypingMarker />
            </div>
          </div>
          <div className="ar-slot is-m2" data-depth="30" aria-hidden="true">
            <div className="ar-rise-marker">
              <span className="ar-marker-dot is-blue">
                <IconLink size={16} sw={2.2} />
              </span>
            </div>
          </div>
          <div className="ar-slot is-m3" data-depth="36" aria-hidden="true">
            <div className="ar-rise-marker">
              <TypingMarker className="is-flip" />
            </div>
          </div>
          <div className="ar-slot is-m4" data-depth="30" aria-hidden="true">
            <div className="ar-rise-marker">
              <span className="ar-marker-dot is-violet">
                <IconCalendar size={16} sw={2} />
              </span>
            </div>
          </div>

          <div className="ar-slot is-phone" data-depth="8">
            <div className="ar-rise-phone">
              {/* 3D layers: scroll turn → pointer tilt → idle float. Angles stay small so the phone stays clickable. */}
              <div className="ar-phone-scroll">
                <div className="ar-phone-tilt">
                  <div className="ar-phone-float">
                    <HeroPhone active={active} onOpen={setActive} onBack={() => setActive(null)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
