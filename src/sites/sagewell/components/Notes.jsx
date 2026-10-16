import { NOTES } from '../data.js';
import { useSagewell } from '../lib.js';
import { IconArrowRight, IconArrowUpRight } from '../icons.jsx';
import Modal from './Modal.jsx';

export default function Notes() {
  const { openNote } = useSagewell();
  return (
    <section className="cr-section cr-notes" id="journal" aria-labelledby="cr-notes-title">
      <div className="cr-wrap cr-notes__grid">
        <header className="cr-notes__head">
          <p className="cr-eyebrow" data-cr-reveal>
            <b>06</b> Journal
          </p>
          <h2 id="cr-notes-title" className="cr-h2" data-cr-reveal>
            Notes from the reading room.
          </h2>
          <p className="cr-lede" data-cr-reveal>
            Release notes, field guides and the occasional essay on reasoning you can inspect.
          </p>
        </header>

        <ol className="cr-notes__list" role="list">
          {NOTES.map(n => (
            <li key={n.id} data-cr-reveal>
              <button
                type="button"
                id={`note-${n.id}`}
                className="cr-note"
                onClick={() => openNote(n.id)}
                aria-haspopup="dialog"
              >
                <span className="cr-note__meta">
                  <time dateTime={n.date}>{n.dateLabel}</time>
                  <span>{n.tag}</span>
                </span>
                <span className="cr-note__title">{n.title}</span>
                <span className="cr-note__dek">{n.dek}</span>
                <span className="cr-note__go" aria-hidden="true">
                  <IconArrowUpRight size={18} />
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function NoteReader({ id, onClose, onNavigate }) {
  const idx = NOTES.findIndex(n => n.id === id);
  const note = NOTES[idx];
  const next = NOTES[(idx + 1) % NOTES.length];
  return (
    <Modal open={!!note} onClose={onClose} labelledBy="cr-reader-title" className="cr-reader" sheet closeLabel="Close this entry">
      {note && (
        <article key={note.id}>
          <p className="cr-reader__meta">
            <span>{note.tag}</span>
            <time dateTime={note.date}>{note.dateLabel}</time>
            <span>{note.read}</span>
          </p>
          <h2 id="cr-reader-title" className="cr-reader__title">
            {note.title}
          </h2>
          <p className="cr-reader__dek">{note.dek}</p>
          <div className="cr-reader__body">
            {note.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <footer className="cr-reader__foot">
            <span>Written for a concept product.</span>
            <button type="button" className="cr-btn cr-btn--ghost cr-btn--sm" onClick={() => onNavigate(next.id)}>
              Read next: {next.title}
              <IconArrowRight size={14} />
            </button>
          </footer>
        </article>
      )}
    </Modal>
  );
}
