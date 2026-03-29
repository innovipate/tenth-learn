const normalize = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const hasKeyword = (text, keyword) => {
  const t = normalize(text)
  const k = normalize(keyword)
  return k.length > 0 && t.includes(k)
}

/**
 * Simple rule-based check: blank | incorrect | partially_correct | correct
 */
export function evaluateShortAnswer(answer, answerKey = [], misconceptionTags = []) {
  const text = String(answer || '').trim()
  if (!normalize(text)) {
    return {
      level: 'blank',
      correct: false,
      partiallyCorrect: false,
      supportiveMessage: 'Write a short answer first, then tap Check or Submit.',
      breakPoint: 'Try one clear sentence using words from the question.',
      scoreRatio: 0,
      misconception: misconceptionTags[0] || null,
    }
  }

  const matched = (answerKey || []).filter((keyword) => hasKeyword(text, keyword))
  const ratio = answerKey?.length ? matched.length / answerKey.length : 0

  let level = 'incorrect'
  if (ratio >= 0.72) level = 'correct'
  else if (ratio >= 0.35) level = 'partially_correct'

  const tag = Array.isArray(misconceptionTags) && misconceptionTags.length ? misconceptionTags[0] : null

  let supportiveMessage = ''
  let breakPoint = ''

  if (level === 'correct') {
    supportiveMessage = 'Nice. You have the main idea.'
    breakPoint = 'Keep linking your words to the question next time too.'
  } else if (level === 'partially_correct') {
    supportiveMessage = 'Partly there. Add a bit more detail.'
    const missing = (answerKey || []).filter((k) => !matched.includes(k)).slice(0, 2)
    breakPoint = missing.length ? `Try adding ideas like: ${missing.join(', ')}.` : 'Say one more connecting sentence.'
  } else {
    supportiveMessage = 'Not quite yet. Use the hint and try again.'
    const focus = (answerKey || []).slice(0, 2).join(', ')
    breakPoint = focus ? `Focus on: ${focus}.` : 'Reread the question and answer in your own words.'
  }

  return {
    level,
    correct: level === 'correct',
    partiallyCorrect: level === 'partially_correct',
    supportiveMessage,
    breakPoint,
    scoreRatio: Number(ratio.toFixed(2)),
    misconception: tag,
  }
}

export function getRetryQuestion(item) {
  if (!item?.retryPrompt) return null
  return { id: `${item.id}-retry`, prompt: item.retryPrompt }
}
