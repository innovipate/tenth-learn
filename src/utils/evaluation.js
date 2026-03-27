const normalize = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const tokenMatchRatio = (answer, keyword) => {
  const answerTokens = normalize(answer).split(' ').filter(Boolean)
  const keywordTokens = normalize(keyword).split(' ').filter(Boolean)
  if (!answerTokens.length || !keywordTokens.length) return 0
  const matched = keywordTokens.filter((token) =>
    answerTokens.some((ansToken) => ansToken.includes(token) || token.includes(ansToken)),
  ).length
  return matched / keywordTokens.length
}

const hasKeyword = (answer, keyword) => {
  const normalizedAnswer = normalize(answer)
  const normalizedKeyword = normalize(keyword)
  if (!normalizedKeyword) return false
  if (normalizedAnswer.includes(normalizedKeyword)) return true
  return tokenMatchRatio(normalizedAnswer, normalizedKeyword) >= 0.6
}

const toKeywordConfig = (answerSpec) => {
  if (Array.isArray(answerSpec)) {
    return { keywords: answerSpec, optionalPhrases: [] }
  }
  if (answerSpec && typeof answerSpec === 'object') {
    return {
      keywords: Array.isArray(answerSpec.keywords) ? answerSpec.keywords : [],
      optionalPhrases: Array.isArray(answerSpec.optionalPhrases) ? answerSpec.optionalPhrases : [],
    }
  }
  return { keywords: [], optionalPhrases: [] }
}

const detectMisconception = (answer, misconceptionRules) => {
  if (!misconceptionRules?.length) return null
  const match = misconceptionRules.find((rule) =>
    rule.keywords.some((keyword) => hasKeyword(answer, keyword)),
  )
  return match || null
}

const tagKeywordMap = {
  definition_confusion: ['anything changes', 'all changes', 'just change'],
  new_substance_confusion: ['same substance', 'no new substance'],
  physical_vs_chemical_change: ['physical change only', 'only physical'],
  observation_confusion: ['no observation', 'nothing changed'],
  cause_effect_confusion: ['gas means boiling only', 'just bubbles'],
  reactant_product_confusion: ['rhs reactants', 'lhs products'],
  symbol_confusion: ['arrow means equal', 'random symbols'],
  formula_confusion: ['o2 means oxygen gas only one atom', '2 is coefficient'],
  atom_molecule_confusion: ['atom and molecule same'],
  equation_reading_confusion: ['cannot read equation'],
  balancing_confusion: ['change formula', 'change subscripts'],
  incomplete_reasoning: ['because it happens', 'just because'],
}

const detectMisconceptionByTags = (answer, misconceptionTags = []) => {
  if (!misconceptionTags.length) return null
  const matchedTag = misconceptionTags.find((tag) => {
    const patterns = tagKeywordMap[tag] || []
    return patterns.some((pattern) => hasKeyword(answer, pattern))
  })
  if (!matchedTag) return null
  return {
    tag: matchedTag,
    feedback: `Possible misconception: ${matchedTag.replaceAll('_', ' ')}.`,
    breakPoint: 'One reasoning step seems mixed up. Recheck definition and equation meaning.',
  }
}

const expectedMatches = (answer, keywords) => {
  if (!keywords?.length) return 0
  return keywords.reduce((count, keyword) => {
    return count + (hasKeyword(answer, keyword) ? 1 : 0)
  }, 0)
}

const thresholdByDifficulty = {
  easy: 0.3,
  medium: 0.4,
  hard: 0.55,
}

export const evaluateShortAnswer = (
  answer,
  answerSpec,
  misconceptionRules,
  difficulty = 'medium',
  thought = '',
) => {
  const safeAnswer = answer || ''
  const combined = `${safeAnswer} ${thought}`.trim()
  const { keywords, optionalPhrases } = toKeywordConfig(answerSpec)
  const keywordCount = keywords.length || 0
  const matchCount = expectedMatches(combined, keywords)
  const ratio = keywordCount ? matchCount / keywordCount : 0
  const threshold = thresholdByDifficulty[difficulty] || thresholdByDifficulty.medium
  const adjustedThreshold = keywordCount <= 2 ? Math.max(0.25, threshold - 0.1) : threshold
  const misconceptionFromRules = Array.isArray(misconceptionRules)
    ? detectMisconception(combined, misconceptionRules.filter((item) => item?.keywords))
    : null
  const misconceptionFromTags = Array.isArray(misconceptionRules)
    ? detectMisconceptionByTags(
        combined,
        misconceptionRules.filter((item) => typeof item === 'string'),
      )
    : null
  const misconception = misconceptionFromRules || misconceptionFromTags
  const hasOptionalSupport =
    optionalPhrases.length > 0 &&
    optionalPhrases.some((phrase) => hasKeyword(combined, phrase))
  const correct =
    (ratio >= adjustedThreshold || (ratio >= adjustedThreshold - 0.1 && hasOptionalSupport)) &&
    !misconception

  let breakPoint = 'Try to show each step in words so your thinking becomes clear.'
  if (misconception) {
    breakPoint = misconception.breakPoint
  } else if (ratio < adjustedThreshold) {
    breakPoint = 'Some key reasoning steps are missing. Add what you replaced, solved, and checked.'
  }

  return {
    correct,
    scoreRatio: Number(ratio.toFixed(2)),
    misconception,
    breakPoint,
    supportiveMessage: correct
      ? 'Good effort. Your reasoning is mostly clear.'
      : 'You are learning well. Let us repair one step and try again.',
  }
}

export const getRetryQuestion = (question) => {
  return {
    id: `${question.id}-retry`,
    prompt: question.retryPrompt,
  }
}
