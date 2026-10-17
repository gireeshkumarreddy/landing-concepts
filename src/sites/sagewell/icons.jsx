// Functional UI icons only. One stroke weight, drawn on a 20px grid.
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
};

const I = ({ children, size, ...rest }) => (
  <svg {...base} width={size || 20} height={size || 20} {...rest}>
    {children}
  </svg>
);

export const IconArrowRight = p => (
  <I {...p}>
    <path d="M4 10h11.5M11 5.5 15.5 10 11 14.5" />
  </I>
);
export const IconArrowUpRight = p => (
  <I {...p}>
    <path d="M6.5 13.5 13.5 6.5M7.5 6.5h6v6" />
  </I>
);
export const IconArrowUp = p => (
  <I {...p}>
    <path d="M10 15.5V4.5M5.5 9 10 4.5 14.5 9" />
  </I>
);
export const IconPlus = p => (
  <I {...p}>
    <path d="M10 5v10M5 10h10" />
  </I>
);
export const IconMic = p => (
  <I {...p}>
    <rect x="7.5" y="3" width="5" height="9" rx="2.5" />
    <path d="M4.8 9.6a5.2 5.2 0 0 0 10.4 0M10 14.8V17" />
  </I>
);
export const IconPaperclip = p => (
  <I {...p}>
    <path d="m15.6 9.4-5.7 5.7a3.6 3.6 0 0 1-5.1-5.1l6-6a2.4 2.4 0 0 1 3.4 3.4l-5.9 5.9a1.2 1.2 0 0 1-1.7-1.7L12 6.2" />
  </I>
);
export const IconClose = p => (
  <I {...p}>
    <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" />
  </I>
);
export const IconCheck = p => (
  <I {...p}>
    <path d="m4.5 10.5 3.5 3.5 7.5-8" />
  </I>
);
export const IconCopy = p => (
  <I {...p}>
    <rect x="7" y="7" width="9" height="9" rx="2" />
    <path d="M13 4.5A1.5 1.5 0 0 0 11.5 3h-6A2.5 2.5 0 0 0 3 5.5v6A1.5 1.5 0 0 0 4.5 13" />
  </I>
);
export const IconMenu = p => (
  <I {...p}>
    <path d="M3.5 7h13M3.5 13h13" />
  </I>
);
export const IconChevronDown = p => (
  <I {...p}>
    <path d="m5.5 8 4.5 4.5L14.5 8" />
  </I>
);
export const IconStop = p => (
  <I {...p}>
    <rect x="5.5" y="5.5" width="9" height="9" rx="1.6" fill="currentColor" stroke="none" />
  </I>
);
export const IconRefresh = p => (
  <I {...p}>
    <path d="M15.5 10a5.5 5.5 0 1 1-1.7-4M15.5 3.8V7h-3.2" />
  </I>
);
export const IconFile = p => (
  <I {...p}>
    <path d="M11.5 3H6.5A1.5 1.5 0 0 0 5 4.5v11A1.5 1.5 0 0 0 6.5 17h7a1.5 1.5 0 0 0 1.5-1.5V6.5L11.5 3Z" />
    <path d="M11.5 3v3.5H15" />
  </I>
);
export const IconDepth = p => (
  <I {...p}>
    <path d="M4 6h12M6.5 10h7M9 14h2" />
  </I>
);
export const IconPlan = p => (
  <I {...p}>
    <path d="M8 5.5h8M8 10h8M8 14.5h5" />
    <circle cx="4.5" cy="5.5" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="4.5" cy="10" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="4.5" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
  </I>
);
export const IconSearch = p => (
  <I {...p}>
    <circle cx="8.8" cy="8.8" r="5.3" />
    <path d="m12.8 12.8 3.7 3.7" />
  </I>
);
export const IconCompare = p => (
  <I {...p}>
    <path d="M4 7h11.5M12.5 4 15.5 7l-3 3M16 13H4.5M7.5 10 4.5 13l3 3" />
  </I>
);
export const IconFlag = p => (
  <I {...p}>
    <path d="M5 17.5V3.5M5 4h9.2l-2 3.6 2 3.6H5" />
  </I>
);
