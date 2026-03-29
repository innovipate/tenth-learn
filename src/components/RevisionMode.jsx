function RevisionMode({ valencyRows, pairs }) {
  return (
    <div className="revision-stack">
      <section className="card">
        <h3>Valency recall</h3>
        <ul className="valency-list">
          {valencyRows.map((row) => (
            <li key={row.element}>
              <strong>{row.element}</strong> — valency {row.valency}
            </li>
          ))}
        </ul>
      </section>
      <section className="card">
        <h3>Confuse-prone pairs</h3>
        <ul className="pairs-list">
          {pairs.map((pair, i) => (
            <li key={i}>
              <strong>
                {pair.a} vs {pair.b}
              </strong>
              <p className="small">{pair.tip}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default RevisionMode
