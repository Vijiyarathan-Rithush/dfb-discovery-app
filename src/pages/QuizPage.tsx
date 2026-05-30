import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import VisitorLayout from '../components/visitor/VisitorLayout'
import { getObjectById } from '../api/ObjectApi'
import type { ObjectData } from '../types/ObjectData'
import { getStoredLanguage, textForLanguage } from '../utils/language'
import styles from './QuizPage.module.scss'

function QuizPage() {
  const { objectId } = useParams()
  const [object, setObject] = useState<ObjectData | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const language = getStoredLanguage()
  const isFr = language === 'FR'

  useEffect(() => {
    async function loadObject() {
      if (!objectId) {
        setError('Keine Objekt-ID vorhanden.')
        setIsLoading(false)
        return
      }

      try {
        const loaded = await getObjectById(objectId)
        setObject(loaded)
      } catch {
        setError('Objekt konnte nicht geladen werden.')
      } finally {
        setIsLoading(false)
      }
    }

    loadObject()
  }, [objectId])

  function handleAnswer(index: number) {
    if (!object || selected !== null) {
      return
    }

    setSelected(index)

    if (index === object.quiz[currentIndex].correctAnswerIndex) {
      setCorrectCount((count) => count + 1)
    }
  }

  function handleNext() {
    if (!object) {
      return
    }

    if (currentIndex + 1 >= object.quiz.length) {
      setFinished(true)
      return
    }

    setCurrentIndex((index) => index + 1)
    setSelected(null)
  }

  function handleRestart() {
    setCurrentIndex(0)
    setSelected(null)
    setCorrectCount(0)
    setFinished(false)
  }

  if (isLoading) {
    return (
      <VisitorLayout title="Quiz">
        <section className={styles.body}>
          <p>{isFr ? 'Chargement de l’objet...' : 'Objekt wird geladen...'}</p>
        </section>
      </VisitorLayout>
    )
  }

  if (error || !object) {
    return (
      <VisitorLayout title="Quiz">
        <section className={styles.body}>
          <article className={styles.messageCard}>
            <p>{error || (isFr ? 'Objet introuvable.' : 'Objekt nicht gefunden.')}</p>
            <Link className={styles.backLink} to={objectId ? `/object/${objectId}` : '/'}>
              {isFr ? 'Retour' : 'Zurück'}
            </Link>
          </article>
        </section>
      </VisitorLayout>
    )
  }

  const quiz = object.quiz ?? []

  if (quiz.length === 0) {
    return (
      <VisitorLayout title="Quiz">
        <section className={styles.body}>
          <article className={styles.messageCard}>
            <p>
              {isFr
                ? 'Aucun quiz n’est encore disponible pour cet objet.'
                : 'Für dieses Objekt ist noch kein Quiz erfasst.'}
            </p>
            <Link className={styles.backLink} to={`/object/${object.id}`}>
              {isFr ? 'Retour' : 'Zurück'}
            </Link>
          </article>
        </section>
      </VisitorLayout>
    )
  }

  if (finished) {
    return (
      <VisitorLayout title="Quiz">
        <section className={styles.body}>
          <article className={styles.resultCard}>
            <h2 className={styles.resultTitle}>{isFr ? 'Résultat' : 'Ergebnis'}</h2>
            <p className={styles.resultText} aria-live="polite">
              {isFr
                ? `${correctCount} question(s) correcte(s) sur ${quiz.length}.`
                : `${correctCount} von ${quiz.length} Fragen richtig beantwortet.`}
            </p>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.restartButton}
                onClick={handleRestart}
              >
                {isFr ? 'Recommencer le quiz' : 'Quiz wiederholen'}
              </button>

              <Link className={styles.backLink} to={`/object/${object.id}`}>
                {isFr ? 'Retour à l’objet' : 'Zurück zum Objekt'}
              </Link>
            </div>
          </article>
        </section>
      </VisitorLayout>
    )
  }

  const question = quiz[currentIndex]
  const questionText = textForLanguage(language, question.questionDe, question.questionFr)
  const answers = (language === 'FR' && question.answersFr?.length
    ? question.answersFr
    : question.answersDe) ?? []
  const explanation = textForLanguage(
    language,
    question.explanationDe,
    question.explanationFr,
  )
  const isCorrect = selected === question.correctAnswerIndex

  return (
    <VisitorLayout title="Quiz">
      <section className={styles.body}>
        <p className={styles.pill}>
          {isFr
            ? `Question ${currentIndex + 1} sur ${quiz.length}`
            : `Frage ${currentIndex + 1} von ${quiz.length}`}
        </p>

        <h2 className={styles.question}>{questionText}</h2>

        <div
          className={styles.answers}
          role="group"
          aria-label={isFr ? 'Choisir une réponse' : 'Antwort wählen'}
        >
          {answers.map((answer, index) => {
            const isSelected = selected === index
            const isRightAnswer = index === question.correctAnswerIndex
            const className = [
              styles.answerButton,
              selected !== null && isRightAnswer ? styles.answerCorrect : '',
              selected !== null && isSelected && !isRightAnswer ? styles.answerWrong : '',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <button
                key={`${question.id}-${answer}`}
                type="button"
                className={className}
                onClick={() => handleAnswer(index)}
                disabled={selected !== null}
                aria-pressed={isSelected}
              >
                {answer}
              </button>
            )
          })}
        </div>

        {selected !== null && (
          <div className={styles.feedback} aria-live="polite">
            <p
              className={`${styles.feedbackMessage} ${
                isCorrect ? styles.correctText : styles.wrongText
              }`}
            >
              {isCorrect
                ? (isFr ? 'Bonne réponse.' : 'Richtig beantwortet.')
                : (isFr ? 'Mauvaise réponse.' : 'Falsch beantwortet.')}
            </p>

            {explanation && <p className={styles.explanation}>{explanation}</p>}

            <button
              type="button"
              className={styles.nextButton}
              onClick={handleNext}
            >
              {currentIndex + 1 < quiz.length
                ? (isFr ? 'Question suivante' : 'Nächste Frage')
                : (isFr ? 'Afficher le résultat' : 'Ergebnis anzeigen')}
            </button>
          </div>
        )}
      </section>
    </VisitorLayout>
  )
}

export default QuizPage
