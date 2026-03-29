import { useState } from 'react'

function QuickCheck({ quickCheck, onSubmit, feedback }) {
  const [answer, setAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    onSubmit(answer)
  }

  const points = quickCheck.expectedAnswerPoints || quickCheck.answerKey || []

  return (
    <form className="card" onSubmit={submit}>
      <h3>Quick check</h3>
      <p>{quickCheck.question}</p>
      <textarea
        className="input"
        rows={3}
        placeholder="One or two short sentences..."
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
      />
      <div className="row">
        {quickCheck.hint && (
          <button type="button" className="btn muted" onClick={() => setShowHint((h) => !h)}>
            {showHint ? 'Hide Hint' : 'Hint'}
          </button>
        )}
        <button type="submit" className="btn primary">
          Check
        </button>
      </div>
      {showHint && quickCheck.hint && <p className="hint">{quickCheck.hint}</p>}
      {feedback?.message && (
        <p className={`feedback ${feedback.level === 'correct' ? 'good' : feedback.level === 'partially_correct' ? 'neutral' : 'improve'}`}>
          {feedback.message}
        </p>
      )}
      {feedback && points.length > 0 && !feedback.correct && (
        <p className="small muted-hint">Ideas to aim for: {points.slice(0, 3).join(', ')}</p>
      )}
    </form>
  )
}

export default QuickCheck
