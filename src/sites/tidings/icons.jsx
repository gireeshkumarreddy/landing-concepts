import { useId } from 'react';
// Functional UI icons, drawn on a 24px grid with a consistent 1.8 stroke.

const S = ({ children, size = 18, sw = 1.8, className, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
    {...rest}
  >
    {children}
  </svg>
);

export const IconArrow = p => (
  <S {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </S>
);
export const IconChevronDown = p => (
  <S {...p}>
    <path d="M6 9l6 6 6-6" />
  </S>
);
export const IconChevronLeft = p => (
  <S {...p}>
    <path d="M15 18l-6-6 6-6" />
  </S>
);
export const IconSearch = p => (
  <S {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </S>
);
export const IconCamera = p => (
  <S {...p}>
    <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2l1.4-2h5.8l1.4 2h2.2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" />
    <circle cx="12" cy="13" r="3.4" />
  </S>
);
export const IconMore = p => (
  <S {...p} sw={0}>
    <circle cx="12" cy="5.5" r="1.7" fill="currentColor" />
    <circle cx="12" cy="12" r="1.7" fill="currentColor" />
    <circle cx="12" cy="18.5" r="1.7" fill="currentColor" />
  </S>
);
export const IconCheck = p => (
  <S {...p}>
    <path d="M5 12.5l4.2 4.2L19 7" />
  </S>
);
export const IconDoubleCheck = p => (
  <S {...p} viewBox="0 0 28 24">
    <path d="M3 12.8l4 4L16 7.5" />
    <path d="M12.5 15.4l1.4 1.4L23 7.5" />
  </S>
);
export const IconClose = p => (
  <S {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </S>
);
export const IconMenu = p => (
  <S {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </S>
);
export const IconPlus = p => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);
export const IconSend = p => (
  <S {...p}>
    <path d="M5 12l14-7-5 15-2.5-6.2z" />
    <path d="M11.5 13.8L19 5" />
  </S>
);
export const IconExternal = p => (
  <S {...p}>
    <path d="M14 4h6v6M20 4l-8.5 8.5" />
    <path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
  </S>
);
export const IconLink = p => (
  <S {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </S>
);
export const IconTag = p => (
  <S {...p}>
    <path d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1a1 1 0 0 1 .7.3l7.2 7.2a1 1 0 0 1 0 1.4l-8.1 8.1a1 1 0 0 1-1.4 0l-7.2-7.2a1 1 0 0 1-.3-.7z" />
    <circle cx="8.5" cy="8.5" r="1.6" />
  </S>
);
export const IconCalendar = p => (
  <S {...p}>
    <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
    <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
  </S>
);
export const IconCard = p => (
  <S {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
    <path d="M3 10h18M7 15h4" />
  </S>
);
export const IconCopy = p => (
  <S {...p}>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" />
  </S>
);
export const IconClock = p => (
  <S {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 7.5V12l3 2" />
  </S>
);
export const IconReplay = p => (
  <S {...p}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7" />
    <path d="M4 4.5V9h4.5" />
  </S>
);
export const IconBolt = p => (
  <S {...p}>
    <path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" />
  </S>
);
export const IconCart = p => (
  <S {...p}>
    <path d="M3.5 4.5h2l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h7.9a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.6" />
    <circle cx="9.5" cy="19.5" r="1.2" />
    <circle cx="17" cy="19.5" r="1.2" />
  </S>
);
export const IconUsers = p => (
  <S {...p}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.5 14.2A5.5 5.5 0 0 1 20.5 19" />
  </S>
);

/** Plain chat-bubble glyph (deliberately not a brand logo). */
export const IconChatBubble = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M12 3.6a8.4 8.4 0 0 0-7.3 12.6L3.6 20.4l4.3-1.1A8.4 8.4 0 1 0 12 3.6z"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <path d="M8.6 12h.01M12 12h.01M15.4 12h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

/** Small spinner for loading states. */
export const Spinner = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={`ar-spin ${className || ''}`}>
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/* ---------- Region flags (simplified national flags for the region selector) ---------- */
export function Flag({ code, className }) {
  const uid = useId().replace(/:/g, '');
  if (code === 'UK') {
    return (
      <svg viewBox="0 0 60 40" className={className} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
        <clipPath id={`${uid}t`}>
          <path d="M30,20 h30 v20 z v20 h-30 z h-30 v-20 z v-20 h30 z" />
        </clipPath>
        <rect width="60" height="40" fill="#012169" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
        <path d="M0,0 L60,40 M60,0 L0,40" clipPath={`url(#${uid}t)`} stroke="#C8102E" strokeWidth="5" />
        <path d="M30,0 v40 M0,20 h60" stroke="#fff" strokeWidth="12" />
        <path d="M30,0 v40 M0,20 h60" stroke="#C8102E" strokeWidth="7" />
      </svg>
    );
  }
  if (code === 'US') {
    return (
      <svg viewBox="0 0 60 40" className={className} aria-hidden="true" focusable="false">
        <rect width="60" height="40" fill="#fff" />
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <rect key={i} y={i * 6.15} width="60" height="3.08" fill="#B22234" />
        ))}
        <rect width="26" height="21.5" fill="#3C3B6E" />
        {[0, 1, 2, 3].map(r =>
          [0, 1, 2, 3, 4].map(c => <circle key={`${r}${c}`} cx={3.2 + c * 4.9 + (r % 2) * 2.4} cy={3.2 + r * 5} r="0.95" fill="#fff" />)
        )}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true" focusable="false">
      <rect width="60" height="40" fill="#003399" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <circle key={i} cx={30 + Math.sin(a) * 12} cy={20 - Math.cos(a) * 12} r="1.9" fill="#FFCC00" />;
      })}
    </svg>
  );
}
