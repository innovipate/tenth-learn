import { useState } from 'react'
import HintBox from './HintBox'

function PracticeQuestion({ question, onSubmit, onDraftChange }) {
  const [answer, setAnswer] = useState('')
  const [thought, setThought] = useState('')
  const [showHint, setShowHint] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    onSubmit({ answer, thought })
  }

  return (
    <form className="card" onSubmit={submit}>
      <h3>Practice question</h3>
      <p>{question.prompt}</p>

      <label className="label" htmlFor="answer-box">
        Your answer
      </label>
      <textarea
        id="answer-box"
        className="input"
        rows={4}
        value={answer}
        onChange={(event) => {
          setAnswer(event.target.value)
          onDraftChange?.()
        }}
        placeholder="Write your full answer..."
      />

      <label className="label" htmlFor="thinking-box">
        How did you think? (optional)
      </label>
      <textarea
        id="thinking-box"
        className="input"
        rows={3}
        value={thought}
        onChange={(event) => {
          setThought(event.target.value)
          onDraftChange?.()
        }}
        placeholder="Write your steps in simple words..."
      />

      <div className="row">
        <button
          type="button"
          className="btn muted"
          onClick={() => setShowHint((prev) => !prev)}
        >
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>
        <button type="submit" className="btn primary" disabled={!answer.trim()}>
          Submit
        </button>
      </div>

      <HintBox hint={question.hint} visible={showHint} />
    </form>
  )
}

export default PracticeQuestion
