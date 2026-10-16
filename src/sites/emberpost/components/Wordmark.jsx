// The Emberpost logo: the lowercase wordmark plus a small glowing spark, drawn inline.
export default function Wordmark({ className = '' }) {
  return (
    <a href="#top" className={`ta-wordmark ${className}`} aria-label="Emberpost, back to top">
      <span className="ta-wordmark__text">emberpost</span>
      <svg className="ta-wordmark__spark" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.14" />
        <circle cx="8" cy="8" r="5.4" fill="currentColor" opacity="0.28" />
        <circle cx="8" cy="8" r="3.5" fill="currentColor" />
        <circle cx="6.9" cy="6.9" r="1.2" fill="#fff" opacity="0.8" />
      </svg>
    </a>
  );
}
