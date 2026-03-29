import foundationsConcepts from './foundationsData'
import reactionsConcepts from './reactionsData'

/** Logical learning order: foundations first, then reactions */
export const allConceptsInOrder = [...foundationsConcepts, ...reactionsConcepts]

export function getConceptById(id) {
  return allConceptsInOrder.find((c) => c.id === id) || null
}

/** Flat list for practice: each item has conceptId + conceptTitle */
export function flattenPracticeQuestions(concepts = allConceptsInOrder) {
  const list = []
  concepts.forEach((concept) => {
    ;(concept.practiceQuestions || []).forEach((pq) => {
      list.push({
        ...pq,
        conceptId: concept.id,
        conceptTitle: concept.title,
      })
    })
  })
  return list
}

export { foundationsConcepts, reactionsConcepts }
export { default as memoryData } from './memoryData'
