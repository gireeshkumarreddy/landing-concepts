import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '../../../shared/gsap.js';
import { PEOPLE, WALL } from '../data.js';
import { goToWaitlist, portrait } from '../lib.js';
import { ArrowRight, Users } from '../icons.jsx';

const CARD_W = 112;
const CARD_H = 140;

function Person({ id }) {
  const p = PEOPLE[id];
  const { src, srcSet } = portrait(p.photo, CARD_W, CARD_H);
  return (
    <figure className="ta-wall__item">
      <div className="ta-wall__card">
        <img src={src} srcSet={srcSet} width={CARD_W} height={CARD_H} alt="" loading="lazy" decoding="async" />
      </div>
      <figcaption className="ta-wall__chip">
        <strong>{p.name}</strong>
        <span>{p.role}</span>
      </figcaption>
    </figure>
  );
}

/**
 * Signature moment: portrait cards hang from the top edge in staggered columns. Columns drift at
 * different speeds while scrolling; on fine pointers the hovered card turns to face the pointer,
 * lifts, and shows who it is. Reduced motion gets the same wall, perfectly still.
 */
export default function PeopleWall() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const section = ref.current;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // Cards drop in on their strings, from the centre outwards.
        gsap.from('.ta-wall__item', {
          yPercent: -38,
          opacity: 0,
          duration: 1.2,
          ease: 'expo.out',
          stagger: { each: 0.045, from: 'center' },
          scrollTrigger: { trigger: section, start: 'top 72%', once: true },
        });

        // Each column drifts at its own speed (scrubbed, so it follows the smooth scroll).
        // Smaller drift on narrow screens, where the cards are smaller too.
        const amp = () => (section.offsetWidth < 640 ? 30 : 56);
        gsap.utils.toArray('.ta-wall__col', section).forEach(col => {
          const s = parseFloat(col.dataset.speed || 0.6);
          gsap.fromTo(
            col,
            { y: () => -amp() * s },
            {
              y: () => amp() * s,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        });
      });

      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
        const cards = gsap.utils.toArray('.ta-wall__card', section);
        const offs = cards.map(card => {
          gsap.set(card, { transformPerspective: 700, transformOrigin: '50% 50%' });
          const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
          const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
          const enter = () =>
            gsap.to(card, { y: -10, scale: 1.08, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
          const move = e => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            // The card turns to face the pointer: the side under it recedes a little.
            ry(-px * 26);
            rx(py * 22);
          };
          const leave = () =>
            gsap.to(card, { rotationX: 0, rotationY: 0, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });
          card.addEventListener('pointerenter', enter);
          card.addEventListener('pointermove', move);
          card.addEventListener('pointerleave', leave);
          return () => {
            card.removeEventListener('pointerenter', enter);
            card.removeEventListener('pointermove', move);
            card.removeEventListener('pointerleave', leave);
          };
        });
        return () => offs.forEach(off => off());
      });
    },
    { scope: ref }
  );

  return (
    <section id="people-wall" className="ta-sec ta-wall" aria-labelledby="ta-wall-title" ref={ref}>
      <div className="ta-wall__panel">
        <div className="ta-wall__cols" role="group" aria-label="Sample contacts, as Emberpost would file them">
          {WALL.map((col, i) => (
            <div
              key={i}
              className={`ta-wall__col${col.people.length > 1 ? ' is-long' : ''}`}
              data-speed={col.speed}
              style={{ '--ta-drop': col.drop }}
            >
              <span className="ta-wall__ghost" aria-hidden="true" />
              {col.people.map(id => (
                <Person key={id} id={id} />
              ))}
              <span className="ta-wall__string" aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="ta-wall__copy">
          <p className="ta-wall__tag" data-reveal="fade">
            <Users size={14} /> The people behind your inbox
          </p>
          <h2 id="ta-wall-title" className="ta-wall__title">
            <span data-reveal="lines">Everyone you write to,</span>
            <span data-reveal="lines" data-reveal-delay="0.08">
              in one calm place.
            </span>
          </h2>
          <p className="ta-wall__sub" data-reveal="fade" data-reveal-delay="0.15">
            Clients, suppliers, teammates and the odd new face. Each of them gets a card, and every thread they have
            ever sent you lives inside it.
          </p>
          <div data-reveal="fade" data-reveal-delay="0.22">
            <a href="#waitlist" className="ta-btn ta-btn--ink ta-wall__cta" onClick={goToWaitlist} data-magnetic="0.3">
              Join the waitlist <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
