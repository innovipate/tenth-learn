function renderIdealWithEmphasis(text) {
  if (!text) return null
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, index) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/)
    if (m) {
      return (
        <strong key={index} className="ideal-strong">
          {m[1]}
        </strong>
      )
    }
    return <span key={index}>{part}</span>
  })
}

function IdealAnswerBox({ idealAnswer, visible }) {
  if (!visible || !idealAnswer?.trim()) return null
  return (
    <div className="ideal-answer-box">
      <p className="ideal-label">Ideal answer (short)</p>
      <p className="ideal-body">{renderIdealWithEmphasis(idealAnswer.trim())}</p>
      <p className="ideal-note">Compare after you try. Your own words still count.</p>
    </div>
  )
}

export default IdealAnswerBox
