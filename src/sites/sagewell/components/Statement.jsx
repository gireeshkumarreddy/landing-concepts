/**
 * The quiet manifesto between the setup steps and the playground. It opens the page's dark
 * interlude (the whole page tints to ink while it is centred) and its words light up as you read.
 */
export default function Statement() {
  return (
    <section className="cr-statement" data-bg="#141512" aria-labelledby="cr-statement-label">
      <div className="cr-wrap">
        <p className="cr-eyebrow cr-statement__label" id="cr-statement-label" data-reveal="fade">
          Before the answer
        </p>
        <p className="cr-statement__text" data-fill data-fill-start="top 80%" data-fill-end="bottom 55%">
          The first answer that comes to mind is rarely the best one. Sagewell sketches a plan, argues with
          its own draft, and only then speaks, leaving the whole trail on the table for you to read.
        </p>
      </div>
    </section>
  );
}
