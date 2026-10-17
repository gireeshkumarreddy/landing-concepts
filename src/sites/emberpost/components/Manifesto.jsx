import { PRINCIPLES } from '../data.js';

export default function Manifesto() {
  return (
    <section id="manifesto" className="ta-sec ta-about" aria-labelledby="ta-about-title" tabIndex={-1} data-bg="#0c0c10">
      <div className="ta-gridlines ta-gridlines--thirds" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="ta-wrap">
        <div className="ta-about__top" data-reveal="fade">
          <p className="ta-eyebrow">
            <span>04</span> Manifesto
          </p>
          <h2 id="ta-about-title" className="ta-about__name">
            <span className="sr-only">Manifesto: why we are called Emberpost</span>
            <span aria-hidden="true">em·ber·post</span>
            <small aria-hidden="true">mail that stays warm between replies</small>
          </h2>
        </div>

        <p className="ta-about__big" data-fill data-fill-from="0.16" data-fill-start="top 80%" data-fill-end="bottom 50%">
          An ember is the part of a fire that keeps glowing after the flames die down, ready to catch again.{' '}
          <em>Good conversations work the same way.</em>{' '}
          <span>
            They pause between replies without going cold. Emberpost keeps the people you talk to warm in one place, and
            lets everything else cool off quietly.
          </span>
        </p>

        <ol className="ta-principles" role="list" aria-label="Our principles" data-reveal="stagger" data-reveal-stagger="0.1">
          {PRINCIPLES.map(p => (
            <li key={p.n}>
              <span className="ta-principles__n">{p.n}</span>
              <h3 className="ta-principles__t">{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
