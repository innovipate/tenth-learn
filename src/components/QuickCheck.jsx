import { useState } from 'react'
import CelebrationBurst from './CelebrationBurst'

function QuickCheck({ quickCheck, onSubmit, feedback }) {
  const [answer, setAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    onSubmit(answer)
  }

  return (
    <form className="card" onSubmit={submit}>
      {feedback?.correct && <CelebrationBurst />}
      <h3>Quick check</h3>
      <p>{quickCheck.question}</p>
      <textarea
        className="input"
        rows={3}
        placeholder="Type your answer in your own words..."
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
      />
      <div className="row">
        <button type="button" className="btn muted" onClick={() => setShowHint((prev) => !prev)}>
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>
        <button type="submit" className="btn primary">
          Check
        </button>
      </div>
      {showHint && <p className="hint">{quickCheck.hint}</p>}
      {feedback?.message && (
        <p className={`feedback ${feedback.correct ? 'good' : 'neutral'}`}>{feedback.message}</p>
      )}
    </form>
  )
}

export default QuickCheck
