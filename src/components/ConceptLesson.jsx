import AnalogyBox from './AnalogyBox'

function ConceptLesson({ concept }) {
  return (
    <article className="card concept-lesson">
      <p className="eyebrow">Concept</p>
      <h2>{concept.title}</h2>
      <section className="lesson-block">
        <h3>Simple explanation</h3>
        <p>{concept.simpleExplanation}</p>
      </section>
      <AnalogyBox analogy={concept.analogy} />
      <section className="lesson-block">
        <h3>What actually happens</h3>
        <p>{concept.whatActuallyHappens}</p>
      </section>
      <section className="lesson-block">
        <h3>Common mistake</h3>
        <p>{concept.commonMistake}</p>
      </section>
    </article>
  )
}

export default ConceptLesson
