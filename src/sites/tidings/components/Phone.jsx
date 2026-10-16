import { avatar } from '../data.js';
import { IconDoubleCheck } from '../icons.jsx';

/** Device shell: emerald metal frame, side buttons, dynamic island, status bar. */
export function PhoneFrame({ children, className = '', time = '9:41' }) {
  return (
    <div className={`ar-phone ${className}`}>
      <span className="ar-phone-btn is-l1" aria-hidden="true" />
      <span className="ar-phone-btn is-l2" aria-hidden="true" />
      <span className="ar-phone-btn is-r1" aria-hidden="true" />
      <div className="ar-phone-screen">
        <div className="ar-statusbar" aria-hidden="true">
          <span className="ar-statusbar-time">{time}</span>
          <span className="ar-island" />
          <span className="ar-statusbar-icons">
            <svg viewBox="0 0 18 12" width="17" height="11">
              <rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" />
              <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" />
              <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
              <rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" />
            </svg>
            <svg viewBox="0 0 26 12" width="24" height="11">
              <rect x=".5" y=".5" width="22" height="11" rx="3.2" fill="none" stroke="currentColor" strokeOpacity=".45" />
              <rect x="2.2" y="2.2" width="16" height="7.6" rx="1.8" fill="currentColor" />
              <path d="M24.2 4.2v3.6" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Avatar({ person, size = 44, className = '', eager = false }) {
  return (
    <img
      className={`ar-avatar ${className}`}
      src={avatar(person.img, size * 2)}
      alt=""
      width={size}
      height={size}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={{ width: size, height: size }}
    />
  );
}

/** Read receipts: animate from grey to green (CSS keyframes, skipped for reduced motion). */
export function Ticks({ animate = true, read = true }) {
  return (
    <span className={`ar-ticks ${animate ? 'is-anim' : ''} ${read ? 'is-read' : ''}`} aria-label={read ? 'Read' : 'Delivered'} role="img">
      <IconDoubleCheck size={16} sw={2} />
    </span>
  );
}
