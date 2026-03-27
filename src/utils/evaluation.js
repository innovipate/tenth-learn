/**
 * Rule-based short-answer evaluation (3 levels: correct, partially_correct, incorrect).
 * Returns richer fields; UI can rely on supportiveMessage, breakPoint, correct, misconception.
 */

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const rawLower = (value) => String(value || '').toLowerCase().trim()

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

/** misconceptionTags from data → teaching hints (what / why / next) */
const TAG_GUIDANCE = {
  definition_confusion: {
    whatWrong: 'The main idea in the definition is not quite lined up yet.',
    whyWrong: 'Definitions need precise words. A small mix-up changes the whole meaning.',
    thinkNext: 'Say the term again in your own words, then check it against one NCERT line.',
  },
  new_substance_confusion: {
    whatWrong: 'The role of a new substance in the answer is missing or unclear.',
    whyWrong: 'Chemical change is tied to new substances forming. Without that, the reasoning stays weak.',
    thinkNext: 'Ask: “Did the starting material stay the same inside, or did it become something new?”',
  },
  physical_vs_chemical_change: {
    whatWrong: 'Physical change and chemical change may be swapped.',
    whyWrong: 'If identity stays same, it is usually physical; if new substance forms, it is chemical.',
    thinkNext: 'Name what you start with and what you end with. Compare their identity.',
  },
  observation_confusion: {
    whatWrong: 'The observation part of your answer needs clearer evidence from the situation.',
    whyWrong: 'Examiners look for what you saw or measured, not only the final word.',
    thinkNext: 'List two visible clues: colour, gas, heat, state, sound, etc.',
  },
  cause_effect_confusion: {
    whatWrong: 'Cause and effect are not connected clearly.',
    whyWrong: 'A correct answer should link what happened to why it shows a reaction.',
    thinkNext: 'Use a simple pattern: “Because …, we can say …”',
  },
  reactant_product_confusion: {
    whatWrong: 'Reactants and products may be placed on the wrong side.',
    whyWrong: 'Left side is what you begin with; right side is what is formed.',
    thinkNext: 'Rewrite the arrow line in words before you name each side.',
  },
  symbol_confusion: {
    whatWrong: 'Symbols or the arrow meaning need a sharper reading.',
    whyWrong: 'In equations, + joins substances, arrow shows direction of change, not “equals”.',
    thinkNext: 'Point with your finger from left to right across the arrow while reading.',
  },
  formula_confusion: {
    whatWrong: 'A formula or subscript idea seems mixed.',
    whyWrong: 'Subscripts tell atom count inside one unit; they are not chosen randomly.',
    thinkNext: 'Look at one formula and count atoms of each element silently.',
  },
  atom_molecule_confusion: {
    whatWrong: 'Atom and molecule are used in a tangled way.',
    whyWrong: 'An atom is single; a molecule is a group bonded together.',
    thinkNext: 'Pick one example from the chapter and label atom vs molecule aloud.',
  },
  equation_reading_confusion: {
    whatWrong: 'Reading the equation needs one more careful pass.',
    whyWrong: 'Word and symbol equations pack a lot of information in one line.',
    thinkNext: 'Read LHS as “what reacts” and RHS as “what is made”.',
  },
  balancing_confusion: {
    whatWrong: 'Balancing idea may be unclear.',
    whyWrong: 'We only balance atom counts using coefficients; formulas themselves stay fixed.',
    thinkNext: 'Make a tiny table of atoms on left and right, element by element.',
  },
  incomplete_reasoning: {
    whatWrong: 'Some key reasoning pieces are missing from your answer.',
    whyWrong: 'Short fragments are hard to mark; teachers need the connecting sentence.',
    thinkNext: 'Add one sentence that explains “because” using a fact from the question.',
  },
}

const GUESS_PATTERNS =
  /^(idk|i\s*dk|dunno|no\s*idea|guess|random|anything|skip|pass|\?)\b|^\s*$/i

const isGuessedOrEmpty = (combined) => {
  const t = combined.trim()
  if (!t) return true
  if (GUESS_PATTERNS.test(t)) return true
  const words = t.split(/\s+/).filter(Boolean)
  if (words.length <= 2 && t.length < 24) return true
  return false
}

/** Wrong +/- or opposite charge language vs answer key wording */
const detectSignError = (answer, thought, keywords) => {
  const text = rawLower(`${answer} ${thought}`)
  const keyBlob = keywords.join(' ').toLowerCase()
  const wantsPositive =
    /\bpositive\b|\+|cation|\bplus\b/i.test(keyBlob) ||
    keywords.some((k) => String(k).includes('+'))
  const wantsNegative =
    /\bnegative\b|anion|\bminus\b|-\s*/i.test(keyBlob) ||
    keywords.some((k) => /-/.test(String(k)))
  if (wantsPositive && !wantsNegative && /\bnegative\b|anion|\bminus\b/.test(text)) return true
  if (wantsNegative && !wantsPositive && /\bpositive\b|cation|\bplus\b/.test(text)) return true
  if (wantsPositive && /\s-\d|\b-\s*(?:1|2|3)\b/.test(text) && !/\+/.test(text)) return true
  return false
}

/** Simple opposite/contradiction vs expected ideas */
const detectConceptOpposite = (combinedNorm, keywords) => {
  const pairs = [
    { wrongHints: ['physical change only', 'only physical', 'no chemical'], needHints: ['chemical', 'reaction', 'new substance'] },
    { wrongHints: ['no reaction', 'nothing reacts'], needHints: ['reaction', 'forms', 'product'] },
    { wrongHints: ['reactants on right', 'products on left'], needHints: ['reactant', 'product'] },
    { wrongHints: ['arrow means equal', 'equals sign'], needHints: ['arrow', 'equation'] },
  ]
  for (const { wrongHints, needHints } of pairs) {
    const needsConcept = needHints.some((h) => keywords.some((k) => normalize(k).includes(normalize(h))))
    if (!needsConcept) continue
    const saidWrong = wrongHints.some((h) => combinedNorm.includes(normalize(h)))
    if (saidWrong) return true
  }
  const negated = /\b(not|never|no)\s+(a\s+)?(chemical|reaction|new\s+substance)\b/.test(combinedNorm)
  const needsChem = keywords.some((k) => {
    const n = normalize(k)
    return n.includes('chemical') || n.includes('reaction') || n.includes('new substance')
  })
  if (needsChem && negated) return true
  return false
}

const detectMisconception = (answer, misconceptionRules) => {
  if (!misconceptionRules?.length) return null
  const match = misconceptionRules.find((rule) =>
    rule.keywords?.some((keyword) => hasKeyword(answer, keyword)),
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
    if (typeof tag !== 'string') return false
    const patterns = tagKeywordMap[tag] || []
    return patterns.some((pattern) => hasKeyword(answer, pattern))
  })
  if (!matchedTag) return null
  const guide = TAG_GUIDANCE[matchedTag] || TAG_GUIDANCE.incomplete_reasoning
  return {
    tag: matchedTag,
    feedback: guide.whatWrong,
    breakPoint: guide.thinkNext,
    guidance: guide,
  }
}

const expectedMatchesDetail = (answer, keywords) => {
  const missing = []
  let count = 0
  for (const keyword of keywords) {
    if (hasKeyword(answer, keyword)) count += 1
    else missing.push(keyword)
  }
  return { count, missing }
}

const thresholdByDifficulty = {
  easy: 0.3,
  medium: 0.4,
  hard: 0.55,
}

const partialFloor = (threshold, keywordCount) => {
  const base = Math.max(0.12, threshold * 0.42)
  return keywordCount <= 2 ? Math.max(0.08, base - 0.06) : base
}

export const evaluateShortAnswer = (
  answer,
  answerSpec,
  misconceptionRules,
  difficulty = 'medium',
  thought = '',
) => {
  const safeAnswer = answer || ''
  const combinedRaw = `${safeAnswer} ${thought}`.trim()
  const combinedNorm = normalize(combinedRaw)
  const { keywords, optionalPhrases } = toKeywordConfig(answerSpec)
  const keywordCount = keywords.length || 0
  const { count: matchCount, missing } = expectedMatchesDetail(combinedRaw, keywords)
  const ratio = keywordCount ? matchCount / keywordCount : 0
  const threshold = thresholdByDifficulty[difficulty] || thresholdByDifficulty.medium
  const adjustedThreshold = keywordCount <= 2 ? Math.max(0.25, threshold - 0.1) : threshold
  const pFloor = partialFloor(adjustedThreshold, keywordCount)
  const hasOptionalSupport =
    optionalPhrases.length > 0 &&
    optionalPhrases.some((phrase) => hasKeyword(combinedRaw, phrase))

  const ruleObjects = Array.isArray(misconceptionRules)
    ? misconceptionRules.filter((item) => item && typeof item === 'object' && item.keywords)
    : []
  const tagStrings = Array.isArray(misconceptionRules)
    ? misconceptionRules.filter((item) => typeof item === 'string')
    : []

  let issueType = null
  let whatWrong = ''
  let whyWrong = ''
  let thinkNext = ''

  if (isGuessedOrEmpty(combinedRaw)) {
    issueType = 'guessed_answer'
    whatWrong = 'The answer is too short or looks like a guess.'
    whyWrong = 'Examiners cannot see your reasoning when the lines are empty or vague.'
    thinkNext = 'Write at least one full sentence using words from the question.'
  } else if (detectSignError(safeAnswer, thought, keywords)) {
    issueType = 'sign_error'
    const keyBlob = keywords.join(' ').toLowerCase()
    const ionLike = keyBlob.includes('ion') || keyBlob.includes('charge') || keyBlob.includes('cation') || keyBlob.includes('anion')
    whatWrong = ionLike
      ? 'You may have identified the ion or particle but missed its charge. Focus on the superscript.'
      : 'A plus/minus or charge idea may be flipped compared to what the question expects.'
    whyWrong = ionLike
      ? 'The same symbol with a different charge is a different species in chemistry.'
      : 'A small sign change turns a right idea into a wrong one in science writing.'
    thinkNext = ionLike
      ? 'Look at the tiny number or sign above or beside the symbol; say the charge before you finish the sentence.'
      : 'Re-read any charge or ion symbol; say “positive” or “negative” out loud as you write.'
  } else if (detectConceptOpposite(combinedNorm, keywords)) {
    issueType = 'concept_error'
    whatWrong = 'Part of the answer points the opposite way from the correct concept.'
    whyWrong = 'Opposite wording hides the real process the question is testing.'
    thinkNext = 'Compare your sentence with one diagram or definition from the book side by side.'
  }

  const misconceptionFromRules = detectMisconception(combinedRaw, ruleObjects)
  const misconceptionFromTags = issueType ? null : detectMisconceptionByTags(combinedRaw, tagStrings)
  let misconception = misconceptionFromRules || misconceptionFromTags

  if (misconception && misconception.guidance) {
    whatWrong = misconception.guidance.whatWrong
    whyWrong = misconception.guidance.whyWrong
    thinkNext = misconception.guidance.thinkNext
    issueType = issueType || misconception.tag || 'concept_error'
  } else if (misconceptionFromRules && !issueType) {
    issueType = misconceptionFromRules.tag || 'concept_error'
    whatWrong = misconceptionFromRules.feedback || 'One idea needs tightening.'
    whyWrong = 'Your words triggered a common slip pattern for this topic.'
    thinkNext = misconceptionFromRules.breakPoint || 'Fix that one step and say the rest again simply.'
  }

  const hardIssue =
    issueType === 'guessed_answer' || issueType === 'sign_error' || issueType === 'concept_error'
  const meetsBar =
    ratio >= adjustedThreshold || (ratio >= adjustedThreshold - 0.1 && hasOptionalSupport)

  let level
  if (misconception || hardIssue) {
    level = 'incorrect'
    if (!whatWrong && misconception?.guidance) {
      whatWrong = misconception.guidance.whatWrong
      whyWrong = misconception.guidance.whyWrong
      thinkNext = misconception.guidance.thinkNext
    } else if (!whatWrong && misconceptionFromRules) {
      whatWrong = misconceptionFromRules.feedback || 'One idea needs tightening.'
      whyWrong = 'Your words fit a common slip pattern for this topic.'
      thinkNext = misconceptionFromRules.breakPoint || thinkNext
    }
  } else if (meetsBar) {
    level = 'correct'
  } else if (ratio >= pFloor) {
    level = 'partially_correct'
    issueType = issueType || 'incomplete_reasoning'
    const showMissing = missing.slice(0, 3).join(', ')
    if (!whatWrong) {
      whatWrong = missing.length
        ? `Key ideas still to bring in: ${showMissing}.`
        : 'The answer is on the way but not complete yet.'
      whyWrong = 'You showed part of the path, but the full reasoning link is still thin.'
      thinkNext =
        thinkNext ||
        'Add one sentence that names the missing idea and connects it with “because”.'
    }
  } else {
    level = 'incorrect'
    issueType = issueType || 'incomplete_reasoning'
    if (!whatWrong) {
      const showMissing = missing.slice(0, 4).join(', ')
      whatWrong = missing.length
        ? `Important points are missing from the reasoning: ${showMissing}.`
        : 'The reasoning does not yet answer the heart of the question.'
      whyWrong = 'When key ideas stay missing, the answer cannot show clear thinking.'
      thinkNext = thinkNext || 'Look at the hint, then rewrite using two short clear sentences.'
    }
  }

  if (level === 'partially_correct' && tagStrings.length) {
    const tagHint = TAG_GUIDANCE[tagStrings[0]]
    if (tagHint?.thinkNext) {
      thinkNext = thinkNext ? `${thinkNext} ${tagHint.thinkNext}` : tagHint.thinkNext
    }
  }

  const correct = level === 'correct'
  const partiallyCorrect = level === 'partially_correct'

  const breakPoint = [whatWrong && `What needs work: ${whatWrong}`, whyWrong && `Why: ${whyWrong}`, thinkNext && `What to think next: ${thinkNext}`]
    .filter(Boolean)
    .join(' ')

  let supportiveMessage
  if (correct) {
    supportiveMessage = 'Well done. Your answer shows clear thinking and the right main ideas.'
  } else if (partiallyCorrect) {
    supportiveMessage =
      'You are partway there. Your brain is on the right track; we just need a little more glue in the reasoning.'
  } else {
    supportiveMessage = 'Nice effort. Every miss is a map of what to strengthen next—no stress.'
  }

  const misconceptionForUi =
    misconception && !misconception.guidance
      ? misconception
      : misconception
        ? {
            tag: misconception.tag,
            feedback: misconception.feedback || whatWrong,
            breakPoint: misconception.breakPoint || thinkNext,
          }
        : null

  return {
    level,
    correct,
    partiallyCorrect,
    issueType,
    whatWrong,
    whyWrong,
    thinkNext,
    scoreRatio: Number(ratio.toFixed(2)),
    misconception: misconceptionForUi,
    breakPoint: breakPoint || 'Try to show each step in words so your thinking becomes clear.',
    supportiveMessage,
  }
}

export const getRetryQuestion = (question) => {
  return {
    id: `${question.id}-retry`,
    prompt: question.retryPrompt,
  }
}
