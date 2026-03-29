function MainNav({ active, onSelect }) {
  const tabs = [
    { id: 'understand', label: 'Understand' },
    { id: 'practice', label: 'Practice' },
    { id: 'remember', label: 'Remember' },
  ]
  return (
    <nav className="main-nav" aria-label="Main sections">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`nav-tab ${active === tab.id ? 'active' : ''}`}
          onClick={() => onSelect(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export default MainNav
