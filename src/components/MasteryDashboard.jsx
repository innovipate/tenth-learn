function MasteryDashboard({ mastery, onPracticeWeakAreas, onRestart }) {
  return (
    <section className="stack">
      <article className="card">
        <h2>Mastery Dashboard</h2>
        <p>
          <strong>Total Score:</strong> {mastery.totalScore}%
        </p>
      </article>

      <article className="card">
        <h3>Subtopic-wise Strength</h3>
        {mastery.subtopicScores.map((item) => (
          <div key={item.subtopicId} className="score-row">
            <span>{item.title}</span>
            <span>
              {item.score}% - {item.level}
            </span>
          </div>
        ))}
      </article>

      <article className="card">
        <h3>Misconception Summary</h3>
        {mastery.misconceptionSummary.length ? (
          mastery.misconceptionSummary.map((item) => (
            <p key={item.tag}>
              {item.tag}: {item.count} times
            </p>
          ))
        ) : (
          <p>No major misconception pattern detected yet.</p>
        )}
      </article>

      <article className="card">
        <h3>Recommended Revision</h3>
        <p>{mastery.recommendation}</p>
      </article>

      <div className="row">
        <button className="btn primary" onClick={onPracticeWeakAreas}>
          Practice Weak Areas Again
        </button>
        <button className="btn muted" onClick={onRestart}>
          Reset and Restart
        </button>
      </div>
    </section>
  )
}

export default MasteryDashboard
