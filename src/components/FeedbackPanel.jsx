import CelebrationBurst from './CelebrationBurst'

function FeedbackPanel({ feedback }) {
  return (
    <section className="card">
      {feedback.correct && <CelebrationBurst />}
      <h3>Feedback</h3>
      <p className={`feedback ${feedback.correct ? 'good' : 'improve'}`}>{feedback.supportiveMessage}</p>
      {!feedback.correct && (
        <p className="encourage">Great try. You are learning step by step. Let us improve one idea and retry.</p>
      )}
      <p>
        <strong>Result:</strong> {feedback.correct ? 'Correct' : 'Not yet'}
      </p>
      <p>
        <strong>Reasoning check:</strong> {feedback.breakPoint}
      </p>
      {feedback.misconception && (
        <p>
          <strong>Likely misconception:</strong> {feedback.misconception.feedback}
        </p>
      )}
      <p>
        <strong>Thinking coverage:</strong> {Math.round(feedback.scoreRatio * 100)}%
      </p>
    </section>
  )
}

export default FeedbackPanel
