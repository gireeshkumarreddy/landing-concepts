// Functional UI icons only — one 16px grid, 1.5 stroke, round caps.
const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export const ArrowUpRight = p => (
  <svg {...base} {...p}>
    <path d="M5 11 11 5M6 5h5v5" />
  </svg>
);

export const ArrowLeft = p => (
  <svg {...base} {...p}>
    <path d="M13 8H3M7 4 3 8l4 4" />
  </svg>
);

export const ArrowRight = p => (
  <svg {...base} {...p}>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

export const Plus = p => (
  <svg {...base} {...p}>
    <path d="M8 3v10M3 8h10" />
  </svg>
);

export const Close = p => (
  <svg {...base} {...p}>
    <path d="m4 4 8 8M12 4l-8 8" />
  </svg>
);

export const Menu = p => (
  <svg {...base} {...p}>
    <path d="M2.5 5.5h11M2.5 10.5h11" />
  </svg>
);

export const Check = p => (
  <svg {...base} {...p}>
    <path d="m3.5 8.5 3 3 6-7" />
  </svg>
);

export const ChevronDown = p => (
  <svg {...base} {...p}>
    <path d="m4 6 4 4 4-4" />
  </svg>
);

export const ArrowUp = p => (
  <svg {...base} {...p}>
    <path d="M8 13V3M4 7l4-4 4 4" />
  </svg>
);
