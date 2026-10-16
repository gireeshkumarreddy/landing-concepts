import { useRef, useState } from 'react';
import { ANATOMY } from '../data.js';
import { ArrowRight, BookIcon, CheckIcon, UndoIcon } from '../icons.jsx';

/* Small diagrams for each foundation (SVG, decorative). */
const BARS = [18, 30, 12, 40, 24, 34, 14, 44, 26, 20, 36, 16];
const ART = {
  premise: (
    <svg viewBox="0 0 120 92" aria-hidden="true">
      <rect x="10" y="16" width="100" height="28" rx="6" className="a-paper" />
      <rect x="19" y="27" width="58" height="6" rx="2" className="a-ink" />
      <rect x="81" y="27" width="20" height="6" rx="2" className="a-accent" />
      <path d="M30 44v10M62 44v10M92 44v10" className="a-stem" />
      <rect x="14" y="56" width="32" height="15" rx="7.5" className="a-chip" />
      <rect x="47" y="56" width="31" height="15" rx="7.5" className="a-chip" />
      <rect x="79" y="56" width="27" height="15" rx="7.5" className="a-chip a-chip--accent" />
      <text x="30" y="66.5" textAnchor="middle" className="a-tiny">
        who
      </text>
      <text x="62.5" y="66.5" textAnchor="middle" className="a-tiny">
        wants
      </text>
      <text x="92.5" y="66.5" textAnchor="middle" className="a-tiny a-tiny--accent">
        but
      </text>
    </svg>
  ),
  structure: (
    <svg viewBox="0 0 120 92" aria-hidden="true">
      <path d="M10 74h100" className="a-axis" />
      <path d="M43 14v60M77 14v60" className="a-dash" />
      <path d="M12 68c10-4 20-14 31-17s16 8 23-3 6-16 11-14 12 3 17-9 8-10 14-9" className="a-curve" />
      <circle cx="43" cy="51" r="3.4" className="a-accent" />
      <circle cx="77" cy="34" r="3.4" className="a-accent" />
      <text x="26" y="86" textAnchor="middle" className="a-tiny">
        I
      </text>
      <text x="60" y="86" textAnchor="middle" className="a-tiny">
        II
      </text>
      <text x="94" y="86" textAnchor="middle" className="a-tiny">
        III
      </text>
    </svg>
  ),
  voice: (
    <svg viewBox="0 0 120 92" aria-hidden="true">
      <path d="M10 70h100" className="a-axis" />
      {BARS.map((h, i) => (
        <rect key={i} x={14 + i * 8} y={68 - h} width="4.5" height={h} rx="2.25" className={i === 7 || i === 3 ? 'a-accent' : 'a-ink2'} />
      ))}
      <text x="60" y="86" textAnchor="middle" className="a-tiny">
        sentence length
      </text>
    </svg>
  ),
  ending: (
    <svg viewBox="0 0 120 92" aria-hidden="true">
      <path d="M22 64C22 18 98 18 98 64" className="a-curve a-curve--dash" />
      <path d="M93 57l5 7 5-7" className="a-curve" />
      <circle cx="22" cy="64" r="4.5" className="a-ink" />
      <circle cx="98" cy="68" r="5.5" className="a-accent" />
      <text x="22" y="84" textAnchor="middle" className="a-tiny">
        p.1
      </text>
      <text x="98" y="86" textAnchor="middle" className="a-tiny">
        last page
      </text>
    </svg>
  ),
};

function AnatomyCard({ c, i }) {
  const [flipped, setFlipped] = useState(false);
  const frontBtn = useRef(null);
  const backBtn = useRef(null);
  const flip = to => {
    setFlipped(to);
    // The face that held focus becomes inert, so hand focus to the other side.
    requestAnimationFrame(() => (to ? backBtn : frontBtn).current?.focus({ preventScroll: true }));
  };
  return (
    <li className={`ch-anat__item ${flipped ? 'is-flipped' : ''}`}>
      <div className="ch-anat__inner">
        <div className="ch-anat__face ch-anat__front" inert={flipped || undefined}>
          <span className="ch-anat__num">0{i + 1}</span>
          <div className="ch-anat__art">{ART[c.id]}</div>
          <h3 className="ch-anat__title">{c.title}</h3>
          <p className="ch-anat__line">{c.line}</p>
          <button ref={frontBtn} type="button" className="ch-anat__btn" aria-expanded={flipped} onClick={() => flip(true)}>
            What it needs
            <span className="sr-only"> for {c.title}</span>
            <ArrowRight size={14} />
          </button>
        </div>
        <div className="ch-anat__face ch-anat__back" inert={!flipped || undefined}>
          <span className="ch-anat__num">0{i + 1}</span>
          <p className="ch-anat__title">
            {c.title}
            <span className="sr-only"> checklist</span>
          </p>
          <ul role="list" className="ch-anat__points">
            {c.points.map(p => (
              <li key={p}>
                <CheckIcon size={15} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <button ref={backBtn} type="button" className="ch-anat__btn" aria-expanded={flipped} onClick={() => flip(false)}>
            <UndoIcon size={14} />
            Flip back
            <span className="sr-only"> to {c.title}</span>
          </button>
        </div>
      </div>
    </li>
  );
}

export default function Anatomy() {
  return (
    <section className="ch-section ch-books" id="anatomy" aria-labelledby="ch-books-title">
      <div className="ch-wrap">
        <div className="ch-deck">
          <header className="ch-deck__head" data-reveal>
            <div>
              <p className="ch-label ch-label--light">
                <BookIcon size={15} /> What I read for
              </p>
              <h2 className="ch-h2 ch-h2--light" id="ch-books-title">
                Four things every strong draft gets right.
              </h2>
            </div>
            <p className="ch-lede ch-lede--light">
              Whatever the genre, my first read checks the same four foundations. Press a key to see what each one needs.
            </p>
          </header>
          <ol role="list" className="ch-anat" data-reveal-stagger>
            {ANATOMY.map((c, i) => (
              <AnatomyCard key={c.id} c={c} i={i} />
            ))}
          </ol>
          <p className="ch-deck__foot">
            <span>Checklists are sample content written for this concept.</span>
            <a href="#essays" className="ch-textlink ch-textlink--light">
              Read the essays <ArrowRight size={14} />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
