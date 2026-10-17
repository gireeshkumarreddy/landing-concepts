import { PRINCIPLES } from '../data.js';
import { Eyebrow, Photo } from './ui.jsx';

const NBSP = ' ';

// Principles: a near-black interlude (the page re-tints while this section is centred).
export default function Approach() {
  return (
    <section className="au-approach au-section" id="principles" aria-labelledby="au-approach-title" data-bg="#111511">
      <div className="au-head">
        <Eyebrow mark="dot">principles</Eyebrow>
        <h2 className="au-h2" id="au-approach-title" data-reveal="lines">
          Better calls, <em>made together</em>
        </h2>
        <p className="au-lede" data-reveal="fade" data-reveal-delay="0.1">
          Vantline pairs careful analysis with the judgement of the people who know the business, so the next call is
          easier to make and easier to explain.
        </p>
      </div>

      <ul className="au-prisms" role="list" data-reveal="stagger" data-reveal-stagger="0.12">
        {PRINCIPLES.map((c, i) => (
          <li className="au-prism" key={c.title}>
            <div className="au-prism__media">
              <div className="au-prism__plx" data-parallax="0.1">
                <Photo
                  className="au-prism__img"
                  id={c.img}
                  alt={c.alt}
                  widths={[480, 720, 1000, 1400]}
                  sizes="(max-width: 767px) 92vw, (max-width: 1200px) 31vw, 400px"
                  ratio={1.05}
                  style={{ objectPosition: c.pos }}
                />
              </div>
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

      {/* Scroll-filled statement: words light up as the reader moves through it. */}
      <p className="au-statement" data-fill data-fill-from="0.16">
        A chart shows that a number moved. A{NBSP}good brief says <em>why it moved,</em> who feels it, and what your
        team could try before{NBSP}Friday.
      </p>
    </section>
  );
}
