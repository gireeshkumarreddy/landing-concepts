import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import SectionHead from './SectionHead.jsx';
import Columns from './Columns.jsx';
import { useTidings } from '../hooks.jsx';
import { PLANS, REGIONS, REGION_ORDER } from '../data.js';
import { Flag, IconArrow, IconCheck } from '../icons.jsx';

const ease = [0.2, 0.7, 0.2, 1];

export default function Pricing() {
  const { region, setRegion, openWizard, openContact } = useTidings();
  const [yearly, setYearly] = useState(false);
  const r = REGIONS[region];

  return (
    <section id="pricing" className="ar-section ar-pricing" aria-labelledby="ar-pricing-title" data-bg="">
      <div className="ar-wrap">
        <SectionHead
          id="ar-pricing-title"
          eyebrow="Pricing"
          title="Straightforward plans, fees passed through at cost."
          lead="All plans include the builder, product messages and core analytics. Pay yearly and two months are on us."
          align="center"
        />

        <div className="ar-price-ctrls" data-reveal="fade" data-reveal-delay="0.2">
          <div className="ar-seg is-lg" role="group" aria-label="Billing period">
            {[
              [false, 'Monthly'],
              [true, 'Yearly'],
            ].map(([val, label]) => (
              <button key={label} type="button" className={`ar-seg-opt ${yearly === val ? 'is-on' : ''}`} aria-pressed={yearly === val} onClick={() => setYearly(val)}>
                {yearly === val && <motion.span layoutId="ar-bill-pill" className="ar-seg-pill" transition={{ duration: 0.3, ease }} />}
                <span className="ar-seg-text">
                  {label}
                  {val && <span className="ar-save">2 months free</span>}
                </span>
              </button>
            ))}
          </div>
          <div className="ar-seg is-lg" role="radiogroup" aria-label="Currency">
            {REGION_ORDER.map(code => (
              <label key={code} className={`ar-seg-opt ${region === code ? 'is-on' : ''}`}>
                <input type="radio" name="ar-price-region" className="sr-only" checked={region === code} onChange={() => setRegion(code)} />
                {region === code && <motion.span layoutId="ar-cur-pill" className="ar-seg-pill" transition={{ duration: 0.3, ease }} />}
                <span className="ar-seg-text">
                  <Flag code={code} className="ar-flag" />
                  {REGIONS[code].symbol} {REGIONS[code].currency}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="ar-plans" data-reveal="stagger" data-reveal-stagger="0.1">
          {PLANS.map(p => {
            const monthly = p.price?.[region];
            const shown = monthly ? (yearly ? Math.round((monthly * 10) / 12) : monthly) : null;
            return (
              <article key={p.id} className={`ar-plan ${p.featured ? 'is-featured' : ''}`} aria-labelledby={`ar-plan-${p.id}`}>
                {p.featured && <Columns className="is-plan" specks={false} />}
                <div className="ar-plan-head">
                  <h3 id={`ar-plan-${p.id}`} className="ar-plan-name">
                    {p.name}
                  </h3>
                  {p.featured && <span className="ar-plan-tag">Popular</span>}
                </div>
                <p className="ar-plan-blurb">{p.blurb}</p>
                <div className="ar-plan-price">
                  {shown ? (
                    <>
                      <span className="ar-plan-amount">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={`${region}-${yearly}`}
                            initial={{ y: '60%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '-60%', opacity: 0 }}
                            transition={{ duration: 0.32, ease }}
                          >
                            {r.symbol}
                            {shown}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                      <span className="ar-plan-per">
                        / month
                        <span className="ar-plan-bill">{yearly ? `billed ${r.symbol}${monthly * 10} yearly` : 'billed monthly'}</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="ar-plan-amount is-custom">Custom</span>
                      <span className="ar-plan-per">
                        <span className="ar-plan-bill">priced on your volume</span>
                      </span>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  className={`ar-btn is-block ${p.featured ? 'ar-btn-white' : p.price ? 'ar-btn-ink' : 'ar-btn-ghost'}`}
                  onClick={() => (p.price ? openWizard(p.id) : openContact())}
                >
                  {p.cta} <IconArrow size={16} sw={2} />
                </button>
                <ul className="ar-plan-feats" role="list">
                  {p.features.map(f => (
                    <li key={f}>
                      <span className="ar-plan-check" aria-hidden="true">
                        <IconCheck size={12} sw={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
        <p className="ar-price-note" data-reveal="fade">
          Meta’s conversation fees are passed through at cost and shown separately. Prices in {r.currency}, excluding VAT and sales tax.
        </p>
      </div>
    </section>
  );
}
