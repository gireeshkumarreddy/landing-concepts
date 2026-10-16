// Functional UI icons, drawn on a 24px grid with a consistent 1.7 stroke.
const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

const Icon = ({ size, children, ...rest }) => (
  <svg {...base} width={size || 16} height={size || 16} {...rest}>
    {children}
  </svg>
);

export const Bolt = ({ filled = true, ...p }) => (
  <Icon {...p} strokeWidth={filled ? 0 : 1.6}>
    <path
      d="M13.2 2.6 5.4 13.1a.6.6 0 0 0 .5 1h5.2l-1.3 7a.4.4 0 0 0 .7.3l8-10.6a.6.6 0 0 0-.5-1h-5.2l1.1-7a.4.4 0 0 0-.7-.2Z"
      fill={filled ? 'currentColor' : 'var(--ta-bolt-fill, none)'}
      stroke={filled ? 'none' : 'currentColor'}
    />
  </Icon>
);

export const Check = p => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);

export const CheckDouble = p => (
  <Icon {...p}>
    <path d="m2.5 12.5 4.2 4.2L15 8.2" />
    <path d="m11.8 16.4.3.3L21.5 7.3" />
  </Icon>
);

export const Compose = p => (
  <Icon {...p}>
    <path d="M11 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V13" />
    <path d="M17.6 3.6a1.9 1.9 0 0 1 2.8 2.8L12.5 14.3 9 15l.7-3.5 7.9-7.9Z" />
  </Icon>
);

export const Chevron = p => (
  <Icon {...p}>
    <path d="m7 10 5 5 5-5" />
  </Icon>
);

export const ArrowRight = p => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const ArrowUpRight = p => (
  <Icon {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Icon>
);

export const Plus = p => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const Close = p => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const Menu = p => (
  <Icon {...p}>
    <path d="M4 8h16M4 16h16" />
  </Icon>
);

export const Pause = p => (
  <Icon {...p}>
    <path d="M9 6v12M15 6v12" />
  </Icon>
);

export const Play = p => (
  <Icon {...p}>
    <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
  </Icon>
);

export const Send = p => (
  <Icon {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Icon>
);

export const Undo = p => (
  <Icon {...p}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
  </Icon>
);

export const Users = p => (
  <Icon {...p}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <path d="M15.5 5.6a3.2 3.2 0 0 1 0 6.1M17.5 14.2A5.5 5.5 0 0 1 20.5 19" />
  </Icon>
);

export const Smile = p => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.8 14.2a4.2 4.2 0 0 0 6.4 0M9.4 9.7h.01M14.6 9.7h.01" />
  </Icon>
);

export const Bell = p => (
  <Icon {...p}>
    <path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5l1.5-1.5Z" />
    <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
  </Icon>
);

export const Inbox = p => (
  <Icon {...p}>
    <path d="M4 13.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4.5" />
    <path d="M4 13.5 6.3 5.6A2 2 0 0 1 8.2 4h7.6a2 2 0 0 1 1.9 1.6l2.3 7.9h-4.6a3.4 3.4 0 0 1-6.8 0H4Z" />
  </Icon>
);

export const Sidebar = p => (
  <Icon {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <path d="M9.5 4.5v15" />
  </Icon>
);

export const Clock = p => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

export const Shield = p => (
  <Icon {...p}>
    <path d="M12 3.5 5 6.2v5.3c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6.2l-7-2.7Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Icon>
);

export const Ban = p => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m6 6 12 12" />
  </Icon>
);

// The envelope glyph inside the ember headline tile. Two-tone, not a brand mark.
export const Envelope = props => (
  <svg viewBox="0 0 40 30" aria-hidden="true" focusable="false" {...props}>
    <rect x="1" y="1" width="38" height="28" rx="7" fill="#fff" />
    <path d="M4.2 4.6C5.3 3 6.6 2.4 8.5 2.4h23c1.9 0 3.2.6 4.3 2.2L22.4 15.3a3.9 3.9 0 0 1-4.8 0L4.2 4.6Z" fill="url(#ta-env-flap)" />
    <defs>
      <linearGradient id="ta-env-flap" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f0784b" />
        <stop offset="1" stopColor="#d4471f" />
      </linearGradient>
    </defs>
  </svg>
);
