// Vantline logo: a horizon line with a chevron rising above it, set beside the lowercase wordmark.
export function Mark() {
  return (
    <svg
      className="au-mark"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 14h14" />
      <path d="M4 9.75 9 4.75l5 5" />
    </svg>
  );
}

export default function Logo() {
  return (
    <>
      <Mark />
      <span className="au-wordmark__text">vantline</span>
    </>
  );
}
