function HintBox({ hint, visible }) {
  if (!visible) return null
  return <p className="hint">Hint: {hint}</p>
}

export default HintBox
