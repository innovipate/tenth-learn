const normalize = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const hasKeyword = (text, keyword) => {
  const t = normalize(text)
  const k = normalize(keyword)
  return t.includes(k)
}

/** App may pass string tags only or a mixed array; only strings are used here. */
const onlyStringTags = (misconceptionTags) => {
  if (!Array.isArray(misconceptionTags)) return []
  return misconceptionTags.filter((item) => typeof item === 'string')
}

export const evaluateShortAnswer = (
  answer,
  answerSpec,
  misconceptionTags = [],
  difficulty = 'medium',
  thought = '',
) => {
  void difficulty
  const tags = onlyStringTags(misconceptionTags)

  const fullAnswer = `${answer || ''} ${thought || ''}`.trim()
  const normalized = normalize(fullAnswer)

  const keywords = Array.isArray(answerSpec)
    ? answerSpec
    : Array.isArray(answerSpec?.keywords)
      ? answerSpec.keywords
      : []

  if (!normalized) {
    return {
      level: 'incorrect',
      correct: false,
      partiallyCorrect: false,
      issueType: 'blank_answer',
      misconception: null,
      supportiveMessage: 'Please try answering first.',
      breakPoint: 'Write at least one meaningful line.',
      scoreRatio: 0,
    }
  }

  const matched = keywords.filter((keyword) => hasKeyword(fullAnswer, keyword))
  const ratio = keywords.length ? matched.length / keywords.length : 0

  let level = 'incorrect'
  if (ratio >= 0.75) level = 'correct'
  else if (ratio >= 0.35) level = 'partially_correct'

  let supportiveMessage = ''
  let breakPoint = ''
  let issueType = null

  if (level === 'correct') {
    supportiveMessage = 'Good. Your answer has the main idea.'
    breakPoint = 'You understood this well.'
  } else if (level === 'partially_correct') {
    supportiveMessage = 'Partly correct. You have some of the idea.'
    breakPoint = `Try adding: ${keywords
      .filter((k) => !matched.includes(k))
      .slice(0, 2)
      .join(', ')}`
    issueType = 'incomplete_reasoning'
  } else {
    supportiveMessage = 'Not quite. Try again using the hint.'
    breakPoint = `Focus on these ideas: ${keywords.slice(0, 2).join(', ')}`
    issueType = 'incorrect_concept'
  }

  return {
    level,
    correct: level === 'correct',
    partiallyCorrect: level === 'partially_correct',
    issueType,
    misconception: tags.length ? tags[0] : null,
    supportiveMessage,
    breakPoint,
    scoreRatio: Number(ratio.toFixed(2)),
  }
}

export const getRetryQuestion = (question) => {
  return {
    id: `${question.id}-retry`,
    prompt: question.retryPrompt || question.prompt || question.question,
  }
}
