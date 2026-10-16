import { useRef, useState } from 'react';
import { gsap, useGSAP, MOTION_OK } from '../../../shared/gsap.js';
import { unsplash } from '../../../shared/img.js';
import { useTidings } from '../hooks.jsx';
import { IMG_BISTRO } from '../data.js';
import { IconArrow, IconCalendar, IconExternal, IconTag } from '../icons.jsx';
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
    <div className="ar-fcard is-promo">
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
    <div className="ar-fcard is-travel">
      <div className="ar-fcard-bubble">
        <p>
          Hi Tomás — your table for four at <strong>Casa Verde</strong> is confirmed for Friday at 8:00 pm.
        </p>
        <span className="ar-fcard-time">10:16 am</span>
      </div>
      <div className="ar-fcard-photo">
        <img
          src={unsplash(IMG_BISTRO, { w: 520, h: 300, q: 72 })}
          srcSet={`${unsplash(IMG_BISTRO, { w: 300, h: 173, q: 72 })} 300w, ${unsplash(IMG_BISTRO, { w: 520, h: 300, q: 72 })} 520w`}
          sizes="260px"
          alt="A bistro table set with wine glasses"
          width="260"
          height="150"
          decoding="async"
          fetchPriority="high"
        />
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
        tl.from('.ar-hero-bg-glow', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
          .from('.ar-badge', { y: 14, opacity: 0, duration: 0.7 }, 0.1)
          .from('.ar-h1-line', { yPercent: 108, duration: 1.05, stagger: 0.09, ease: 'expo.out' }, 0.18)
          .from('.ar-hero-sub', { y: 16, opacity: 0, duration: 0.8 }, 0.5)
          .from('.ar-hero-cta', { y: 16, opacity: 0, duration: 0.8 }, 0.6)
          .from('.ar-rise-phone', { yPercent: 22, opacity: 0, duration: 1.3, ease: 'expo.out' }, 0.62)
          .from(
            '.ar-rise-card',
            { y: 110, opacity: 0, rotation: i => (i ? 7 : -7), duration: 1.2, stagger: 0.1, ease: 'expo.out' },
            0.78
          )
          .from('.ar-rise-marker', { scale: 0.4, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' }, 1.15)
          .from('.ar-hero .ar-columns', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0.3);
      });

      // Depth parallax for fine pointers only.
      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
        const el = root.current;
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
        };
        const leave = () => layers.forEach(l => (l.x(0), l.y(0)));
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        return () => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        };
      });
      return () => mm.revert();
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
          <span className="ar-badge-new">New</span>
          <span className="sr-only"> — </span>
          Take payments inside the chat
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
          <button type="button" className="ar-cta" onClick={() => openWizard()}>
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
              <span className="ar-marker-dot is-emerald">
                <IconTag size={16} sw={2.1} />
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
              <span className="ar-marker-dot is-tangerine">
                <IconCalendar size={16} sw={2.1} />
              </span>
            </div>
          </div>

          <div className="ar-slot is-phone" data-depth="8">
            <div className="ar-rise-phone">
              <HeroPhone active={active} onOpen={setActive} onBack={() => setActive(null)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
