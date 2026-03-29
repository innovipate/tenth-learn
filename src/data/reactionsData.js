/** Chemical reactions — logical order after foundations */
export const reactionsConcepts = [
  {
    id: 'what-is-reaction',
    title: 'What is a chemical reaction?',
    simpleExplanation:
      'A chemical reaction is when substances change into new substances with different identity. A new substance really forms.',
    analogy: 'Like milk turning sour: it is not the same as fresh milk anymore.',
    whatActuallyHappens:
      'Atoms rearrange and make new products. This is different from only mixing or only changing shape.',
    commonMistake: 'Calling every change “chemical”. Ice melting is mostly physical; rusting is chemical.',
    quickCheck: {
      question: 'Is every change in matter a chemical reaction?',
      expectedAnswerPoints: ['no', 'new substance'],
      hint: 'Ask if a new substance forms.',
    },
    practiceQuestions: [
      {
        id: 'what-is-reaction-q1',
        question: 'Why is digestion called a chemical reaction?',
        answerKey: ['new substances', 'food changes', 'chemical'],
        hint: 'Does food stay exactly the same inside?',
        idealAnswer:
          'Digestion is chemical because food changes into **new substances** that are not the same as the original food.',
        misconceptionTags: ['definition_confusion'],
        retryPrompt: 'Why is rusting a chemical reaction?',
      },
    ],
  },
  {
    id: 'signs-of-reaction',
    title: 'Signs that a reaction happened',
    simpleExplanation:
      'We often spot a reaction by colour change, gas bubbles, temperature change, or state change.',
    analogy: 'Like hearing a whistle when a kettle boils—something new is happening you can notice.',
    whatActuallyHappens:
      'Gas evolution means a new gas product. Heat can mean energy released or absorbed in the change.',
    commonMistake: 'Thinking only colour change counts. Any clear sign can support a reaction.',
    quickCheck: {
      question: 'Name two signs that suggest a chemical reaction.',
      expectedAnswerPoints: ['colour', 'gas', 'temperature', 'state'],
      hint: 'Pick any two from colour, gas, heat, state.',
    },
    practiceQuestions: [
      {
        id: 'signs-of-reaction-q1',
        question: 'Why does gas evolution suggest a chemical reaction?',
        answerKey: ['new substance', 'gas', 'product'],
        hint: 'What do bubbles mean is forming?',
        idealAnswer: 'Bubbles show a **new gas** (a **new substance**) is forming.',
        misconceptionTags: ['cause_effect_confusion'],
        retryPrompt: 'Give one observation from burning magnesium that shows a reaction.',
      },
    ],
  },
  {
    id: 'reactants-products',
    title: 'Reactants and products',
    simpleExplanation:
      'Reactants are the starting substances. Products are the new substances formed. In a word equation, reactants are on the left of the arrow.',
    analogy: 'Ingredients on the left of a recipe arrow, dish on the right.',
    whatActuallyHappens:
      'The arrow shows direction: reactants turn into products. Plus signs separate substances on the same side.',
    commonMistake: 'Thinking the arrow means “equals”. It means “forms” or “goes to”.',
    quickCheck: {
      question: 'Where are reactants written in a word equation?',
      expectedAnswerPoints: ['left', 'lhs'],
      hint: 'Arrow points away from starters.',
    },
    practiceQuestions: [
      {
        id: 'reactants-products-q1',
        question: 'In zinc + acid → hydrogen + salt, name one product.',
        answerKey: ['hydrogen', 'salt'],
        hint: 'Products are on the right.',
        idealAnswer: 'One product is **hydrogen** (or **salt**).',
        misconceptionTags: ['reactant_product_confusion'],
        retryPrompt: 'Where are reactants in the same line?',
      },
    ],
  },
  {
    id: 'equations-balancing',
    title: 'Equations and balancing',
    simpleExplanation:
      'A chemical equation uses symbols. It is balanced when atom counts match on both sides. Before balancing, it can be skeletal (unbalanced).',
    analogy: 'Like counting marbles on two pans of a scale—you want the same total on each side.',
    whatActuallyHappens:
      'We balance using coefficients (numbers in front), not by changing subscripts inside formulas.',
    commonMistake: 'Changing subscripts to balance. That changes the substance itself.',
    quickCheck: {
      question: 'What do we compare to check if an equation is balanced?',
      expectedAnswerPoints: ['atoms', 'both sides', 'each element'],
      hint: 'Count on left and right.',
    },
    practiceQuestions: [
      {
        id: 'equations-balancing-q1',
        question: 'What is a skeletal chemical equation?',
        answerKey: ['unbalanced', 'before balancing'],
        hint: 'Written before atom counts are equal.',
        idealAnswer: 'A **skeletal equation** is **unbalanced**—written **before** we equalise atom counts.',
        misconceptionTags: ['balancing_confusion'],
        retryPrompt: 'Why is Mg + O₂ → MgO unbalanced for oxygen atoms?',
      },
    ],
  },
]

export default reactionsConcepts
