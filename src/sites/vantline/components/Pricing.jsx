import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { gsap, useGSAP, MOTION_OK, prefersReducedMotion } from '../../../shared/gsap.js';
import { IMG, PLANS, money, priceFor } from '../data.js';
import { Photo, PillButton, useReducedPref } from './ui.jsx';

/** Price that counts to its new value when billing changes. */
function Price({ value }) {
  const ref = useRef(null);
  const shown = useRef(value);
  // React only renders the first value; later changes are written by the tween.
  const initial = useRef(money(value)).current;
  useEffect(() => {
    const el = ref.current;
    if (prefersReducedMotion() || shown.current === value) {
      shown.current = value;
      el.textContent = money(value);
      return;
    }
    const p = { v: shown.current };
    const t = gsap.to(p, {
      v: value,
      duration: 0.7,
      ease: 'power3.out',
      onUpdate: () => {
        shown.current = p.v;
        el.textContent = money(p.v);
      },
    });
    gsap.fromTo(el, { y: -6, filter: 'blur(4px)' }, { y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', clearProps: 'filter,transform' });
    return () => t.kill();
  }, [value]);
  return (
    <span className="au-plan__amount" ref={ref}>
      {initial}
    </span>
  );
}

export function BillingToggle({ billing, onChange, id = 'pricing' }) {
  const reduced = useReducedPref();
  return (
    <div className="au-billing" role="radiogroup" aria-label="Billing period">
      {['monthly', 'yearly'].map(b => (
        <button
          key={b}
          type="button"
          role="radio"
          aria-checked={billing === b}
          className="au-billing__opt"
          onClick={() => onChange(b)}
          onKeyDown={e => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
              e.preventDefault();
              const next = billing === 'monthly' ? 'yearly' : 'monthly';
              onChange(next);
              e.currentTarget.parentElement.querySelector(`[data-b="${next}"]`)?.focus();
            }
          }}
          tabIndex={billing === b ? 0 : -1}
          data-b={b}
        >
          {billing === b && (
            <motion.span
              className="au-billing__thumb"
              layoutId={`au-billing-${id}`}
              transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 38 }}
            />
          )}
          <span className="au-billing__text">{b === 'monthly' ? 'Monthly' : 'Yearly'}</span>
          {b === 'yearly' && <span className="au-billing__save">Save 20%</span>}
        </button>
      ))}
    </div>
  );
}

export default function Pricing({ billing, onBilling, onChoose }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(ref);
        gsap.from(q('.au-plan'), {
          y: 60,
          opacity: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('.au-plans')[0], start: 'top 85%', once: true },
        });
        gsap.fromTo(
          q('.au-pricing__bg img'),
          { yPercent: -6 },
          { yPercent: 6, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } }
        );
      });
    },
    { scope: ref }
  );

  return (
    <section className="au-pricing" id="plans" aria-labelledby="au-pricing-title" ref={ref}>
      <div className="au-pricing__bg" aria-hidden="true">
        <Photo id={IMG.plans} alt="" widths={[800, 1200, 1600, 2200, 2800]} sizes="100vw" />
      </div>
      <div className="au-pricing__inner">
        <div className="au-head au-head--tight">
          <h2 className="au-h2" id="au-pricing-title" data-au-reveal>
            Plans that <em>grow with your team</em>
          </h2>
          <p className="au-lede" data-au-reveal>
            Per-seat pricing with every plan billed the same way, monthly or yearly.
          </p>
          <div data-au-reveal>
            <BillingToggle billing={billing} onChange={onBilling} />
          </div>
        </div>

        <ul className="au-plans" role="list">
          {PLANS.map(plan => {
            const price = priceFor(plan, billing);
            const featured = plan.id === 'business';
            return (
              <li key={plan.id} className={`au-plan au-plan--${plan.id}`}>
                <div className="au-plan__top">
                  <h3 className="au-plan__name">{plan.name}</h3>
                  {featured && <span className="au-plan__badge">Multi-team</span>}
                </div>
                <p className="au-plan__price">
                  <Price value={price} />
                  <span className="au-plan__per">
                    / seat / month
                    <span className="au-plan__billed">{billing === 'yearly' ? `${money(price * 12)} per seat, billed yearly` : 'billed monthly'}</span>
                  </span>
                </p>
                <p className="au-plan__blurb">{plan.blurb}</p>
                <ul className="au-plan__list" role="list">
                  {plan.features.map(f => (
                    <li key={f}>
                      <span className="au-diamond" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <PillButton
                  className="au-plan__cta"
                  tone={featured ? 'light' : 'dark'}
                  onClick={() => onChoose(plan.id)}
                  aria-label={`Choose the ${plan.name} plan`}
                >
                  Choose {plan.name}
                </PillButton>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="sr-only" aria-live="polite">
        {billing === 'yearly' ? 'Yearly billing selected' : 'Monthly billing selected'}: {PLANS[0].name}{' '}
        {money(priceFor(PLANS[0], billing))} per seat per month, {PLANS[1].name} {money(priceFor(PLANS[1], billing))} per seat per month.
      </p>
    </section>
  );
}
