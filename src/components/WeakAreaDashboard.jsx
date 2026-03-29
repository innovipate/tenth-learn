import { getConceptById } from '../data/index'

function WeakAreaDashboard({ weakConceptIds, onPracticeWeak }) {
  const ids = weakConceptIds || []
  if (!ids.length) {
    return (
      <section className="card">
        <h3>Weak areas</h3>
        <p>No weak topics flagged yet. Keep practicing—mistakes help us learn.</p>
      </section>
    )
  }

  return (
    <section className="card">
      <h3>Weak areas</h3>
      <ul className="weak-list">
        {ids.map((id) => {
          const c = getConceptById(id)
          return (
            <li key={id}>
              <strong>{c?.title || id}</strong>
            </li>
          )
        })}
      </ul>
      <button type="button" className="btn primary" onClick={onPracticeWeak}>
        Practice weak topics
      </button>
    </section>
  )
}

export default WeakAreaDashboard
