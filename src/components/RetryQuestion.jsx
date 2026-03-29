function RetryQuestion({ retryQuestion }) {
  if (!retryQuestion?.prompt) return null
  return (
    <section className="card retry-card">
      <h4>Similar question</h4>
      <p>{retryQuestion.prompt}</p>
      <p className="small">Try in your notebook, then continue.</p>
    </section>
  )
}

export default RetryQuestion
