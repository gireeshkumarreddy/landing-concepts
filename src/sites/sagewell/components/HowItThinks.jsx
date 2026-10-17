import { unsplash, unsplashSrcSet } from '../../../shared/img.js';
import { IMG } from '../data.js';
import PassPills from './PassPills.jsx';

export default function HowItThinks() {
  return (
    <section className="cr-how" id="research" aria-labelledby="cr-how-title">
      <div className="cr-how__frame">
        <div className="cr-how__media" aria-hidden="true">
          <img
            data-parallax="0.1"
            src={unsplash(IMG.garden, { w: 1600, q: 70 })}
            srcSet={unsplashSrcSet(IMG.garden, [640, 1000, 1400, 1800, 2400], { q: 70 })}
            sizes="100vw"
            alt=""
            width="1600"
            height="1266"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="cr-how__fog" aria-hidden="true" />

        <div className="cr-how__inner">
          <div className="cr-how__head">
            <p className="cr-eyebrow" data-reveal="fade">
              <b>03</b> Research
            </p>
            <h2 id="cr-how-title" className="cr-h2" data-reveal="lines">
              Four passes, one visible trail.
            </h2>
            <p className="cr-lede" data-reveal="fade" data-reveal-delay="0.12">
              Sagewell works through a question in deliberate passes and records each one. Show the trail to your
              readers, keep it for audit, or fold it into a single line.
            </p>
          </div>

        </div>
      </div>
      <PassPills />
    </section>
  );
}
