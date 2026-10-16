import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../../../shared/gsap.js';
import { MODELS, REQUEST_STEPS } from '../data.js';
import { money, useSagewell } from '../lib.js';
import { IconArrowRight } from '../icons.jsx';

const fmtInt = n => n.toLocaleString('en-US');
const compact = n => (n >= 1e6 ? `${n / 1e6}M` : n >= 1000 ? `${n / 1000}k` : String(n));

function Range({ id, label, value, min, max, step, onChange, display, valuetext }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="cr-range">
      <div className="cr-range__top">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{display}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(+e.target.value)}
        aria-valuetext={valuetext}
        style={{ '--cr-range': `${pct}%` }}
      />
    </div>
  );
}

function AnimatedMoney({ value }) {
  const ref = useRef(null);
  const state = useRef({ v: value });
  useLayoutEffect(() => {
    if (ref.current) ref.current.textContent = money(state.current.v);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      state.current.v = value;
      el.textContent = money(value);
      return;
    }
    const tw = gsap.to(state.current, {
      v: value,
      duration: 0.6,
      ease: 'power3.out',
      onUpdate: () => (el.textContent = money(state.current.v)),
    });
    return () => tw.kill();
  }, [value]);
  return (
<span ref={ref} className="cr-calc__num" aria-hidden="true" />
  );
}

export default function Pricing() {
  const { openAccess } = useSagewell();
  const [modelId, setModelId] = useState('sagewell-2');
  const [reqIdx, setReqIdx] = useState(5);
  const [inTok, setInTok] = useState(1200);
  const [outTok, setOutTok] = useState(600);
  const [announce, setAnnounce] = useState('');

  const model = MODELS.find(m => m.id === modelId);
  const requests = REQUEST_STEPS[reqIdx];
  const inputCost = (requests * inTok * model.input) / 1e6;
  const outputCost = (requests * outTok * model.output) / 1e6;
  const total = inputCost + outputCost;
  const perReq = total / requests;

  useEffect(() => {
    const t = setTimeout(() => setAnnounce(`Roughly ${money(total)} a month`), 700);
    return () => clearTimeout(t);
  }, [total]);

  return (
    <section className="cr-section cr-pricing" id="pricing" aria-labelledby="cr-pricing-title">
      <div className="cr-wrap cr-pricing__grid">
        <div className="cr-pricing__main">
          <p className="cr-eyebrow" data-cr-reveal>
            <b>05</b> Pricing
          </p>
          <h2 id="cr-pricing-title" className="cr-h2" data-cr-reveal>
            Pay for thinking, <br className="cr-br-lg" />
            not seats.
          </h2>
          <p className="cr-lede" data-cr-reveal>
            Billed per million tokens, with the trail counted as output. Choosing a lighter depth for routine
            questions is the simplest way to keep a bill small.
          </p>

          <div className="cr-table-wrap" data-cr-reveal>
            <table className="cr-table">
              <caption className="sr-only">Cost per million tokens for each Sagewell model</caption>
              <thead>
                <tr>
                  <th scope="col">Model</th>
                  <th scope="col">
                    Prompt <span>per 1M tokens</span>
                  </th>
                  <th scope="col">
                    Reply + trail <span>per 1M tokens</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {MODELS.map(m => (
                  <tr key={m.id}>
                    <th scope="row">
                      <code>{m.label}</code>
                      <span>{m.note}</span>
                    </th>
                    <td>{money(m.input, 2)}</td>
                    <td>{money(m.output, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="cr-table__note">Illustrative pricing for a concept product.</p>
          </div>
        </div>

        <div className="cr-calc" data-cr-reveal>
          <div className="cr-calc__head">
            <h3 className="cr-calc__title">Rough monthly cost</h3>
            <fieldset className="cr-seg" aria-label="Model">
              <legend className="sr-only">Model</legend>
              {MODELS.map(m => (
                <label key={m.id} className={modelId === m.id ? 'is-on' : ''}>
                  <input
                    type="radio"
                    name="cr-calc-model"
                    value={m.id}
                    checked={modelId === m.id}
                    onChange={() => setModelId(m.id)}
                  />
                  <span>{m.label}</span>
                </label>
              ))}
            </fieldset>
          </div>

          <div className="cr-calc__result">
            <AnimatedMoney value={total} />
            <span className="cr-calc__per">a month, before tax</span>
            <p className="sr-only" aria-live="polite">
              {announce}
            </p>
          </div>
          <dl className="cr-calc__split">
            <div>
              <dt>Prompts</dt>
              <dd>{money(inputCost)}</dd>
            </div>
            <div>
              <dt>Replies</dt>
              <dd>{money(outputCost)}</dd>
            </div>
            <div>
              <dt>Per question</dt>
              <dd>{perReq < 0.01 ? `$${perReq.toFixed(4)}` : money(perReq, 3)}</dd>
            </div>
          </dl>

          <div className="cr-calc__ranges">
            <Range
              id="cr-calc-req"
              label="Questions per month"
              min={0}
              max={REQUEST_STEPS.length - 1}
              step={1}
              value={reqIdx}
              onChange={setReqIdx}
              display={compact(requests)}
              valuetext={`${fmtInt(requests)} questions`}
            />
            <Range
              id="cr-calc-in"
              label="Typical prompt length (tokens)"
              min={100}
              max={20000}
              step={100}
              value={inTok}
              onChange={setInTok}
              display={fmtInt(inTok)}
              valuetext={`${fmtInt(inTok)} tokens`}
            />
            <Range
              id="cr-calc-out"
              label="Typical reply with trail (tokens)"
              min={100}
              max={8000}
              step={100}
              value={outTok}
              onChange={setOutTok}
              display={fmtInt(outTok)}
              valuetext={`${fmtInt(outTok)} tokens`}
            />
          </div>

          <div className="cr-calc__foot">
            <p>A sketch, not a quote. Trail length varies with the question and the depth you choose.</p>
            <button type="button" className="cr-btn cr-btn--ink" onClick={openAccess}>
              Request access
              <IconArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
