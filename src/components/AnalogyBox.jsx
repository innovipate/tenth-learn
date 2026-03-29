function AnalogyBox({ analogy }) {
  if (!analogy) return null
  return (
    <aside className="card analogy-card">
      <p className="eyebrow">Analogy</p>
      <p className="analogy-text">{analogy}</p>
    </aside>
  )
}

export default AnalogyBox
