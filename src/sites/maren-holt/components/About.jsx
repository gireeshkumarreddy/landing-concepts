import { ArrowRight, BookIcon } from '../icons.jsx';
import { Monogram } from './Nav.jsx';

export default function About({ onNewsletter }) {
  return (
    <section className="ch-section ch-about" id="about" aria-labelledby="ch-about-title">
      <div className="ch-wrap">
        <div className="ch-about__top">
          <p className="ch-label" data-reveal="fade">
            <BookIcon size={15} /> About
          </p>
          <Monogram size="lg" />
        </div>
        <h2 className="sr-only" id="ch-about-title">
          About
        </h2>
        {/* Fictional bio for the Maren Holt persona; words light up as it scrolls through and are all
            lit by the time it is centred, so the whole sentence reads at once below its label. */}
        <p className="ch-statement" data-fill data-fill-from="0.16" data-fill-start="top 85%" data-fill-end="center 58%">
          Fourteen years editing <em>fiction</em> and <em>narrative non-fiction</em> from a small studio in Bristol — helping good
          drafts become the books they were meant to be.
        </p>

        <div className="ch-about__row" data-reveal="fade">
          <div className="ch-about__note">
            <p className="ch-kicker">A note on Maren</p>
            <p>
              Maren Holt is a fictional editor created for this portfolio concept. The studio, the fourteen years and every essay on this
              page are invented sample content.
            </p>
          </div>
          <div className="ch-about__ctas">
            <span className="ch-magnet" data-magnetic="0.25">
              <button type="button" className="ch-btn ch-btn--raised" onClick={onNewsletter}>
                Get the Sunday notes <ArrowRight size={16} />
              </button>
            </span>
            <a href="#essays" className="ch-btn ch-btn--ghost">
              Browse the essays
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
