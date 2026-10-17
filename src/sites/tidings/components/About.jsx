import { PRINCIPLES } from '../data.js';

export default function About() {
  return (
    <section id="about" className="ar-section ar-about" aria-labelledby="ar-about-title">
      <div className="ar-wrap">
        <div className="ar-about-top">
          <p className="ar-eyebrow" data-reveal="fade">
            Company
          </p>
          <h2 id="ar-about-title" className="ar-about-mission" data-fill data-fill-from="0.16" data-fill-start="top 80%" data-fill-end="bottom 50%">
            Messages people are <span className="ar-blue-text">glad to get</span> — a word from a shop they like, never an interruption. Tidings helps you send fewer, better ones and shows which worked.
          </h2>
          <p className="ar-about-note" data-reveal="fade">
            Tidings is a concept product, designed as a portfolio study of consent-first messaging software.
          </p>
        </div>
        <ol className="ar-principles" role="list" data-reveal="stagger" data-reveal-stagger="0.1">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className="ar-principle">
              <span className="ar-principle-num">0{i + 1}</span>
              <h3 className="ar-h3">{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
