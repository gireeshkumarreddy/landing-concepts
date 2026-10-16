// Labelled form control with inline error text wired up for assistive tech.
export default function Field({ id, label, error, as = 'input', hint, className = '', children, ...props }) {
  const errId = `${id}-err`;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [error ? errId : null, hintId].filter(Boolean).join(' ') || undefined;
  const Tag = as;
  return (
    <div className={`ch-field ${error ? 'is-invalid' : ''} ${className}`}>
      <label className="ch-field__label" htmlFor={id}>
        {label}
      </label>
      <Tag
        id={id}
        className="ch-field__control"
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...props}
      >
        {children}
      </Tag>
      {hint && !error && (
        <p className="ch-field__hint" id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className="ch-field__error" id={errId}>
          {error}
        </p>
      )}
    </div>
  );
}
