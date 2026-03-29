const STORAGE_KEY = 'chem-learn-progress-v1'

export function defaultProgress() {
  return {
    completedConceptIds: [],
    lastConceptId: null,
    lastMode: 'understand',
    practiceAttempts: [],
    weakConceptIds: [],
    memoryRounds: 0,
  }
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw)
    return { ...defaultProgress(), ...parsed }
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function markConceptComplete(progress, conceptId) {
  const set = new Set(progress.completedConceptIds || [])
  set.add(conceptId)
  return {
    ...progress,
    completedConceptIds: [...set],
    lastConceptId: conceptId,
  }
}

export function recordPracticeAttempt(progress, { questionId, conceptId, correct }) {
  const attempts = [...(progress.practiceAttempts || []), { questionId, conceptId, correct, at: Date.now() }]
  let weak = new Set(progress.weakConceptIds || [])
  if (!correct) weak.add(conceptId)
  if (correct && weak.has(conceptId)) {
    const recentWrong = attempts
      .filter((a) => a.conceptId === conceptId)
      .slice(-3)
      .some((a) => !a.correct)
    if (!recentWrong) weak.delete(conceptId)
  }
  return { ...progress, practiceAttempts: attempts, weakConceptIds: [...weak] }
}

export function progressSummary(concepts, progress) {
  const total = concepts.length
  const done = new Set(progress.completedConceptIds || []).size
  const weak = progress.weakConceptIds?.length || 0
  const attempts = progress.practiceAttempts?.length || 0
  return {
    conceptsTotal: total,
    conceptsDone: done,
    weakTopics: weak,
    practiceAttempts: attempts,
    percentUnderstand: total ? Math.round((done / total) * 100) : 0,
  }
}
