import { useState } from 'react'
import HintBox from './HintBox'

function renderIdealWithEmphasis(text) {
  if (!text) return null
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, index) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/)
    if (m) {
      return (
        <strong key={index} style={{ fontWeight: 700, color: '#14532d' }}>
          {m[1]}
        </strong>
      )
    }
    return <span key={index}>{part}</span>
  })
}

function PracticeQuestion({ question, onSubmit, onDraftChange }) {
  const [answer, setAnswer] = useState('')
  const [thought, setThought] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [hintWasOpened, setHintWasOpened] = useState(false)
  const [showIdealAnswer, setShowIdealAnswer] = useState(false)

  const ideal = question.idealAnswer?.trim()
  const canRevealIdeal = Boolean(ideal && (hasSubmitted || hintWasOpened))

  const submit = (event) => {
    event.preventDefault()
    setHasSubmitted(true)
    onSubmit({ answer, thought })
  }

  const handleHintToggle = () => {
    setShowHint((prev) => {
      const next = !prev
      if (next) setHintWasOpened(true)
      return next
    })
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
        <button type="button" className="btn muted" onClick={handleHintToggle}>
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>
        <button type="submit" className="btn primary" disabled={!answer.trim()}>
          Submit
        </button>
        {canRevealIdeal && (
          <button
            type="button"
            className="btn muted"
            onClick={() => setShowIdealAnswer((prev) => !prev)}
          >
            {showIdealAnswer ? 'Hide Ideal Answer' : 'See Ideal Answer'}
          </button>
        )}
      </div>

      <HintBox hint={question.hint} visible={showHint} />

      {showIdealAnswer && ideal && (
        <div
          className="ideal-answer-block"
          style={{
            marginTop: 12,
            padding: '12px 14px',
            borderRadius: 12,
            border: '1px solid #86efac',
            background: 'linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)',
            fontSize: '0.98rem',
            lineHeight: 1.45,
            color: '#166534',
          }}
        >
          <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '0.82rem', color: '#15803d' }}>
            Ideal answer (short)
          </p>
          <p style={{ margin: 0 }}>{renderIdealWithEmphasis(ideal)}</p>
          <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#3f6212', fontStyle: 'italic' }}>
            Use this to compare after you have tried. Your own words still count.
          </p>
        </div>
      )}
    </form>
  )
}

export default PracticeQuestion
