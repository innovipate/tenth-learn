import { useEffect, useMemo, useState } from 'react'
import ChapterHeader from './components/ChapterHeader'
import SubtopicCard from './components/SubtopicCard'
import QuickCheck from './components/QuickCheck'
import PracticeQuestion from './components/PracticeQuestion'
import FeedbackPanel from './components/FeedbackPanel'
import RetryQuestion from './components/RetryQuestion'
import MasteryDashboard from './components/MasteryDashboard'
import chapterData from './data/chapterData'
import { evaluateShortAnswer, getRetryQuestion } from './utils/evaluation'
import {
  createInitialProgress,
  getMasteryFromProgress,
  loadProgress,
  saveProgress,
} from './utils/progress'
import './App.css'

function App() {
  const [view, setView] = useState('home')
  const [difficulty, setDifficulty] = useState('medium')
  const [subtopicIndex, setSubtopicIndex] = useState(0)
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [practiceMode, setPracticeMode] = useState('all')
  const [progress, setProgress] = useState(
    () => loadProgress(chapterData.id) || createInitialProgress(chapterData, difficulty),
  )
  const [practiceFeedback, setPracticeFeedback] = useState(null)
  const [quickCheckFeedback, setQuickCheckFeedback] = useState(null)

  const activeSubtopic = chapterData.subtopics[subtopicIndex]

  const practiceQuestions = useMemo(() => {
    if (practiceMode === 'mistakes') {
      const attemptedWrong = new Set(
        progress.practiceAttempts.filter((item) => !item.correct).map((item) => item.questionId),
      )
      return chapterData.practiceQuestions.filter((question) => attemptedWrong.has(question.id))
    }
    return chapterData.practiceQuestions
  }, [practiceMode, progress?.practiceAttempts])

  const currentPracticeQuestion = practiceQuestions[practiceIndex]

  useEffect(() => {
    saveProgress(chapterData.id, progress)
  }, [progress])

  const startLearning = () => {
    setProgress((prev) => prev || createInitialProgress(chapterData, difficulty))
    setView('learn')
  }

  const handleQuickCheckSubmit = (answerText) => {
    const evaluation = evaluateShortAnswer(
      answerText,
      activeSubtopic.quickCheck.answerKey || activeSubtopic.quickCheck.expectedKeywords,
      activeSubtopic.quickCheck.misconceptions || activeSubtopic.quickCheck.misconceptionTags,
      difficulty,
    )

    const message = evaluation.correct
      ? 'Nice thinking. Your quick check is on the right track.'
      : `Almost there. ${evaluation.breakPoint}`
    setQuickCheckFeedback({
      message,
      correct: evaluation.correct,
      animationId: Date.now(),
    })

    setProgress((prev) => {
      const current = prev || createInitialProgress(chapterData, difficulty)
      const prevItem = current.subtopicProgress[activeSubtopic.id]
      return {
        ...current,
        difficulty,
        subtopicProgress: {
          ...current.subtopicProgress,
          [activeSubtopic.id]: {
            ...prevItem,
            quickCheckAttempts: prevItem.quickCheckAttempts + 1,
            quickCheckCorrect: prevItem.quickCheckCorrect + (evaluation.correct ? 1 : 0),
          },
        },
      }
    })
  }

  const handleNextSubtopic = () => {
    setQuickCheckFeedback(null)
    if (subtopicIndex < chapterData.subtopics.length - 1) {
      setSubtopicIndex((prev) => prev + 1)
      return
    }
    setView('practice')
  }

  const handlePracticeSubmit = ({ answer, thought }) => {
    if (!currentPracticeQuestion) return

    const evaluation = evaluateShortAnswer(
      answer,
      currentPracticeQuestion.answerKey || currentPracticeQuestion.expectedKeywords,
      currentPracticeQuestion.misconceptions || currentPracticeQuestion.misconceptionTags,
      difficulty,
      thought,
    )
    setPracticeFeedback({
      ...evaluation,
      animationId: Date.now(),
      questionId: currentPracticeQuestion.id,
      subtopicId: currentPracticeQuestion.subtopicId,
      retryQuestion: getRetryQuestion(currentPracticeQuestion),
    })

    setProgress((prev) => {
      const current = prev || createInitialProgress(chapterData, difficulty)
      const misconceptionTag = evaluation.misconception?.tag || 'none'
      const newAttempt = {
        questionId: currentPracticeQuestion.id,
        subtopicId: currentPracticeQuestion.subtopicId,
        correct: evaluation.correct,
        misconceptionTag,
      }
      return {
        ...current,
        difficulty,
        practiceAttempts: [...current.practiceAttempts, newAttempt],
        misconceptionCounts: {
          ...current.misconceptionCounts,
          [misconceptionTag]: (current.misconceptionCounts[misconceptionTag] || 0) + 1,
        },
      }
    })
  }

  const handlePracticeDraftChange = () => {
    if (practiceFeedback) {
      setPracticeFeedback(null)
    }
  }

  const moveToNextPractice = () => {
    setPracticeFeedback(null)
    if (practiceIndex < practiceQuestions.length - 1) {
      setPracticeIndex((prev) => prev + 1)
      return
    }
    setView('dashboard')
  }

  const moveToPreviousPractice = () => {
    setPracticeFeedback(null)
    if (practiceIndex > 0) {
      setPracticeIndex((prev) => prev - 1)
    }
  }

  const resetAllProgress = () => {
    const reset = createInitialProgress(chapterData, difficulty)
    setProgress(reset)
    setSubtopicIndex(0)
    setPracticeIndex(0)
    setPracticeFeedback(null)
    setQuickCheckFeedback(null)
    setPracticeMode('all')
    setView('home')
  }

  const mastery = getMasteryFromProgress(chapterData, progress)

  return (
    <div className="app-shell">
      <ChapterHeader chapter={chapterData} />

      {view === 'home' && (
        <section className="card">
          <h2>Chapter Overview</h2>
          <p>{chapterData.objective}</p>
          <ul className="learn-list">
            {chapterData.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <label className="label" htmlFor="difficulty-select">
            Choose your difficulty
          </label>
          <select
            id="difficulty-select"
            className="input"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <div className="row">
            <button className="btn primary" onClick={startLearning}>
              Start Learning
            </button>
            <button className="btn muted" onClick={resetAllProgress}>
              Reset Progress
            </button>
          </div>
        </section>
      )}

      {view === 'learn' && (
        <section className="stack">
          <SubtopicCard subtopic={activeSubtopic} />
          <QuickCheck
            key={`${activeSubtopic.id}-${quickCheckFeedback?.animationId || 'fresh'}`}
            quickCheck={activeSubtopic.quickCheck}
            onSubmit={handleQuickCheckSubmit}
            feedback={quickCheckFeedback}
          />
          <button className="btn primary" onClick={handleNextSubtopic}>
            {subtopicIndex < chapterData.subtopics.length - 1 ? 'Next Question' : 'Go to Practice'}
          </button>
        </section>
      )}

      {view === 'practice' && (
        <section className="stack">
          <div className="card">
            <div className="row space-between">
              <h2>Guided Practice</h2>
              <button
                className="btn muted"
                onClick={() => {
                  setPracticeIndex(0)
                  setPracticeFeedback(null)
                  setPracticeMode((prev) => (prev === 'all' ? 'mistakes' : 'all'))
                }}
              >
                {practiceMode === 'all' ? 'Practice Only Mistakes' : 'Practice All Questions'}
              </button>
            </div>
            <p className="small">
              Question {Math.min(practiceIndex + 1, practiceQuestions.length)} of{' '}
              {practiceQuestions.length}
            </p>
          </div>

          {currentPracticeQuestion ? (
            <>
              <PracticeQuestion
                key={currentPracticeQuestion.id}
                question={currentPracticeQuestion}
                onSubmit={handlePracticeSubmit}
                onDraftChange={handlePracticeDraftChange}
              />
              {practiceFeedback && (
                <>
                  <FeedbackPanel key={practiceFeedback.animationId} feedback={practiceFeedback} />
                  <RetryQuestion retryQuestion={practiceFeedback.retryQuestion} />
                  <div className="row">
                    <button
                      className="btn muted"
                      onClick={moveToPreviousPractice}
                      disabled={practiceIndex === 0}
                    >
                      Previous Question
                    </button>
                    <button className="btn primary" onClick={moveToNextPractice}>
                      Next Practice Question
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="card">
              <p>
                No mistake questions yet. Solve all questions once, then this mode can help you
                revise weak spots.
              </p>
              <button className="btn primary" onClick={() => setPracticeMode('all')}>
                Back to All Questions
              </button>
            </div>
          )}

          <button className="btn muted" onClick={() => setView('dashboard')}>
            View Dashboard
          </button>
        </section>
      )}

      {view === 'dashboard' && (
        <MasteryDashboard
          mastery={mastery}
          onPracticeWeakAreas={() => {
            setPracticeMode('mistakes')
            setPracticeIndex(0)
            setPracticeFeedback(null)
            setView('practice')
          }}
          onRestart={resetAllProgress}
        />
      )}
    </div>
  )
}

export default App
