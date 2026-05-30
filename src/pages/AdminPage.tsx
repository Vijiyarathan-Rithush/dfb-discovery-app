import { useState, useRef } from 'react'
import type { FormEventHandler, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { saveObject } from '../api/ObjectApi'
import type { Hotspot, QuizQuestion } from '../types/ObjectData'

function AdminPage() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [imagePreview, setImagePreview] = useState<string>('')
  const imageRef = useRef<HTMLImageElement>(null)

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImagePreview('')
    }
  }

  function handleImageClick(e: React.MouseEvent<HTMLImageElement>) {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    const newHotspot: Hotspot = {
      id: `hs-${Date.now()}`,
      titleDe: '',
      titleFr: '',
      textDe: '',
      textFr: '',
      x,
      y,
    }
    setHotspots((prev) => [...prev, newHotspot])
  }

  function updateHotspot(id: string, field: keyof Hotspot, value: string) {
    setHotspots((prev) =>
      prev.map((hs) => (hs.id === id ? { ...hs, [field]: value } : hs))
    )
  }

  function removeHotspot(id: string) {
    setHotspots((prev) => prev.filter((hs) => hs.id !== id))
  }

  function addQuizQuestion() {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      questionDe: '',
      questionFr: '',
      answersDe: ['', '', ''],
      answersFr: ['', '', ''],
      correctAnswerIndex: 0,
      explanationDe: '',
      explanationFr: '',
    }
    setQuiz((prev) => [...prev, newQ])
  }

  function updateQuiz(id: string, field: keyof QuizQuestion, value: unknown) {
    setQuiz((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    )
  }

  function updateQuizAnswer(id: string, lang: 'De' | 'Fr', index: number, value: string) {
    setQuiz((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q
        const arr = lang === 'De' ? [...q.answersDe] : [...q.answersFr]
        arr[index] = value
        return { ...q, [`answers${lang}`]: arr }
      })
    )
  }

  function removeQuizQuestion(id: string) {
    setQuiz((prev) => prev.filter((q) => q.id !== id))
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)
    // No manual ID – backend generates it
    formData.delete('id')
    formData.set('hotspots', JSON.stringify(hotspots))
    formData.set('quiz', JSON.stringify(quiz))

    try {
      await saveObject(formData)
      setMessage('Objekt wurde gespeichert.')
      form.reset()
      setHotspots([])
      setQuiz([])
      setImagePreview('')
    } catch {
      setError('Objekt konnte nicht gespeichert werden.')
    }
  }

  return (
    <main className="app-page admin-page">
      <section className="card">
        <p className="eyebrow">Admin</p>
        <h1>Objekt erfassen</h1>
        <p>
          Admins können hier ein Objekt erfassen. Die Daten und das Bild
          werden über eine API im Backend gespeichert.
        </p>
        <p className="form-hint">
          Felder mit <span className="required-star">*</span> sind Pflichtfelder.
          Die Objekt-ID wird automatisch aus dem deutschen Titel erzeugt.
        </p>

        <form className="admin-form" onSubmit={handleSubmit}>

          {/* A) Grunddaten */}
          <div className="form-section-title form-field--full">
            <h2>A) Grunddaten</h2>
          </div>

          <div className="form-field">
            <label htmlFor="titleDe">
              Titel Deutsch <span className="required-star">*</span>
            </label>
            <input id="titleDe" name="titleDe" required placeholder="Dampflokomotive HG 3/4" />
          </div>

          <div className="form-field">
            <label htmlFor="titleFr">
              Titel Französisch <span className="required-star">*</span>
            </label>
            <input id="titleFr" name="titleFr" required placeholder="Locomotive à vapeur HG 3/4" />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="shortDe">
              Kurzbeschreibung Deutsch <span className="required-star">*</span>
            </label>
            <textarea id="shortDe" name="shortDe" required />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="shortFr">Kurzbeschreibung Französisch</label>
            <textarea id="shortFr" name="shortFr" />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="technicalDe">Technische Beschreibung Deutsch</label>
            <textarea id="technicalDe" name="technicalDe" />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="technicalFr">Technische Beschreibung Französisch</label>
            <textarea id="technicalFr" name="technicalFr" />
          </div>

          {/* B) Medien */}
          <div className="form-section-title form-field--full">
            <h2>B) Medien</h2>
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="image">Bild hochladen</label>
            <input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
            <span className="form-hint">Empfohlen: JPG oder PNG, max. 5 MB</span>
          </div>

          <div className="form-field">
            <label htmlFor="imageAltDe">Bild-Alt-Text Deutsch</label>
            <input id="imageAltDe" name="imageAltDe" placeholder="Beschreibung des Bildes" />
          </div>

          <div className="form-field">
            <label htmlFor="imageAltFr">Bild-Alt-Text Französisch</label>
            <input id="imageAltFr" name="imageAltFr" placeholder="Description de l'image" />
          </div>

          <div className="form-field">
            <label htmlFor="audioUrlDe">Audio-URL Deutsch</label>
            <input id="audioUrlDe" name="audioUrlDe" type="url" placeholder="https://..." />
          </div>

          <div className="form-field">
            <label htmlFor="audioUrlFr">Audio-URL Französisch</label>
            <input id="audioUrlFr" name="audioUrlFr" type="url" placeholder="https://..." />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="audioTranscriptDe">Audiotranskript Deutsch</label>
            <textarea id="audioTranscriptDe" name="audioTranscriptDe" />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="audioTranscriptFr">Audiotranskript Französisch</label>
            <textarea id="audioTranscriptFr" name="audioTranscriptFr" />
          </div>

          {/* C) Orientierung */}
          <div className="form-section-title form-field--full">
            <h2>C) Orientierung</h2>
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="locationHintDe">Standort-Hinweis Deutsch</label>
            <textarea id="locationHintDe" name="locationHintDe" placeholder="z.B. Im Hauptgebäude, linke Seite, Gleis 2" />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="locationHintFr">Standort-Hinweis Französisch</label>
            <textarea id="locationHintFr" name="locationHintFr" placeholder="ex. Dans le bâtiment principal, côté gauche, voie 2" />
          </div>

          {/* D) Hotspots */}
          <div className="form-section-title form-field--full">
            <h2>D) Hotspots</h2>
            <p className="form-hint">
              {imagePreview
                ? 'Klicken Sie auf das Bild, um einen Hotspot zu setzen.'
                : 'Laden Sie zuerst ein Bild hoch, um Hotspots zu setzen.'}
            </p>
          </div>

          {imagePreview && (
            <div className="form-field--full hotspot-editor">
              <div className="hotspot-preview">
                <img
                  ref={imageRef}
                  src={imagePreview}
                  alt="Vorschau"
                  onClick={handleImageClick}
                  style={{ cursor: 'crosshair' }}
                />
                {hotspots.map((hs) => (
                  <button
                    key={hs.id}
                    type="button"
                    className="hotspot-marker"
                    style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                    aria-label={`Hotspot bei ${hs.x}%, ${hs.y}%`}
                    tabIndex={-1}
                  >
                    +
                  </button>
                ))}
              </div>
            </div>
          )}

          {hotspots.length > 0 && (
            <div className="form-field--full">
              {hotspots.map((hs, i) => (
                <div key={hs.id} className="hotspot-form-item">
                  <p className="form-hint">Hotspot {i + 1} (x: {hs.x}%, y: {hs.y}%)</p>
                  <div className="admin-form">
                    <div className="form-field">
                      <label htmlFor={`hs-titleDe-${hs.id}`}>Titel DE</label>
                      <input
                        id={`hs-titleDe-${hs.id}`}
                        value={hs.titleDe}
                        onChange={(e) => updateHotspot(hs.id, 'titleDe', e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor={`hs-titleFr-${hs.id}`}>Titel FR</label>
                      <input
                        id={`hs-titleFr-${hs.id}`}
                        value={hs.titleFr}
                        onChange={(e) => updateHotspot(hs.id, 'titleFr', e.target.value)}
                      />
                    </div>
                    <div className="form-field form-field--full">
                      <label htmlFor={`hs-textDe-${hs.id}`}>Text DE</label>
                      <textarea
                        id={`hs-textDe-${hs.id}`}
                        value={hs.textDe}
                        onChange={(e) => updateHotspot(hs.id, 'textDe', e.target.value)}
                      />
                    </div>
                    <div className="form-field form-field--full">
                      <label htmlFor={`hs-textFr-${hs.id}`}>Text FR</label>
                      <textarea
                        id={`hs-textFr-${hs.id}`}
                        value={hs.textFr}
                        onChange={(e) => updateHotspot(hs.id, 'textFr', e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => removeHotspot(hs.id)}
                  >
                    Hotspot {i + 1} löschen
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* E) Quiz */}
          <div className="form-section-title form-field--full">
            <h2>E) Quiz</h2>
          </div>

          <div className="form-field--full quiz-editor">
            {quiz.map((q, i) => (
              <div key={q.id} className="quiz-form-item">
                <p className="form-hint">Frage {i + 1}</p>
                <div className="admin-form">
                  <div className="form-field form-field--full">
                    <label htmlFor={`q-de-${q.id}`}>Frage DE</label>
                    <input
                      id={`q-de-${q.id}`}
                      value={q.questionDe}
                      onChange={(e) => updateQuiz(q.id, 'questionDe', e.target.value)}
                    />
                  </div>
                  <div className="form-field form-field--full">
                    <label htmlFor={`q-fr-${q.id}`}>Frage FR</label>
                    <input
                      id={`q-fr-${q.id}`}
                      value={q.questionFr}
                      onChange={(e) => updateQuiz(q.id, 'questionFr', e.target.value)}
                    />
                  </div>
                  {(['A', 'B', 'C'] as const).map((letter, idx) => (
                    <div key={letter} className="form-field">
                      <label htmlFor={`q-ade-${q.id}-${idx}`}>Antwort {letter} DE</label>
                      <input
                        id={`q-ade-${q.id}-${idx}`}
                        value={q.answersDe[idx] ?? ''}
                        onChange={(e) => updateQuizAnswer(q.id, 'De', idx, e.target.value)}
                      />
                    </div>
                  ))}
                  {(['A', 'B', 'C'] as const).map((letter, idx) => (
                    <div key={letter} className="form-field">
                      <label htmlFor={`q-afr-${q.id}-${idx}`}>Antwort {letter} FR</label>
                      <input
                        id={`q-afr-${q.id}-${idx}`}
                        value={q.answersFr[idx] ?? ''}
                        onChange={(e) => updateQuizAnswer(q.id, 'Fr', idx, e.target.value)}
                      />
                    </div>
                  ))}
                  <div className="form-field">
                    <label htmlFor={`q-correct-${q.id}`}>Richtige Antwort</label>
                    <select
                      id={`q-correct-${q.id}`}
                      value={q.correctAnswerIndex}
                      onChange={(e) => updateQuiz(q.id, 'correctAnswerIndex', Number(e.target.value))}
                    >
                      <option value={0}>A</option>
                      <option value={1}>B</option>
                      <option value={2}>C</option>
                    </select>
                  </div>
                  <div className="form-field form-field--full">
                    <label htmlFor={`q-expde-${q.id}`}>Erklärung DE</label>
                    <textarea
                      id={`q-expde-${q.id}`}
                      value={q.explanationDe}
                      onChange={(e) => updateQuiz(q.id, 'explanationDe', e.target.value)}
                    />
                  </div>
                  <div className="form-field form-field--full">
                    <label htmlFor={`q-expfr-${q.id}`}>Erklärung FR</label>
                    <textarea
                      id={`q-expfr-${q.id}`}
                      value={q.explanationFr}
                      onChange={(e) => updateQuiz(q.id, 'explanationFr', e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => removeQuizQuestion(q.id)}
                >
                  Frage {i + 1} löschen
                </button>
              </div>
            ))}
            <button type="button" className="secondary-link" onClick={addQuizQuestion}>
              + Quizfrage hinzufügen
            </button>
          </div>

          <button className="primary-button form-field--full" type="submit">
            Objekt speichern
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="action-list">
          <Link className="secondary-link" to="/admin">
            Objektübersicht öffnen
          </Link>
          <Link className="secondary-link" to="/">
            Zurück
          </Link>
        </div>
      </section>
    </main>
  )
}

export default AdminPage
