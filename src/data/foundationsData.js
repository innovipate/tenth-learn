/** Chemistry foundations — learning order: particles → atoms → ions → charges → valency */
export const foundationsConcepts = [
  {
    id: 'particles-matter',
    title: 'What is matter made of?',
    simpleExplanation:
      'Everything you can touch or see is built from tiny bits called atoms and molecules. They are too small to see with normal eyes.',
    analogy: 'Like bricks make a wall, atoms and molecules make all matter.',
    whatActuallyHappens:
      'Atoms are the smallest unit of an element that keeps the element’s identity. Molecules are two or more atoms joined together.',
    commonMistake: 'Thinking atoms are the same as molecules every time. Sometimes one atom is enough; sometimes many join.',
    quickCheck: {
      question: 'In one line, what are atoms and molecules?',
      expectedAnswerPoints: ['atoms', 'molecules', 'small', 'matter'],
      hint: 'Say what tiny pieces build matter.',
    },
    practiceQuestions: [
      {
        id: 'particles-matter-q1',
        question: 'Why do we say atoms are very small?',
        answerKey: ['cannot see', 'tiny', 'microscopic'],
        hint: 'Think about your eyes and normal tools.',
        idealAnswer: 'Atoms are **so small** that we **cannot see** them with normal eyes.',
        misconceptionTags: ['scale_confusion'],
        retryPrompt: 'Give one reason we use models for atoms.',
      },
    ],
  },
  {
    id: 'atoms-elements',
    title: 'Atoms and elements',
    simpleExplanation:
      'An element is a kind of pure substance. Every atom of that element is the same type, like all carbon atoms are carbon.',
    analogy: 'Like every cookie from the same recipe shares the same basic dough type.',
    whatActuallyHappens:
      'Each element has its own symbol (like H, O, Na). The nucleus has protons and neutrons; electrons move outside.',
    commonMistake: 'Mixing up symbol and formula. Symbol is one element; formula can show a compound.',
    quickCheck: {
      question: 'What is an element in simple words?',
      expectedAnswerPoints: ['pure', 'same kind', 'atoms'],
      hint: 'Say “one type” in your answer.',
    },
    practiceQuestions: [
      {
        id: 'atoms-elements-q1',
        question: 'What does the symbol O stand for in chemistry?',
        answerKey: ['oxygen', 'element'],
        hint: 'It is one letter from the name.',
        idealAnswer: '**O** stands for the element **oxygen**.',
        misconceptionTags: ['symbol_confusion'],
        retryPrompt: 'What does Na stand for?',
      },
    ],
  },
  {
    id: 'ions-charge',
    title: 'Ions and charge',
    simpleExplanation:
      'An ion is an atom or group that gained or lost electrons, so it has a charge. Lost electrons → positive. Gained → negative.',
    analogy: 'Like a team that lost one player feels “one short”; gained one feels “one extra”.',
    whatActuallyHappens:
      'Cation = positive ion (often metal). Anion = negative ion (often non-metal after gaining electrons).',
    commonMistake: 'Flipping plus and minus. Lost electron leaves more protons than electrons → positive.',
    quickCheck: {
      question: 'Why is Na⁺ called a cation?',
      expectedAnswerPoints: ['lost', 'electron', 'positive'],
      hint: 'Check whether electrons are lost or gained.',
    },
    practiceQuestions: [
      {
        id: 'ions-charge-q1',
        question: 'What is an ion?',
        answerKey: ['charged', 'gained', 'lost', 'electrons'],
        hint: 'Think about electrons and charge.',
        idealAnswer:
          'An **ion** is an atom or group that has **gained or lost electrons** and has a **charge**.',
        misconceptionTags: ['definition_confusion'],
        retryPrompt: 'Why is Cl⁻ negative in one line?',
      },
      {
        id: 'ions-charge-q2',
        question: 'Why is Na⁺ called a cation?',
        answerKey: ['lost electron', 'positive', 'cation'],
        hint: 'Sodium lost one electron.',
        idealAnswer:
          '**Na⁺** is a **cation** because sodium **lost one electron** and became **positive**.',
        misconceptionTags: ['sign_error'],
        retryPrompt: 'Name one anion and say why it is negative.',
      },
    ],
  },
  {
    id: 'valency-basics',
    title: 'Valency (combining power)',
    simpleExplanation:
      'Valency tells how many bonds an atom tends to form. It helps us know how atoms combine in formulas.',
    analogy: 'Like hands to shake: some atoms behave as if they have one hand, some two, some more.',
    whatActuallyHappens:
      'We learn common valencies (H=1, O=2, Na=1, etc.) to write correct formulae and balance equations later.',
    commonMistake: 'Thinking valency is the same as atomic number. It is about combining, not total protons.',
    quickCheck: {
      question: 'What does valency help us predict?',
      expectedAnswerPoints: ['combine', 'bonds', 'formula'],
      hint: 'Think: how atoms join.',
    },
    practiceQuestions: [
      {
        id: 'valency-basics-q1',
        question: 'Why do we learn valency?',
        answerKey: ['combine', 'formulae', 'bonds'],
        hint: 'It helps write correct formulas.',
        idealAnswer: 'Valency helps us know **how atoms combine** when we write **formulae**.',
        misconceptionTags: ['definition_confusion'],
        retryPrompt: 'If oxygen often has valency 2, what does that suggest about H₂O?',
      },
    ],
  },
]

export default foundationsConcepts
