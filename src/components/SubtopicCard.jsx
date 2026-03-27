function SubtopicCard({ subtopic }) {
  return (
    <article className="card">
      <p className="eyebrow">Subtopic</p>
      <h2>{subtopic.title}</h2>
      <div className="content-grid">
        <section>
          <h3>Simple explanation</h3>
          <p>{subtopic.explanation}</p>
        </section>
        <section>
          <h3>Real-life example</h3>
          <p>{subtopic.realLifeExample}</p>
        </section>
        <section>
          <h3>Common mistake</h3>
          <p>{subtopic.commonMistake}</p>
        </section>
      </div>
    </article>
  )
}

export default SubtopicCard
