function ChapterHeader({ chapter }) {
  return (
    <header className="card">
      <p className="eyebrow">{chapter.board}</p>
      <h1>{chapter.title}</h1>
      <p>{chapter.objective}</p>
    </header>
  )
}

export default ChapterHeader
