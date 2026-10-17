import { useMemo, useRef, useState } from 'react';
import { CAPABILITIES, DEPTHS, LANGS, MODELS, buildCode } from '../data.js';
import { highlight } from '../highlight.js';
import { useCopy } from '../lib.js';
import { IconCheck, IconChevronDown, IconCopy } from '../icons.jsx';

export default function Playground() {
  const [lang, setLang] = useState('python');
  const [model, setModel] = useState('sagewell-2');
  const [depthIdx, setDepthIdx] = useState(1);
  const [copyState, copy] = useCopy();
  const tabRefs = useRef([]);
  const depth = DEPTHS[depthIdx];

  const code = buildCode(lang, model, depth);
  const lines = useMemo(() => highlight(code, lang), [code, lang]);

  const onTabKey = e => {
    const i = LANGS.findIndex(l => l.id === lang);
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % LANGS.length;
    if (e.key === 'ArrowLeft') n = (i - 1 + LANGS.length) % LANGS.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = LANGS.length - 1;
    if (n === null) return;
    e.preventDefault();
    setLang(LANGS[n].id);
    tabRefs.current[n]?.focus();
  };

  const isLive = text => text === `"${model}"` || text === `"${depth}"`;

  return (
    <section className="cr-section cr-api" id="playground" data-bg="#141512" aria-labelledby="cr-api-title">
      <div className="cr-wrap">
        <header className="cr-api__head">
          <div>
            <p className="cr-eyebrow" data-reveal="fade">
              <b>02</b> Playground
            </p>
            <h2 id="cr-api-title" className="cr-h2" data-reveal="lines">
              One endpoint. <br className="cr-br-lg" />
              <span className="cr-soft">Adjustable depth.</span>
            </h2>
          </div>
          <p className="cr-lede" data-reveal="fade" data-reveal-delay="0.12">
            Switch language, model or depth and the request below is rewritten in place. Deeper settings spend
            more tokens planning and cross-checking before Sagewell replies.
          </p>
        </header>

        <div className="cr-api__grid">
          <div className="cr-code" data-reveal="fade">
            <div className="cr-code__top">
              <div className="cr-tabs" role="tablist" aria-label="Request language" onKeyDown={onTabKey}>
                {LANGS.map((l, i) => (
                  <button
                    key={l.id}
                    ref={el => (tabRefs.current[i] = el)}
                    type="button"
                    role="tab"
                    id={`cr-lang-${l.id}`}
                    aria-selected={lang === l.id}
                    aria-controls="cr-code-panel"
                    tabIndex={lang === l.id ? 0 : -1}
                    className={`cr-tab${lang === l.id ? ' is-on' : ''}`}
                    onClick={() => setLang(l.id)}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <button type="button" className="cr-code__copy" onClick={() => copy(code)}>
                {copyState === 'copied' ? <IconCheck size={14} /> : <IconCopy size={14} />}
                <span aria-live="polite">{copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy'}</span>
              </button>
            </div>

            <div className="cr-code__controls">
              <label className="cr-field-inline">
                <span>Model</span>
                <span className="cr-select">
                  <select value={model} onChange={e => setModel(e.target.value)}>
                    {MODELS.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown size={14} />
                </span>
              </label>
              <div className="cr-budget">
                <label htmlFor="cr-depth">Depth</label>
                <div className="cr-budget__track">
                  <input
                    id="cr-depth"
                    type="range"
                    min="0"
                    max="2"
                    step="1"
                    value={depthIdx}
                    onChange={e => setDepthIdx(+e.target.value)}
                    aria-valuetext={depth}
                    style={{ '--cr-range': `${depthIdx * 50}%` }}
                  />
                  <div className="cr-budget__ticks" aria-hidden="true">
                    {DEPTHS.map((ef, i) => (
                      <button
                        key={ef}
                        type="button"
                        tabIndex={-1}
                        className={i === depthIdx ? 'is-on' : ''}
                        onClick={() => setDepthIdx(i)}
                      >
                        {ef}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="cr-code__panel" role="tabpanel" id="cr-code-panel" aria-labelledby={`cr-lang-${lang}`} tabIndex={0}>
              <pre>
                <code>
                  {lines.map((line, li) => (
                    <span className="cr-code__line" key={li}>
                      {line.length
                        ? line.map(([t, text], ti) =>
                            t === 's' && isLive(text) ? (
                              <span key={`${ti}-${text}`} className="cr-t-s cr-live">
                                {text}
                              </span>
                            ) : (
                              <span key={ti} className={`cr-t-${t}`}>
                                {text}
                              </span>
                            )
                          )
                        : ' '}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
            <p className="cr-code__foot">
              <span>POST /v2/answers</span>
              <span>
                {model} · depth: {depth}
              </span>
            </p>
          </div>

          <ul className="cr-caps" role="list" data-reveal="stagger" data-reveal-stagger="0.1">
            {CAPABILITIES.map((c, i) => (
              <li key={c.title} className="cr-cap">
                <span className="cr-cap__num">0{i + 1}</span>
                <div>
                  <h3 className="cr-cap__title">{c.title}</h3>
                  <p className="cr-cap__body">{c.body}</p>
                  <code className="cr-cap__sig">{c.sig}</code>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
