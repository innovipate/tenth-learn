function resultLabel(level, correct) {
  if (level === 'blank') return 'Blank'
  if (correct || level === 'correct') return 'Correct'
  if (level === 'partially_correct') return 'Partially correct'
  return 'Incorrect'
}

function FeedbackPanel({ feedback }) {
  const level = feedback.level || (feedback.correct ? 'correct' : 'incorrect')
  const tone =
    level === 'correct' || feedback.correct
      ? 'good'
      : level === 'partially_correct'
        ? 'neutral'
        : 'improve'

  return (
    <section className="card feedback-panel">
      <h3>Feedback</h3>
      <p className={`feedback ${tone}`}>{feedback.supportiveMessage}</p>
      {level !== 'correct' && !feedback.correct && (
        <p className="encourage">Good try. Small steps make strong memory.</p>
      )}
      <p>
        <strong>Result:</strong> {resultLabel(level, feedback.correct)}
      </p>
      <p>
        <strong>Next step:</strong> {feedback.breakPoint}
      </p>
      {feedback.misconception && (
        <p className="small">
          <strong>Watch:</strong> {String(feedback.misconception).replaceAll('_', ' ')}
        </p>
      )}
      <p className="small">
        <strong>Match:</strong> {Math.round((feedback.scoreRatio || 0) * 100)}%
      </p>
    </section>
  )
}

export default FeedbackPanel
