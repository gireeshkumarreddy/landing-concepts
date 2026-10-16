import { unsplash, unsplashSrcSet } from '../../../shared/img.js';
import { HEADSHOT } from '../data.js';

const TOOLKIT = [
  ['DaVinci Resolve Studio', 'Edit, grade, Fairlight'],
  ['Premiere Pro', 'Agency handovers'],
  ['After Effects', 'Titles and clean-up'],
  ['Frame.io', 'Reviews and approvals'],
];

const FACTS = [
  ['Studio', 'Copenhagen, Denmark'],
  ['Works', 'Remote, worldwide'],
  ['Languages', 'English, Danish'],
  ['Time zone', 'CET (UTC+1 / +2)'],
];

export default function About() {
  return (
    <section id="studio" className="pf-sec pf-about" aria-labelledby="pf-about-title">
      <div className="pf-wrap pf-about-grid">
        <figure className="pf-about-photo pf-reveal">
          <div className="pf-about-frame">
            <img
              src={unsplash(HEADSHOT, { w: 900, h: 1125, crop: 'faces' })}
              srcSet={unsplashSrcSet(HEADSHOT, [480, 720, 960, 1280], { ratio: 1.25, crop: 'faces' })}
              sizes="(min-width: 1024px) 40vw, 100vw"
              width="900"
              height="1125"
              alt="Portrait standing in for Ines Morrow, the fictional editor behind this concept."
              loading="lazy"
              decoding="async"
            />
            <span className="pf-about-burn" aria-hidden="true">
              <span>IM_STUDIO_02</span>
              <span>55.68° N · 12.57° E</span>
            </span>
          </div>
          <figcaption className="pf-about-cap">In the studio, Copenhagen. Hover to see it in colour.</figcaption>
        </figure>

        <div className="pf-about-text">
          <p className="pf-eyebrow pf-reveal">
            <span className="pf-eyebrow-n">04</span> Studio
          </p>
          <h2 id="pf-about-title" className="pf-h2 pf-reveal">
            I edit for rhythm first. <span className="pf-h2-soft">The rest follows.</span>
          </h2>
          <div className="pf-about-bio pf-reveal">
            <p>
              I’m Ines, a film and commercial editor working from a small studio in Copenhagen. Before cutting my own
              projects I spent years as an assistant editor, which taught me to respect the unglamorous parts: logging,
              syncing and naming things properly so the creative work can move fast.
            </p>
            <p>
              Now I edit campaigns, music videos and the occasional documentary for directors and production companies,
              mostly remotely and across time zones. I keep my calendar deliberately light, so each film gets my full
              attention from the first sync to the final export.
            </p>
          </div>

          <div className="pf-about-cols pf-reveal">
            <div>
              <h3 className="pf-mini-h">Toolkit</h3>
              <ul role="list" className="pf-kv">
                {TOOLKIT.map(([k, v]) => (
                  <li key={k}>
                    <span>{k}</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="pf-mini-h">Practicalities</h3>
              <ul role="list" className="pf-kv">
                {FACTS.map(([k, v]) => (
                  <li key={k}>
                    <span>{k}</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="pf-status pf-reveal">
            <span className="pf-status-dot" aria-hidden="true" />
            <span className="pf-status-k">Availability</span>
            Booking from February 2027
          </p>
        </div>
      </div>
    </section>
  );
}
