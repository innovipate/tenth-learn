function RetryQuestion({ retryQuestion }) {
  if (!retryQuestion) return null

  return (
    <section className="card retry">
      <h3>Try a Similar Question</h3>
      <p>{retryQuestion.prompt}</p>
      <p className="small">Write this in your notebook first, then return and continue.</p>
    </section>
  )
}

export default RetryQuestion
