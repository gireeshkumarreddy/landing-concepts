import { CLIENTS } from '../data.js';
import { IconChevron } from '../icons.jsx';

const Row = ({ hidden }) => (
  <ul role="list" className="pf-clients-row" aria-hidden={hidden || undefined}>
    {CLIENTS.map(c => (
      <li key={c.name} className={`pf-client pf-client--${c.style}`}>
        {c.name}
      </li>
    ))}
  </ul>
);

export default function ClientStrip() {
  return (
    <div className="pf-clients">
      <div className="pf-clients-view">
        <div className="pf-clients-track">
          <Row />
          <Row hidden />
        </div>
      </div>
      <p className="pf-clients-cap">
        <span>Fictional collaborators for this concept</span>
        <a href="#reel" className="pf-clients-jump" aria-label="Jump to the reel">
          <IconChevron size={12} sw={2} />
        </a>
      </p>
    </div>
  );
}
