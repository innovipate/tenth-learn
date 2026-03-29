import { useState } from 'react'

function RecallCard({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <button type="button" className={`recall-card ${open ? 'open' : ''}`} onClick={() => setOpen((o) => !o)}>
      <span className="recall-symbol">{item.symbol}</span>
      <span className="recall-name">{open ? item.name : 'Tap to reveal name'}</span>
      {open && item.note && <span className="recall-note">{item.note}</span>}
    </button>
  )
}

export default RecallCard
