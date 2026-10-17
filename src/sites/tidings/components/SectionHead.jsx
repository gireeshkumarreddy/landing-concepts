export default function SectionHead({ id, eyebrow, title, lead, align = 'left', children, className = '' }) {
  return (
    <div className={`ar-shead is-${align} ${className}`}>
      <div className="ar-shead-main">
        {eyebrow && (
          <p className="ar-eyebrow" data-reveal="fade">
            {eyebrow}
          </p>
        )}
        <h2 id={id} className="ar-h2" data-reveal="lines" data-reveal-delay="0.05">
          {title}
        </h2>
      </div>
      {(lead || children) && (
        <div className="ar-shead-side" data-reveal="fade" data-reveal-delay="0.18">
          {lead && <p className="ar-lead">{lead}</p>}
          {children}
        </div>
      )}
    </div>
  );
}
