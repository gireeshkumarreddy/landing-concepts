export default function SectionHead({ id, eyebrow, title, lead, align = 'left', children, className = '' }) {
  return (
    <div className={`ar-shead is-${align} ${className}`}>
      <div className="ar-shead-main" data-reveal>
        {eyebrow && <p className="ar-eyebrow">{eyebrow}</p>}
        <h2 id={id} className="ar-h2">
          {title}
        </h2>
      </div>
      {(lead || children) && (
        <div className="ar-shead-side" data-reveal>
          {lead && <p className="ar-lead">{lead}</p>}
          {children}
        </div>
      )}
    </div>
  );
}
