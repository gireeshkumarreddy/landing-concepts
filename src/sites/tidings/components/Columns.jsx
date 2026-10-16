// Vertical light columns + a few slow light specks (shared by the hero and the final CTA band).
const BARS = [
  { l: 0.5, w: 4.2, t: 34, o: 0.55, d: 9 },
  { l: 5.4, w: 6.8, t: 22, o: 0.8, d: 12 },
  { l: 13.2, w: 3.6, t: 40, o: 0.45, d: 8 },
  { l: 17.6, w: 7.4, t: 18, o: 0.7, d: 11 },
  { l: 26.4, w: 5.2, t: 30, o: 0.5, d: 10 },
  { l: 32.6, w: 6.2, t: 12, o: 0.65, d: 13 },
  { l: 40.2, w: 4.4, t: 26, o: 0.45, d: 9 },
  { l: 45.8, w: 8.2, t: 8, o: 0.6, d: 12 },
  { l: 55.2, w: 4.8, t: 24, o: 0.5, d: 10 },
  { l: 61.2, w: 6.6, t: 14, o: 0.7, d: 11 },
  { l: 69.0, w: 3.8, t: 36, o: 0.45, d: 8 },
  { l: 73.8, w: 7.2, t: 20, o: 0.75, d: 13 },
  { l: 82.4, w: 5.0, t: 28, o: 0.55, d: 9 },
  { l: 88.6, w: 6.4, t: 16, o: 0.7, d: 12 },
  { l: 96.0, w: 4.0, t: 38, o: 0.5, d: 10 },
];

const SPECKS = [
  [4, 62, 2], [11, 84, 3], [19, 48, 2], [23, 76, 2], [31, 90, 3], [38, 58, 2], [52, 92, 2],
  [64, 70, 3], [71, 52, 2], [78, 86, 2], [84, 64, 3], [91, 80, 2], [96, 56, 2], [58, 60, 2],
];

export default function Columns({ className = '', specks = true }) {
  return (
    <div className={`ar-columns ${className}`} aria-hidden="true">
      {BARS.map((b, i) => (
        <span
          key={i}
          className="ar-col"
          style={{
            left: `${b.l}%`,
            width: `${b.w}%`,
            top: `${b.t}%`,
            '--o': b.o,
            animationDuration: `${b.d}s`,
            animationDelay: `${-i * 1.7}s`,
          }}
        />
      ))}
      {specks &&
        SPECKS.map(([x, y, s], i) => (
          <span
            key={`s${i}`}
            className="ar-speck"
            style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDuration: `${10 + (i % 5) * 2}s`, animationDelay: `${-i * 1.3}s` }}
          />
        ))}
    </div>
  );
}
