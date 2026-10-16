import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '../../../shared/gsap.js';
import { PRINCIPLES } from '../data.js';
import { Eyebrow, Photo } from './ui.jsx';

export default function Approach() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(ref);
        gsap.from(q('.au-prism'), {
          y: 70,
          opacity: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('.au-prisms')[0], start: 'top 85%', once: true },
        });
        gsap.from(q('.au-prism__img'), {
          scale: 1.18,
          duration: 1.8,
          stagger: 0.12,
          ease: 'expo.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: q('.au-prisms')[0], start: 'top 85%', once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section className="au-approach au-section" id="principles" aria-labelledby="au-approach-title" ref={ref}>
      <div className="au-head">
        <Eyebrow mark="dot">principles</Eyebrow>
        <h2 className="au-h2" id="au-approach-title" data-au-reveal>
          Better calls, <em>made together</em>
        </h2>
        <p className="au-lede" data-au-reveal>
          Vantline pairs careful analysis with the judgement of the people who know the business, so the next call is
          easier to make and easier to explain.
        </p>
      </div>

      <ul className="au-prisms" role="list">
        {PRINCIPLES.map((c, i) => (
          <li className="au-prism" key={c.title}>
            <div className="au-prism__media">
              <Photo
                className="au-prism__img"
                id={c.img}
                alt={c.alt}
                widths={[480, 720, 1000]}
                sizes="(max-width: 767px) 92vw, (max-width: 1200px) 31vw, 400px"
                ratio={1.05}
                style={{ objectPosition: c.pos }}
              />
            </div>
            <div className="au-prism__body">
              <span className="au-prism__num" aria-hidden="true">
                0{i + 1}
              </span>
              <h3 className="au-card-title au-card-title--ink">{c.title}</h3>
              <p className="au-prism__text">{c.text}</p>
              <p className="au-prism__more">{c.more}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
