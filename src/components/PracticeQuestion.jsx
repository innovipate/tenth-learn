import { useState } from 'react'
import HintBox from './HintBox'
import IdealAnswerBox from './IdealAnswerBox'

function PracticeQuestion({ question, onSubmit, onDraftChange, feedbackVisible = false }) {
  const [answer, setAnswer] = useState('')
  const [thought, setThought] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [hintWasOpened, setHintWasOpened] = useState(false)
  const [showIdeal, setShowIdeal] = useState(false)

  const text = question.question || question.prompt
  const ideal = question.idealAnswer?.trim()
  const canRevealIdeal = Boolean(ideal && (hasSubmitted || hintWasOpened || feedbackVisible))

  const submit = (event) => {
    event.preventDefault()
    setHasSubmitted(true)
    onSubmit({ answer, thought })
  }

  const toggleHint = () => {
    setShowHint((prev) => {
      const next = !prev
      if (next) setHintWasOpened(true)
      return next
    })
  }

  return (
    <form className="card" onSubmit={submit}>
      <h3>Practice</h3>
      <p>{text}</p>

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
        placeholder="Type a short answer in your own words..."
      />

      <label className="label" htmlFor="thinking-box">
        How did you think? (optional)
      </label>
      <textarea
        id="thinking-box"
        className="input"
        rows={2}
        value={thought}
        onChange={(event) => {
          setThought(event.target.value)
          onDraftChange?.()
        }}
        placeholder="One line is enough..."
      />

      <div className="row">
        <button type="button" className="btn muted" onClick={toggleHint}>
          {showHint ? 'Hide Hint' : 'Hint'}
        </button>
        <button type="submit" className="btn primary" disabled={!answer.trim()}>
          Submit
        </button>
      </div>

      <HintBox hint={question.hint} visible={showHint} />

      {canRevealIdeal && (
        <div className="row" style={{ marginTop: 8 }}>
          <button
            type="button"
            className="btn muted ideal-toggle"
            onClick={() => setShowIdeal((v) => !v)}
          >
            {showIdeal ? 'Hide Ideal Answer' : 'See Ideal Answer'}
          </button>
        </div>
      )}

      <IdealAnswerBox idealAnswer={ideal} visible={showIdeal} />
    </form>
  )
}

export default PracticeQuestion
