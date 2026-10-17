import { unsplash } from '../../../shared/img.js';
import { HEADSHOT } from '../data.js';
import { goToContact } from '../utils.js';
import { IconCalendar, IconFilm, IconScissors } from '../icons.jsx';
import HeroTimeline from './HeroTimeline.jsx';
import ClientStrip from './ClientStrip.jsx';

export default function Hero({ onOpenProject }) {
  // No intro sequence: the hero is composed and still on arrival; motion starts with scrolling.
  return (
    <section id="index" className="pf-hero" aria-labelledby="pf-hero-title">
      <div className="pf-hero-head">
        <div className="pf-ann">
          <p className="pf-ann-text">
            Cuts that keep
            <br /> people watching
          </p>
          <svg className="pf-ann-arrow" viewBox="0 0 76 46" aria-hidden="true" focusable="false">
            <path className="pf-ann-path" d="M2 12c5-6 11-7 15-1s10 7 15 1c6-8 16-7 22 2 5 7 9 16 12 26" />
            <path className="pf-ann-head" d="M59.6 35.2 66.2 40.6 68.6 32.4" />
          </svg>
        </div>

        <p className="pf-badge">
          <IconFilm size={14} />
          <span>Edit · Grade · Sound</span>
        </p>

        <h1 className="pf-h1" id="pf-hero-title">
          <span className="pf-h1-l">
            I’m{' '}
            <span className="pf-tile pf-tile--photo" aria-hidden="true">
              <img
                src={unsplash(HEADSHOT, { w: 96, h: 96, crop: 'faces', q: 80 })}
                srcSet={`${unsplash(HEADSHOT, { w: 96, h: 96, crop: 'faces', q: 80 })} 1x, ${unsplash(HEADSHOT, {
                  w: 192,
                  h: 192,
                  crop: 'faces',
                  q: 75,
                })} 2x`}
                width="96"
                height="96"
                alt=""
                decoding="async"
                fetchPriority="high"
              />
            </span>{' '}
            the editor who turns
          </span>{' '}
          <span className="pf-h1-l">
            hours of{' '}
            <span className="pf-tile pf-tile--icon" aria-hidden="true">
              <IconScissors size={24} />
            </span>{' '}
            footage into
          </span>{' '}
          <span className="pf-h1-l">the two minutes that matter</span>
        </h1>

        <div className="pf-hero-cta" data-magnetic="0.3">
          <a href="#contact" className="pf-btn pf-btn--blue" onClick={goToContact}>
            <IconCalendar size={14} />
            Start a project
          </a>
        </div>
      </div>

      <HeroTimeline onOpen={onOpenProject} />
      <ClientStrip />
    </section>
  );
}
