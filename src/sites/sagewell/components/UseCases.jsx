import { unsplash, unsplashSrcSet } from '../../../shared/img.js';
import { EXAMPLES, USE_CASES } from '../data.js';
import { useSagewell } from '../lib.js';
import { IconArrowUp } from '../icons.jsx';

export default function UseCases() {
  const { loadPrompt } = useSagewell();

  return (
    <section className="cr-section cr-uses" id="use-cases" aria-labelledby="cr-uses-title">
      <div className="cr-wrap">
        <header className="cr-uses__head">
          <div>
            <p className="cr-eyebrow" data-reveal="fade">
              <b>04</b> In practice
            </p>
            <h2 id="cr-uses-title" className="cr-h2" data-reveal="lines">
              Questions with <br className="cr-br-lg" />
              consequences.
            </h2>
          </div>
          <p className="cr-lede" data-reveal="fade" data-reveal-delay="0.12">
            Send any of these to the composer at the top of the page and watch a scripted trail unfold, pass by
            pass.
          </p>
        </header>
      </div>

      <ul className="cr-uses__rail" role="list" data-reveal="stagger" data-reveal-stagger="0.09">
        {USE_CASES.map(u => {
          const ex = EXAMPLES.find(e => e.id === u.example);
          return (
            <li key={u.id} className="cr-use" data-cursor="Try">
              <div className="cr-use__media">
              <img
                className="cr-use__img"
                data-parallax="0.1"
                src={unsplash(u.img, { w: 700, h: 980, q: 70 })}
                srcSet={unsplashSrcSet(u.img, [420, 700, 1000], { ratio: 1.4, q: 70 })}
                sizes="(max-width: 700px) 78vw, (max-width: 1100px) 45vw, 25vw"
                style={{ objectPosition: u.pos }}
                alt=""
                width="700"
                height="980"
                loading="lazy"
                decoding="async"
              />
              </div>
              <div className="cr-use__card">
                <h3 className="cr-use__label">{u.label}</h3>
                <p className="cr-use__q">“{ex.question}”</p>
                <p className="cr-use__body">{u.body}</p>
                <button
                  type="button"
                  className="cr-use__try"
                  onClick={() => loadPrompt(ex.question)}
                  aria-label={`Ask this: send “${ex.question}” to the composer`}
                >
                  Ask this
                  <IconArrowUp size={15} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
