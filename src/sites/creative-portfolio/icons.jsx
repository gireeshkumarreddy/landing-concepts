// Small functional icons, one consistent 1.6 stroke on a 24px grid.
const Svg = ({ children, size = 16, sw = 1.6, ...rest }) => (
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
    {...rest}
  >
    {children}
  </svg>
);

export const IconArrowRight = p => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const IconArrowUpRight = p => (
  <Svg {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
);

export const IconChevron = ({ dir = 'right', ...p }) => {
  const d = { right: 'M9 6l6 6-6 6', left: 'M15 6l-6 6 6 6', down: 'M6 9l6 6 6-6', up: 'M6 15l6-6 6 6' }[dir];
  return (
    <Svg {...p}>
      <path d={d} />
    </Svg>
  );
};

export const IconPlus = p => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const IconClose = p => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const IconMenu = p => (
  <Svg {...p}>
    <path d="M4 8h16M4 16h16" />
  </Svg>
);

export const IconPlay = p => (
  <Svg {...p} sw={0}>
    <path d="M8 5.5v13a.6.6 0 0 0 .9.5l10.4-6.5a.6.6 0 0 0 0-1L8.9 5a.6.6 0 0 0-.9.5Z" fill="currentColor" />
  </Svg>
);

export const IconPause = p => (
  <Svg {...p} sw={0}>
    <rect x="6.5" y="5" width="3.6" height="14" rx="1" fill="currentColor" />
    <rect x="13.9" y="5" width="3.6" height="14" rx="1" fill="currentColor" />
  </Svg>
);

export const IconCalendar = p => (
  <Svg {...p}>
    <rect x="3.75" y="5.25" width="16.5" height="15" rx="2.5" />
    <path d="M3.75 10h16.5M8 3v4M16 3v4" />
  </Svg>
);

export const IconCopy = p => (
  <Svg {...p}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2.2" />
    <path d="M15.5 8.5V6.7a2.2 2.2 0 0 0-2.2-2.2H6.7a2.2 2.2 0 0 0-2.2 2.2v6.6a2.2 2.2 0 0 0 2.2 2.2h1.8" />
  </Svg>
);

export const IconCheck = p => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

export const IconFilm = p => (
  <Svg {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <path d="M7.5 4.5v15M16.5 4.5v15M3.5 9.5h4M3.5 14.5h4M16.5 9.5h4M16.5 14.5h4" />
  </Svg>
);

export const IconScissors = p => (
  <Svg {...p}>
    <circle cx="6.5" cy="7" r="2.5" />
    <circle cx="6.5" cy="17" r="2.5" />
    <path d="M8.6 8.4 19 16M8.6 15.6 19 8" />
  </Svg>
);
