import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import SectionHead from './SectionHead.jsx';
import { useTidings, useCountUp } from '../hooks.jsx';
import { CAMPAIGNS, REGIONS, STAGES, fmt } from '../data.js';

const H = 150;
const PX = 6;
const PY = 14;

function Num({ value, active, format = fmt, suffix = '' }) {
  const v = useCountUp(value, { active, duration: 1000 });
  return (
    <>
      {format(v)}
      {suffix}
    </>
  );
}

function buildPath(vals, W) {
  const max = Math.max(...vals) * 1.12;
  const pts = vals.map((v, i) => [PX + (i * (W - 2 * PX)) / (vals.length - 1), H - PY - (v / max) * (H - 2 * PY)]);
  const f = n => n.toFixed(1);
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1y = Math.min(H - PY, p1[1] + (p2[1] - p0[1]) / 6);
    const c2y = Math.min(H - PY, p2[1] - (p3[1] - p1[1]) / 6);
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(c1y)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(c2y)} ${f(p2[0])},${f(p2[1])}`;
  }
  const area = `${d} L${f(pts[pts.length - 1][0])},${H - PY} L${f(pts[0][0])},${H - PY} Z`;
  return { d, area, pts, max };
}

function Sparkline({ campaign, active }) {
  // The chart is drawn in real pixels (viewBox = rendered width) so strokes and the dot never distort.
  const plotRef = useRef(null);
  const [W, setW] = useState(420);
  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(200, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { d, area, pts } = useMemo(() => buildPath(campaign.taps, W), [campaign, W]);
  const [hover, setHover] = useState(null);
  const peak = campaign.taps.indexOf(Math.max(...campaign.taps));
  const idx = hover ?? peak;
  const onMove = e => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((x - PX) / (W - 2 * PX)) * (campaign.taps.length - 1));
    setHover(Math.max(0, Math.min(campaign.taps.length - 1, i)));
  };
  const onKey = e => {
    const n = campaign.taps.length;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setHover(h => {
        const cur = h ?? peak;
        return Math.max(0, Math.min(n - 1, cur + (e.key === 'ArrowRight' ? 1 : -1)));
      });
    }
    if (e.key === 'Home') setHover(0);
    if (e.key === 'End') setHover(n - 1);
  };
  const [x, y] = pts[idx];
  return (
    <div className="ar-spark">
      <div className="ar-spark-head">
        <span className="ar-kpi-label">Taps per hour</span>
        <span className="ar-spark-read" aria-live="polite">
          <strong>{fmt(campaign.taps[idx])}</strong> taps · hour {idx + 1}
          {hover === null ? ' (peak)' : ''}
        </span>
      </div>
      <div
        className="ar-spark-plot"
        tabIndex={0}
        role="group"
        aria-label={`Taps per hour for the first 24 hours of ${campaign.name}. Use the left and right arrow keys to read each hour.`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        onKeyDown={onKey}
        onBlur={() => setHover(null)}
      >
        <svg ref={plotRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="ar-spark-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#6a5cff" stopOpacity=".45" />
              <stop offset="1" stopColor="#6a5cff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map(g => (
            <line key={g} x1={PX} x2={W - PX} y1={PY + (H - 2 * PY) * g} y2={PY + (H - 2 * PY) * g} className="ar-spark-grid" />
          ))}
          <motion.path
            className="ar-spark-area"
            initial={{ d: area, opacity: 0 }}
            animate={{ d: area, opacity: active ? 1 : 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
            fill="url(#ar-spark-fill)"
          />
          <motion.path
            className="ar-spark-line"
            initial={{ d, pathLength: 0 }}
            animate={{ d, pathLength: active ? 1 : 0 }}
            transition={{ d: { duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }, pathLength: { duration: 1.4, ease: [0.2, 0.7, 0.2, 1] } }}
            fill="none"
          />
          <line x1={x} x2={x} y1={PY - 6} y2={H - PY} className="ar-spark-guide" />
          <circle cx={x} cy={y} r="5" className="ar-spark-dot" />
        </svg>
        <div className="ar-spark-axis" aria-hidden="true">
          <span>Send</span>
          <span>+6h</span>
          <span>+12h</span>
          <span>+18h</span>
          <span>+24h</span>
        </div>
      </div>
    </div>
  );
}

export default function Analytics() {
  const { region } = useTidings();
  const [sel, setSel] = useState(0);
  const tabs = useRef([]);
  const panelRef = useRef(null);
  const inView = useInView(panelRef, { once: true, amount: 0.3 });
  const c = CAMPAIGNS[sel];
  const sent = c.funnel.Sent;
  const del = c.funnel.Delivered;
  const r = REGIONS[region];

  const onKey = e => {
    const n = CAMPAIGNS.length;
    let next = null;
    // Up / Down too: on phones the tabs stack into a column.
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (sel + 1) % n;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (sel - 1 + n) % n;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = n - 1;
    if (next !== null) {
      e.preventDefault();
      setSel(next);
      tabs.current[next]?.focus();
    }
  };

  const money = v => `${r.symbol}${fmt(v)}`;

  return (
    <section id="analytics" className="ar-section ar-analytics" aria-labelledby="ar-analytics-title" data-bg="#15162b">
      <div className="ar-wrap">
        <SectionHead
          id="ar-analytics-title"
          eyebrow="Analytics"
          title="See what every message earns."
          lead="Follow each campaign from the first delivery to the last sale. Pick a sample campaign to explore."
        />
        <div className="ar-dash" ref={panelRef} data-reveal="fade" data-reveal-delay="0.1">
          <div className="ar-dash-top">
            <div className="ar-tabs" role="tablist" aria-label="Sample campaigns">
              {CAMPAIGNS.map((x, i) => (
                <button
                  key={x.id}
                  ref={el => (tabs.current[i] = el)}
                  type="button"
                  role="tab"
                  id={`ar-tab-${x.id}`}
                  aria-selected={sel === i}
                  aria-controls="ar-dash-panel"
                  tabIndex={sel === i ? 0 : -1}
                  className={`ar-tab ${sel === i ? 'is-on' : ''}`}
                  onClick={() => setSel(i)}
                  onKeyDown={onKey}
                >
                  {sel === i && <motion.span layoutId="ar-tab-pill" className="ar-tab-pill" transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }} />}
                  <span className="ar-tab-text">{x.name}</span>
                </button>
              ))}
            </div>
            <span className="ar-sample-tag">Sample data</span>
          </div>

          <div className="ar-dash-body" id="ar-dash-panel" role="tabpanel" aria-labelledby={`ar-tab-${c.id}`}>
            <div className="ar-funnel">
              <p className="ar-dash-meta">
                <span>{c.type}</span>
                <span>{c.date}</span>
              </p>
              <ol className="ar-funnel-rows" role="list">
                {STAGES.map((s, i) => {
                  const val = c.funnel[s];
                  const pct = val / sent;
                  return (
                    <li key={s} className="ar-frow" style={{ '--i': i }}>
                      <span className="ar-frow-label">{s}</span>
                      <span className="ar-frow-track" aria-hidden="true">
                        <span className="ar-frow-fill" style={{ transform: `scaleX(${inView ? Math.max(pct, 0.012) : 0})` }} />
                      </span>
                      <span className="ar-frow-val">
                        <Num value={val} active={inView} />
                      </span>
                      <span className="ar-frow-pct">{i === 0 ? '100%' : `${(pct * 100).toFixed(1)}%`}</span>
                    </li>
                  );
                })}
              </ol>
              <p className="ar-funnel-foot">
                Every stage counts unique contacts<span className="ar-funnel-base">; percentages are of messages sent</span>. A conversion is a
                purchase or booking made within 7 days of tapping the message.
              </p>
            </div>

            <div className="ar-dash-side">
              <div className="ar-revenue">
                <span className="ar-kpi-label">Attributed revenue · {r.currency}</span>
                <span className="ar-revenue-num">
                  <Num value={c.revenue * r.rate} active={inView} format={money} />
                </span>
              </div>
              <dl className="ar-kpis">
                <div>
                  <dt className="ar-kpi-label">
                    Read rate
                    <span className="ar-kpi-base"> of delivered</span>
                  </dt>
                  <dd>
                    <Num value={(c.funnel.Read / del) * 100} active={inView} format={v => v.toFixed(1)} suffix="%" />
                  </dd>
                </div>
                <div>
                  <dt className="ar-kpi-label">
                    Tap rate
                    <span className="ar-kpi-base"> of delivered</span>
                  </dt>
                  <dd>
                    <Num value={(c.funnel.Tapped / del) * 100} active={inView} format={v => v.toFixed(1)} suffix="%" />
                  </dd>
                </div>
                <div>
                  <dt className="ar-kpi-label">
                    Conversion
                    <span className="ar-kpi-base"> of delivered</span>
                  </dt>
                  <dd>
                    <Num value={(c.funnel.Converted / del) * 100} active={inView} format={v => v.toFixed(1)} suffix="%" />
                  </dd>
                </div>
              </dl>
              <Sparkline campaign={c} active={inView} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
