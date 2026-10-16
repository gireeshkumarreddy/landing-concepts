import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../../../shared/gsap.js';
import { CHART_MAX, CHART_TICKS, DEFAULT_RANGE, RANGES, fmtCount, fmtTick } from '../data.js';

const SAMPLES = 140;
const PAD = { l: 38, r: 10, t: 12, b: 28 };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Uniform Catmull-Rom through the data points, so the curve passes through every sample value.
function spline(values, t) {
  const n = values.length;
  if (n === 1) return values[0];
  const f = t * (n - 1);
  const i = Math.min(n - 2, Math.floor(f));
  const u = f - i;
  const p0 = values[Math.max(0, i - 1)];
  const p1 = values[i];
  const p2 = values[i + 1];
  const p3 = values[Math.min(n - 1, i + 2)];
  return 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
}
function scales({ w, h }) {
  const plotW = Math.max(10, w - PAD.l - PAD.r);
  const plotH = Math.max(10, h - PAD.t - PAD.b);
  return { plotW, xAt: t => PAD.l + t * plotW, yAt: v => PAD.t + (1 - v / CHART_MAX) * plotH };
}

const resample = values => Array.from({ length: SAMPLES }, (_, k) => clamp(spline(values, k / (SAMPLES - 1)), CHART_MAX * 0.01, CHART_MAX * 0.99));

const SignalChart = forwardRef(function SignalChart(_, apiRef) {
  const wrapRef = useRef(null);
  const lineRef = useRef(null);
  const areaRef = useRef(null);
  const baseRef = useRef(null);
  const cur = useRef(null);
  const tween = useRef(null);
  const [range, setRange] = useState(DEFAULT_RANGE);
  const [compare, setCompare] = useState(false);
  const [hover, setHover] = useState(null);
  const [kbd, setKbd] = useState(false);
  const [size, setSize] = useState({ w: 560, h: 240 });

  const data = RANGES[range];
  const target = useMemo(
    () => ({ v: resample(data.map(d => d.v)), b: resample(data.map(d => d.b)) }),
    [data]
  );

  const { plotW, xAt, yAt } = scales(size);
  // The draw routine always reads the latest measured size (tweens outlive renders).
  const sizeRef = useRef(size);
  sizeRef.current = size;

  const draw = () => {
    const c = cur.current;
    if (!c || !lineRef.current) return;
    const { xAt, yAt } = scales(sizeRef.current);
    let d = '';
    let b = '';
    for (let k = 0; k < SAMPLES; k++) {
      const x = xAt(k / (SAMPLES - 1)).toFixed(1);
      d += `${k ? 'L' : 'M'}${x} ${yAt(c.v[k]).toFixed(1)}`;
      b += `${k ? 'L' : 'M'}${x} ${yAt(c.b[k]).toFixed(1)}`;
    }
    lineRef.current.setAttribute('d', d);
    areaRef.current.setAttribute('d', `${d}L${xAt(1).toFixed(1)} ${yAt(0)}L${xAt(0)} ${yAt(0)}Z`);
    baseRef.current.setAttribute('d', b);
  };

  // Measure the plot.
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Redraw on resize.
  useLayoutEffect(draw, [size.w, size.h]); // eslint-disable-line react-hooks/exhaustive-deps

  // Morph between ranges by tweening every resampled point.
  useLayoutEffect(() => {
    if (!cur.current || prefersReducedMotion()) {
      cur.current = { v: [...target.v], b: [...target.b] };
      draw();
      return;
    }
    const from = { v: [...cur.current.v], b: [...cur.current.b] };
    if (from.v.every((a, k) => a === target.v[k])) return;
    const p = { t: 0 };
    tween.current?.kill();
    tween.current = gsap.to(p, {
      t: 1,
      duration: 0.9,
      ease: 'power3.inOut',
      onUpdate: () => {
        const t = p.t;
        cur.current = {
          v: from.v.map((a, k) => a + (target.v[k] - a) * t),
          b: from.b.map((a, k) => a + (target.b[k] - a) * t),
        };
        draw();
      },
    });
    return () => tween.current?.kill();
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  // Let the parent run the draw-on animation.
  useImperativeHandle(apiRef, () => ({ line: lineRef.current, area: areaRef.current }), []);

  const n = data.length;
  const idxFromX = clientX => {
    const r = wrapRef.current.getBoundingClientRect();
    const t = clamp((clientX - r.left - PAD.l) / plotW, 0, 1);
    return Math.round(t * (n - 1));
  };
  const onPointer = e => {
    setKbd(false);
    setHover(idxFromX(e.clientX));
  };
  const onLeave = e => {
    if (e.pointerType !== 'touch') setHover(null);
  };
  const onKey = e => {
    const map = { ArrowRight: 1, ArrowLeft: -1 };
    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      setKbd(true);
      setHover(e.key === 'Home' ? 0 : n - 1);
    } else if (map[e.key]) {
      e.preventDefault();
      setKbd(true);
      setHover(h => clamp((h ?? n - 1) + map[e.key], 0, n - 1));
    } else if (e.key === 'Escape') setHover(null);
  };

  const h = hover != null && hover < n ? hover : null;
  const pt = h != null ? data[h] : null;
  const hx = h != null ? xAt(n === 1 ? 1 : h / (n - 1)) : 0;
  const hy = pt ? yAt(pt.v) : 0;
  const tipLeft = clamp(hx, 84, size.w - 84);
  const tipBelow = hy < 70;

  const first = data[0].v;
  const last = data[n - 1].v;
  const lastBase = data[n - 1].b;
  const delta = Math.round(((last - lastBase) / lastBase) * 100);
  const rangeWords = { '1W': 'week', '1M': 'month', '1Q': 'quarter' }[range];
  const peak = data.reduce((m, d) => (d.v > m.v ? d : m), data[0]);
  const xLabels = [0, Math.round((n - 1) / 3), Math.round(((n - 1) * 2) / 3), n - 1];

  return (
    <div className="au-chart">
      <div className="au-chart__bar">
        <div className="au-chart__metric">
          <span className="au-chart__label">Weekly active accounts</span>
          <span className="au-chart__value">{fmtCount(last)}</span>
          <span className="au-chart__tags">
            <span className="au-chart__delta">
              {delta >= 0 ? '+' : '−'}
              {Math.abs(delta)}% vs last quarter
            </span>
            <span className="au-chart__tag">Sample data</span>
          </span>
        </div>
        <div className="au-chart__controls">
          <div className="au-seg" role="group" aria-label="Time range: week, month or quarter">
            {Object.keys(RANGES).map(k => (
              <button
                key={k}
                type="button"
                className="au-seg__btn"
                aria-pressed={range === k}
                onClick={() => {
                  setRange(k);
                  setHover(null);
                }}
              >
                {k}
              </button>
            ))}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={compare}
            className="au-switch"
            onClick={() => setCompare(c => !c)}
          >
            <span className="au-switch__track" aria-hidden="true">
              <span className="au-switch__thumb" />
            </span>
            Show last quarter
          </button>
        </div>
      </div>

      <div
        className="au-chart__plot"
        ref={wrapRef}
        tabIndex={0}
        role="group"
        aria-label={`Weekly active accounts over the last ${rangeWords}, sample data. Use the arrow keys to read values.`}
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        onPointerLeave={onLeave}
        onKeyDown={onKey}
        onBlur={() => kbd && setHover(null)}
      >
        <svg width={size.w} height={size.h} aria-hidden="true" className="au-chart__svg">
          <defs>
            <linearGradient id="au-vl-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d8ef5a" stopOpacity="0.24" />
              <stop offset="1" stopColor="#d8ef5a" stopOpacity="0" />
            </linearGradient>
          </defs>
          {CHART_TICKS.map(t => (
            <g key={t}>
              <line className="au-chart__grid" x1={PAD.l} x2={size.w - PAD.r} y1={yAt(t)} y2={yAt(t)} />
              <text className="au-chart__ytick" x={0} y={yAt(t)} dy="0.32em">
                {fmtTick(t)}
              </text>
            </g>
          ))}
          {xLabels.map((i, k) => (
            <text
              key={k}
              className="au-chart__xtick"
              x={xAt(n === 1 ? 1 : i / (n - 1))}
              y={size.h - 6}
              textAnchor={k === 0 ? 'start' : k === xLabels.length - 1 ? 'end' : 'middle'}
            >
              {data[i].label}
            </text>
          ))}
          <path ref={areaRef} className="au-chart__area" fill="url(#au-vl-area)" />
          <g className={`au-chart__baseline${compare ? ' is-on' : ''}`}>
            <path ref={baseRef} className="au-chart__base" />
          </g>
          <path ref={lineRef} className="au-chart__line" pathLength="1" />
          {pt && (
            <g className="au-chart__cross">
              <line x1={hx} x2={hx} y1={PAD.t} y2={yAt(0)} />
              {compare && <circle className="au-chart__dot au-chart__dot--base" cx={hx} cy={yAt(pt.b)} r="3.5" />}
              <circle className="au-chart__dot" cx={hx} cy={hy} r="5" />
            </g>
          )}
        </svg>
        {pt && (
          <div className={`au-chart__tip${tipBelow ? ' is-below' : ''}`} style={{ left: tipLeft, top: hy }}>
            <span className="au-chart__tipdate">{pt.long}</span>
            <span className="au-chart__tipval">
              {fmtCount(pt.v)} <small>accounts</small>
            </span>
            {compare && <span className="au-chart__tipbase">Last quarter {fmtCount(pt.b)}</span>}
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {kbd && pt ? `${pt.long}: ${fmtCount(pt.v)} accounts${compare ? `, last quarter ${fmtCount(pt.b)}` : ''}` : ''}
      </p>
      <p className="sr-only">
        Sample data. Over the last {rangeWords}, weekly active accounts moved from {fmtCount(first)} to {fmtCount(last)}, peaking at {fmtCount(peak.v)} on {peak.long}.
      </p>
    </div>
  );
});

export default SignalChart;
