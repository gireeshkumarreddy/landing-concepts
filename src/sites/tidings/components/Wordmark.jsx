// Custom "tidings" wordmark: both i's are dotless, and their dots are drawn as two small
// speech bubbles facing each other — a tiny conversation inside the name.
function Bubble({ flip = false }) {
  return (
    <svg className={`ar-wm-dot ${flip ? 'is-flip' : ''}`} viewBox="0 0 12 11" aria-hidden="true" focusable="false">
      <path
        d="M2.6.6h6.8a2.1 2.1 0 0 1 2.1 2.1v3.4a2.1 2.1 0 0 1-2.1 2.1H5.3L2.5 10.4V8.2A2.1 2.1 0 0 1 .5 6.1V2.7A2.1 2.1 0 0 1 2.6.6z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Wordmark() {
  return (
    <span className="ar-wm" aria-hidden="true">
      t
      <span className="ar-wm-i">
        ı<Bubble />
      </span>
      d
      <span className="ar-wm-i">
        ı<Bubble flip />
      </span>
      ngs
    </span>
  );
}
