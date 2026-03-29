import { useEffect, useMemo, useState } from 'react'
import MainNav from './components/MainNav'
import ConceptLesson from './components/ConceptLesson'
import QuickCheck from './components/QuickCheck'
import PracticeQuestion from './components/PracticeQuestion'
import FeedbackPanel from './components/FeedbackPanel'
import RetryQuestion from './components/RetryQuestion'
import MemoryDrill from './components/MemoryDrill'
import RecallCard from './components/RecallCard'
import WeakAreaDashboard from './components/WeakAreaDashboard'
import RevisionMode from './components/RevisionMode'
import { allConceptsInOrder, flattenPracticeQuestions } from './data/index'
import memoryData from './data/memoryData'
import { evaluateShortAnswer, getRetryQuestion } from './utils/evaluation'
import {
  defaultProgress,
  loadProgress,
  markConceptComplete,
  progressSummary,
  recordPracticeAttempt,
  saveProgress,
} from './utils/progress'
import './App.css'

const practiceAll = flattenPracticeQuestions(allConceptsInOrder)

function App() {
  const [screen, setScreen] = useState('home')
  const [mode, setMode] = useState('understand')
  const [progress, setProgress] = useState(() => loadProgress() || defaultProgress())
  const [conceptIndex, setConceptIndex] = useState(0)
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [practiceWeakOnly, setPracticeWeakOnly] = useState(false)
  const [quickFeedback, setQuickFeedback] = useState(null)
  const [practiceFeedback, setPracticeFeedback] = useState(null)

  const concept = allConceptsInOrder[conceptIndex] || allConceptsInOrder[0]

  const practiceQueue = useMemo(() => {
    if (!practiceWeakOnly) return practiceAll
    const weak = new Set(progress.weakConceptIds || [])
    return practiceAll.filter((q) => weak.has(q.conceptId))
  }, [practiceWeakOnly, progress.weakConceptIds])

  const currentQuestion = practiceQueue[practiceIndex]

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const summary = progressSummary(allConceptsInOrder, progress)

  const goLearn = (nextMode) => {
    const m = nextMode || progress.lastMode || 'understand'
    setMode(m)
    setScreen('learn')
    setProgress((p) => ({ ...p, lastMode: m }))
  }

  const handleModeChange = (next) => {
    setMode(next)
    setProgress((p) => ({ ...p, lastMode: next }))
    setQuickFeedback(null)
    setPracticeFeedback(null)
    if (next === 'practice') setPracticeIndex(0)
  }

  const handleQuickSubmit = (answerText) => {
    const points = concept.quickCheck.expectedAnswerPoints || concept.quickCheck.answerKey || []
    const ev = evaluateShortAnswer(answerText, points, [])
    setQuickFeedback({
      message: `${ev.supportiveMessage} ${ev.breakPoint}`,
      correct: ev.correct,
      level: ev.level,
    })
    if (ev.correct) {
      setProgress((p) => markConceptComplete(p, concept.id))
    }
  }

  const handlePracticeSubmit = ({ answer, thought }) => {
    if (!currentQuestion) return
    const ev = evaluateShortAnswer(
      `${answer} ${thought}`,
      currentQuestion.answerKey || [],
      currentQuestion.misconceptionTags || [],
    )
    setPracticeFeedback({
      ...ev,
      questionId: currentQuestion.id,
      conceptId: currentQuestion.conceptId,
      retryQuestion: getRetryQuestion(currentQuestion),
    })
    setProgress((p) =>
      recordPracticeAttempt(p, {
        questionId: currentQuestion.id,
        conceptId: currentQuestion.conceptId,
        correct: ev.correct,
      }),
    )
  }

  const resetProgress = () => {
    const fresh = defaultProgress()
    setProgress(fresh)
    saveProgress(fresh)
    setConceptIndex(0)
    setPracticeIndex(0)
    setQuickFeedback(null)
    setPracticeFeedback(null)
    setPracticeWeakOnly(false)
  }

  const nextConcept = () => {
    setQuickFeedback(null)
    if (conceptIndex < allConceptsInOrder.length - 1) {
      setConceptIndex((i) => i + 1)
    } else {
      handleModeChange('practice')
    }
  }

  const markDone = () => {
    setProgress((p) => markConceptComplete(p, concept.id))
  }

  const memoryRoundDone = () => {
    setProgress((p) => ({ ...p, memoryRounds: (p.memoryRounds || 0) + 1 }))
  }

  return (
    <div className="app-shell">
      <header className="app-header card">
        <h1 className="app-title">Chemistry — Learn Simply</h1>
        <p className="app-tagline">Understand · Practice · Remember</p>
        {screen === 'learn' && <MainNav active={mode} onSelect={handleModeChange} />}
        {screen === 'home' && (
          <button type="button" className="btn muted btn-small-header" onClick={() => goLearn('understand')}>
            Open app
          </button>
        )}
      </header>

      {screen === 'home' && (
        <div className="stack">
          <section className="card home-progress">
            <h2>Your progress</h2>
            <p>
              Concepts explored: <strong>{summary.conceptsDone}</strong> / {summary.conceptsTotal}
            </p>
            <p>
              Weak topics flagged: <strong>{summary.weakTopics}</strong>
            </p>
            <p>
              Practice tries: <strong>{summary.practiceAttempts}</strong>
            </p>
            <button type="button" className="btn primary" onClick={() => goLearn(progress.lastMode || 'understand')}>
              Continue learning
            </button>
          </section>

          <section className="card">
            <h2>Choose a section</h2>
            <div className="home-tiles">
              <button type="button" className="tile" onClick={() => goLearn('understand')}>
                <span className="tile-title">Understand</span>
                <span className="tile-desc">Simple explanations and quick checks</span>
              </button>
              <button type="button" className="tile" onClick={() => goLearn('practice')}>
                <span className="tile-title">Practice</span>
                <span className="tile-desc">Short answers and feedback</span>
              </button>
              <button type="button" className="tile" onClick={() => goLearn('remember')}>
                <span className="tile-title">Remember</span>
                <span className="tile-desc">Drills, ions, and revision</span>
              </button>
            </div>
            <button type="button" className="btn muted" style={{ marginTop: 12 }} onClick={resetProgress}>
              Reset progress
            </button>
          </section>
        </div>
      )}

      {screen === 'learn' && mode === 'understand' && (
        <div className="stack">
          <p className="small step-label">
            Concept {conceptIndex + 1} of {allConceptsInOrder.length}
          </p>
          <ConceptLesson concept={concept} />
          <QuickCheck
            key={concept.id}
            quickCheck={concept.quickCheck}
            onSubmit={handleQuickSubmit}
            feedback={quickFeedback}
          />
          <div className="row">
            <button type="button" className="btn muted" onClick={markDone}>
              Mark concept done
            </button>
            <button type="button" className="btn primary" onClick={nextConcept}>
              {conceptIndex < allConceptsInOrder.length - 1 ? 'Next concept' : 'Go to Practice'}
            </button>
          </div>
          <button type="button" className="btn muted" onClick={() => setScreen('home')}>
            Home
          </button>
        </div>
      )}

      {screen === 'learn' && mode === 'practice' && (
        <div className="stack">
          <div className="card row space-between">
            <div>
              <h2>Practice</h2>
              <p className="small">
                {currentQuestion
                  ? `${practiceIndex + 1} / ${practiceQueue.length}`
                  : practiceWeakOnly
                    ? 'No weak-topic questions yet'
                    : 'No questions'}
              </p>
            </div>
            <button
              type="button"
              className="btn muted"
              onClick={() => {
                setPracticeIndex(0)
                setPracticeFeedback(null)
                setPracticeWeakOnly((w) => !w)
              }}
            >
              {practiceWeakOnly ? 'All questions' : 'Weak topics only'}
            </button>
          </div>

          {currentQuestion ? (
            <>
              <PracticeQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                onSubmit={handlePracticeSubmit}
                onDraftChange={() => practiceFeedback && setPracticeFeedback(null)}
                feedbackVisible={Boolean(practiceFeedback)}
              />
              {practiceFeedback && (
                <>
                  <FeedbackPanel feedback={practiceFeedback} />
                  <RetryQuestion retryQuestion={practiceFeedback.retryQuestion} />
                  <div className="row">
                    <button
                      type="button"
                      className="btn muted"
                      disabled={practiceIndex === 0}
                      onClick={() => {
                        setPracticeFeedback(null)
                        setPracticeIndex((i) => Math.max(0, i - 1))
                      }}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="btn primary"
                      onClick={() => {
                        setPracticeFeedback(null)
                        if (practiceIndex < practiceQueue.length - 1) {
                          setPracticeIndex((i) => i + 1)
                        } else {
                          handleModeChange('remember')
                        }
                      }}
                    >
                      {practiceIndex < practiceQueue.length - 1 ? 'Next question' : 'Go to Remember'}
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="card">
              <p>Practice more in “All questions” to build a weak-topic list, or complete checks in Understand.</p>
              <button type="button" className="btn primary" onClick={() => setPracticeWeakOnly(false)}>
                Show all questions
              </button>
            </div>
          )}

          <button type="button" className="btn muted" onClick={() => setScreen('home')}>
            Home
          </button>
        </div>
      )}

      {screen === 'learn' && mode === 'remember' && (
        <div className="stack">
          <MemoryDrill prompts={memoryData.rapidRecallPrompts} onRoundDone={memoryRoundDone} />
          <section className="card">
            <h3>Common ions</h3>
            <p className="small">Tap a card to reveal the name.</p>
            <div className="recall-grid">
              {memoryData.commonIons.map((ion) => (
                <RecallCard key={ion.symbol} item={ion} />
              ))}
            </div>
          </section>
          <RevisionMode valencyRows={memoryData.valencyRecall} pairs={memoryData.confusePronePairs} />
          <WeakAreaDashboard
            weakConceptIds={progress.weakConceptIds}
            onPracticeWeak={() => {
              setPracticeWeakOnly(true)
              setPracticeIndex(0)
              setPracticeFeedback(null)
              handleModeChange('practice')
            }}
          />
          <button type="button" className="btn muted" onClick={() => setScreen('home')}>
            Home
          </button>
        </div>
      )}

    </div>
  )
}

export default App
