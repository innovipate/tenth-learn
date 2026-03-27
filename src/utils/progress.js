const storageKey = (chapterId) => `ncert-progress-${chapterId}`

export const createInitialProgress = (chapterData, difficulty = 'medium') => {
  const subtopicProgress = chapterData.subtopics.reduce((acc, subtopic) => {
    acc[subtopic.id] = {
      quickCheckAttempts: 0,
      quickCheckCorrect: 0,
    }
    return acc
  }, {})

  return {
    chapterId: chapterData.id,
    difficulty,
    subtopicProgress,
    practiceAttempts: [],
    misconceptionCounts: {},
  }
}

export const loadProgress = (chapterId) => {
  try {
    const raw = localStorage.getItem(storageKey(chapterId))
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    return null
  }
}

export const saveProgress = (chapterId, progress) => {
  if (!progress) return
  localStorage.setItem(storageKey(chapterId), JSON.stringify(progress))
}

export const getMasteryFromProgress = (chapterData, progress) => {
  const safeProgress = progress || createInitialProgress(chapterData)
  const attempts = safeProgress.practiceAttempts
  const totalCorrect = attempts.filter((item) => item.correct).length
  const totalScore = attempts.length ? Math.round((totalCorrect / attempts.length) * 100) : 0

  const bySubtopic = chapterData.subtopics.map((subtopic) => {
    const relatedAttempts = attempts.filter((attempt) => attempt.subtopicId === subtopic.id)
    const correctCount = relatedAttempts.filter((attempt) => attempt.correct).length
    const rate = relatedAttempts.length ? Math.round((correctCount / relatedAttempts.length) * 100) : 0
    return {
      subtopicId: subtopic.id,
      title: subtopic.title,
      score: rate,
      attempts: relatedAttempts.length,
      level: rate >= 75 ? 'Strong' : rate >= 45 ? 'Developing' : 'Needs revision',
    }
  })

  const weakAreas = bySubtopic.filter((item) => item.score < 60).map((item) => item.title)
  const misconceptionSummary = Object.entries(safeProgress.misconceptionCounts)
    .filter(([tag]) => tag !== 'none')
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }))

  return {
    totalScore,
    subtopicScores: bySubtopic,
    weakAreas,
    misconceptionSummary,
    recommendation:
      weakAreas.length > 0
        ? `Revise ${weakAreas.join(', ')} and retry mistake-focused practice.`
        : 'Great progress. Continue mixed practice to keep your skills strong.',
  }
}
