// A single scroll-filled sentence that closes the dark reel interlude.
export default function Statement() {
  return (
    <section className="pf-statement" data-bg="#101010" aria-labelledby="pf-statement-k">
      <div className="pf-wrap pf-statement-in">
        <p className="pf-statement-k" id="pf-statement-k" data-reveal="fade">
          <span className="pf-eyebrow-n">On editing</span>
        </p>
        <p className="pf-statement-text" data-fill data-fill-from="0.16">
          Editing is mostly leaving things out. I keep cutting until every frame left on the timeline has earned its
          place, and the moments you never see are the reason the rest of the film lands.
        </p>
        <p className="pf-statement-sig" data-reveal="fade">
          <span className="pf-statement-line" aria-hidden="true" />
          Ines Morrow, Copenhagen
        </p>
      </div>
    </section>
  );
}
