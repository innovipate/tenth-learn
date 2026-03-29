/** Retention drills — ions, valency, confuse-prone pairs, rapid prompts */

export const commonIons = [
  { symbol: 'Na⁺', name: 'Sodium ion', note: 'Cation, +1' },
  { symbol: 'K⁺', name: 'Potassium ion', note: 'Cation, +1' },
  { symbol: 'Ca²⁺', name: 'Calcium ion', note: 'Cation, +2' },
  { symbol: 'Mg²⁺', name: 'Magnesium ion', note: 'Cation, +2' },
  { symbol: 'Al³⁺', name: 'Aluminium ion', note: 'Cation, +3' },
  { symbol: 'Cl⁻', name: 'Chloride ion', note: 'Anion, -1' },
  { symbol: 'O²⁻', name: 'Oxide ion', note: 'Anion, -2' },
  { symbol: 'SO₄²⁻', name: 'Sulfate ion', note: 'Polyatomic, -2' },
]

export const valencyRecall = [
  { element: 'H', valency: '1' },
  { element: 'O', valency: '2' },
  { element: 'Na', valency: '1' },
  { element: 'Mg', valency: '2' },
  { element: 'Al', valency: '3' },
  { element: 'C (many cases)', valency: '4' },
]

export const confusePronePairs = [
  {
    a: 'Atom',
    b: 'Molecule',
    tip: 'Atom = one unit of an element. Molecule = two or more atoms bonded.',
  },
  {
    a: 'Cation',
    b: 'Anion',
    tip: 'Cation + (lost e⁻). Anion − (gained e⁻).',
  },
  {
    a: 'Physical change',
    b: 'Chemical change',
    tip: 'Physical: same substance identity. Chemical: new substance.',
  },
  {
    a: 'Reactant',
    b: 'Product',
    tip: 'Reactants left of arrow; products right.',
  },
]

export const rapidRecallPrompts = [
  'Say in one line: what is an ion?',
  'Say in one line: what is a cation?',
  'Name two signs of a chemical reaction.',
  'Where are reactants in a word equation?',
  'What does balancing an equation protect?',
  'What is wrong with changing subscripts to balance?',
]

export const memoryData = {
  commonIons,
  valencyRecall,
  confusePronePairs,
  rapidRecallPrompts,
}

export default memoryData
