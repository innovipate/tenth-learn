// Reuse this schema for future chapters:
// update chapter metadata, subtopics, and flat practiceQuestions only.
const chapterData = {
  id: 'ncert-class10-science-chemical-reactions-equations',
  board: 'NCERT Class 10 Science',
  title: 'Chapter 1: Chemical Reactions and Equations',
  objective:
    'Learn what chemical reactions are, how to identify them, and how to read word and chemical equations.',
  outcomes: [
    'Understand what a chemical reaction means in daily life',
    'Identify signs of chemical reaction',
    'Understand reactants and products',
    'Read word and chemical equations',
    'Understand balanced and unbalanced equations',
  ],
  subtopics: [
    {
      id: 'what-is-chemical-reaction',
      title: 'What is a chemical reaction?',
      explanation:
        'A chemical reaction happens when one or more substances change into new substances with different nature and identity.',
      realLifeExample:
        'Milk turning sour, iron rusting, grapes fermenting, digestion, and respiration are common examples.',
      commonMistake:
        'Thinking every change is chemical. A chemical change needs formation of new substance.',
      quickCheck: {
        question: 'Is every change in matter a chemical reaction? Explain in one line.',
        hint: 'Ask: Is a new substance formed?',
        answerKey: ['no', 'new substance formed'],
        misconceptionTags: ['definition_confusion', 'physical_vs_chemical_change'],
      },
    },
    {
      id: 'signs-of-reaction',
      title: 'How do we know a reaction happened?',
      explanation:
        'Common signs are change in state, colour change, gas evolution, and change in temperature.',
      realLifeExample:
        'When zinc reacts with dilute acid, bubbles form and the test tube becomes warm.',
      commonMistake:
        'Thinking only colour change is proof. Any one or more signs can indicate a reaction.',
      quickCheck: {
        question: 'Name any two signs that suggest a chemical reaction.',
        hint: 'Think of gas, colour, heat, or state change.',
        answerKey: ['colour', 'gas', 'temperature', 'state'],
        misconceptionTags: ['observation_confusion', 'incomplete_reasoning'],
      },
    },
    {
      id: 'reactants-and-products',
      title: 'Reactants and products',
      explanation:
        'Substances that take part are reactants. New substances formed are products.',
      realLifeExample:
        'In magnesium + oxygen -> magnesium oxide, magnesium and oxygen are reactants and magnesium oxide is product.',
      commonMistake:
        'Mixing up LHS and RHS, or thinking arrow means equal sign.',
      quickCheck: {
        question: 'In magnesium + oxygen -> magnesium oxide, where are reactants written?',
        hint: 'Look at the left side (LHS).',
        answerKey: ['left side', 'lhs'],
        misconceptionTags: ['reactant_product_confusion', 'symbol_confusion'],
      },
    },
    {
      id: 'word-equation',
      title: 'Word equations',
      explanation:
        'A word equation shows a reaction using names of substances instead of symbols.',
      realLifeExample: 'Magnesium + Oxygen -> Magnesium oxide is a word equation.',
      commonMistake:
        'Thinking this is a different reaction. It is the same reaction written in words.',
      quickCheck: {
        question: 'Write the word equation for burning magnesium in air.',
        hint: 'Magnesium reacts with oxygen and forms magnesium oxide.',
        answerKey: ['magnesium + oxygen', 'magnesium oxide'],
        misconceptionTags: ['equation_reading_confusion', 'incomplete_reasoning'],
      },
    },
    {
      id: 'chemical-equation',
      title: 'Chemical equations',
      explanation:
        'A chemical equation represents the reaction with chemical symbols and formulae.',
      realLifeExample: 'Mg + O2 -> MgO represents burning of magnesium in oxygen.',
      commonMistake: 'Treating symbols as random letters instead of fixed element symbols.',
      quickCheck: {
        question: 'Write the chemical equation for magnesium burning in oxygen.',
        hint: 'Use symbols Mg, O2, and MgO.',
        answerKey: ['mg + o2', 'mgo'],
        misconceptionTags: ['symbol_confusion', 'formula_confusion'],
      },
    },
    {
      id: 'balanced-unbalanced',
      title: 'Balanced and unbalanced equations',
      explanation:
        'Equation is balanced when number of atoms of each element is equal on both sides.',
      realLifeExample:
        'Mg + O2 -> MgO is unbalanced because oxygen atoms are not equal on both sides.',
      commonMistake:
        'Changing formulas while balancing. Only coefficients should change, not formula identity.',
      quickCheck: {
        question: 'Why is Mg + O2 -> MgO unbalanced?',
        hint: 'Count oxygen atoms on left and right.',
        answerKey: ['oxygen not equal', '2 on left', '1 on right'],
        misconceptionTags: ['balancing_confusion', 'atom_molecule_confusion'],
      },
    },
  ],
  practiceQuestions: [
    {
      id: 'p1',
      subtopicId: 'what-is-chemical-reaction',
      prompt: 'Why is digestion called a chemical reaction?',
      hint: 'Does food remain the same, or become new substances?',
      answerKey: ['food changes', 'new substances', 'chemical change'],
      misconceptionTags: ['definition_confusion', 'new_substance_confusion', 'incomplete_reasoning'],
      retryPrompt: 'Why is respiration a chemical reaction? Explain using change into new substances.',
    },
    {
      id: 'p2',
      subtopicId: 'what-is-chemical-reaction',
      prompt: 'Why is rusting of iron a chemical reaction?',
      hint: 'Think: iron becomes iron oxide.',
      answerKey: ['new substance', 'iron oxide', 'identity changes'],
      misconceptionTags: ['definition_confusion', 'physical_vs_chemical_change'],
      retryPrompt: 'Explain why souring of milk is a chemical reaction.',
    },
    {
      id: 'p3',
      subtopicId: 'signs-of-reaction',
      prompt:
        'What observations in burning magnesium ribbon show that a chemical reaction took place?',
      hint: 'Think about flame, ash colour, and formation of magnesium oxide.',
      answerKey: ['white flame', 'white powder', 'magnesium oxide', 'new substance'],
      misconceptionTags: ['observation_confusion', 'incomplete_reasoning'],
      retryPrompt: 'Give two clear observations that show a gas-evolving reaction occurred in a lab.',
    },
    {
      id: 'p4',
      subtopicId: 'signs-of-reaction',
      prompt: 'Why does gas evolution indicate a chemical reaction?',
      hint: 'What do bubbles show about products?',
      answerKey: ['new substance', 'gas formed', 'product formed'],
      misconceptionTags: ['cause_effect_confusion', 'definition_confusion'],
      retryPrompt: 'How does temperature rise in a test tube suggest a reaction happened?',
    },
    {
      id: 'p5',
      subtopicId: 'reactants-and-products',
      prompt: 'What are reactants in a chemical reaction?',
      hint: 'These are present before reaction starts.',
      answerKey: ['take part', 'starting substances', 'undergo change'],
      misconceptionTags: ['definition_confusion'],
      retryPrompt: 'Define products in your own words and where they appear in equation.',
    },
    {
      id: 'p6',
      subtopicId: 'reactants-and-products',
      prompt: 'In zinc + acid -> hydrogen + salt, name one product.',
      hint: 'Products are on right-hand side.',
      answerKey: ['hydrogen', 'salt'],
      misconceptionTags: ['reactant_product_confusion'],
      retryPrompt: 'In magnesium + oxygen -> magnesium oxide, which are reactants?',
    },
    {
      id: 'p7',
      subtopicId: 'word-equation',
      prompt: 'What is the use of a word equation?',
      hint: 'Think about beginner-friendly representation.',
      answerKey: ['simple words', 'shows reactants and products', 'easy to understand'],
      misconceptionTags: ['definition_confusion', 'incomplete_reasoning'],
      retryPrompt: 'Why might teachers use word equations before chemical equations?',
    },
    {
      id: 'p8',
      subtopicId: 'word-equation',
      prompt: 'What does the arrow in a word equation show?',
      hint: 'It points from reactants to products.',
      answerKey: ['direction', 'reactants to products'],
      misconceptionTags: ['symbol_confusion'],
      retryPrompt: 'What does the plus sign mean in a word equation?',
    },
    {
      id: 'p9',
      subtopicId: 'chemical-equation',
      prompt: 'Why is a chemical equation shorter than a word equation?',
      hint: 'Compare full names vs symbols/formulae.',
      answerKey: ['uses symbols', 'uses formulae', 'concise'],
      misconceptionTags: ['symbol_confusion', 'incomplete_reasoning'],
      retryPrompt: 'Write one reason chemical equations are more useful in science writing.',
    },
    {
      id: 'p10',
      subtopicId: 'chemical-equation',
      prompt: 'What does O2 mean in Mg + O2 -> MgO?',
      hint: 'Subscript tells number of atoms in a molecule.',
      answerKey: ['oxygen molecule', 'two oxygen atoms'],
      misconceptionTags: ['formula_confusion', 'atom_molecule_confusion'],
      retryPrompt: 'In CO2, what does the 2 indicate?',
    },
    {
      id: 'p11',
      subtopicId: 'balanced-unbalanced',
      prompt: 'What do we compare to check whether an equation is balanced?',
      hint: 'Compare atom count of each element on both sides.',
      answerKey: ['number of atoms', 'each element', 'both sides'],
      misconceptionTags: ['balancing_confusion', 'incomplete_reasoning'],
      retryPrompt: 'How do you verify if hydrogen atoms are balanced in an equation?',
    },
    {
      id: 'p12',
      subtopicId: 'balanced-unbalanced',
      prompt: 'What is a skeletal chemical equation?',
      hint: 'Think about equation before balancing.',
      answerKey: ['unbalanced equation', 'before balancing'],
      misconceptionTags: ['definition_confusion', 'balancing_confusion'],
      retryPrompt: 'Why do we call an equation skeletal before balancing it?',
    },
  ],
}

export default chapterData
