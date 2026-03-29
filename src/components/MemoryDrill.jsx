import { useState } from 'react'

function MemoryDrill({ prompts, onRoundDone }) {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  if (!prompts?.length) return null
  const prompt = prompts[index % prompts.length]

  const next = () => {
    setRevealed(false)
    setIndex((i) => {
      const n = (i + 1) % prompts.length
      if (n === 0) onRoundDone?.()
      return n
    })
  }

  return (
    <section className="card">
      <h3>Rapid recall</h3>
      <p className="drill-prompt">{prompt}</p>
      <p className="small">Say it aloud or write in a notebook—no answer shown here.</p>
      <div className="row">
        <button type="button" className="btn muted" onClick={() => setRevealed((r) => !r)}>
          {revealed ? 'Hide nudge' : 'Tiny nudge'}
        </button>
        <button type="button" className="btn primary" onClick={next}>
          Next prompt
        </button>
      </div>
      {revealed && <p className="hint">Use words from class: define, compare, or give one example.</p>}
    </section>
  )
}

export default MemoryDrill
