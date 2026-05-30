import { useEffect, useState, useRef } from 'react'
import type { FormEventHandler, ChangeEvent, PointerEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getObjectById, updateObject } from '../api/ObjectApi'
import type { ObjectData, Hotspot, QuizQuestion } from '../types/ObjectData'

function EditObjectPage() {
  const { objectId } = useParams()
  const navigate = useNavigate()

  const [object, setObject] = useState<ObjectData | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [imagePreview, setImagePreview] = useState<string>('')
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    async function loadObject() {
      if (!objectId) {
        setError('Keine Objekt-ID vorhanden.')
        return
      }

      try {
        const loaded = await getObjectById(objectId)
        setObject(loaded)
        setHotspots(loaded.hotspots ?? [])
        setQuiz(loaded.quiz ?? [])

        if (loaded.imageUrl) {
          setImagePreview(loaded.imageUrl)
        }
      } catch {
        setError('Objekt konnte nicht geladen werden.')
      }
    }

    loadObject()
  }, [objectId])

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]

    if (file) {
      setImagePreview(URL.createObjectURL(file))
    }
  }

  function handleImagePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!imageRef.current) return

    if ((e.target as HTMLElement).closest('.hotspot-marker')) return

    const rect = imageRef.current.getBoundingClientRect()
    const rawX = ((e.clientX - rect.left) / rect.width) * 100
    const rawY = ((e.clientY - rect.top) / rect.height) * 100

    const x = Math.max(0, Math.min(100, rawX))
    const y = Math.max(0, Math.min(100, rawY))

    setHotspots((prev) => [
      ...prev,
      {
        id: `hs-${Date.now()}`,
        titleDe: '',
        titleFr: '',
        textDe: '',
        textFr: '',
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
      },
    ])
  }

  function updateHotspot(id: string, field: keyof Hotspot, value: string) {
    setHotspots((prev) =>
      prev.map((hs) => (hs.id === id ? { ...hs, [field]: value } : hs)),
    )
  }

  function removeHotspot(id: string) {
    setHotspots((prev) => prev.filter((hs) => hs.id !== id))
  }

  function addQuizQuestion() {
    setQuiz((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        questionDe: '',
        questionFr: '',
        answersDe: ['', '', ''],
        answersFr: ['', '', ''],
        correctAnswerIndex: 0,
        explanationDe: '',
        explanationFr: '',
      },
    ])
  }

  function updateQuiz(id: string, field: keyof QuizQuestion, value: unknown) {
    setQuiz((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    )
  }

  function updateQuizAnswer(
    id: string,
    lang: 'De' | 'Fr',
    index: number,
    value: string,
  ) {
    setQuiz((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q

        const arr = lang === 'De' ? [...q.answersDe] : [...q.answersFr]
        arr[index] = value

        return { ...q, [`answers${lang}`]: arr }
      }),
    )
  }

  function removeQuizQuestion(id: string) {
    setQuiz((prev) => prev.filter((q) => q.id !== id))
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!object) {
      setError('Objekt konnte nicht aktualisiert werden.')
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)
    const selectedImage = formData.get('image')
    const removeImage = formData.get('removeImage') === 'true'

    if (!removeImage && (!(selectedImage instanceof File) || selectedImage.size === 0)) {
      formData.delete('image')
      formData.set('imageUrl', object.imageUrl)
    }

    formData.set('id', object.id)
    formData.set('hotspots', JSON.stringify(hotspots))
    formData.set('quiz', JSON.stringify(quiz))

    try {
      await updateObject(object.id, formData)
      setMessage('Objekt wurde aktualisiert.')
      setTimeout(() => navigate('/admin'), 500)
    } catch {
      setError('Objekt konnte nicht aktualisiert werden.')
    }
  }

  if (error && !object) {
    return (
      <main className="app-page admin-page">
        <section className="card">
          <p className="eyebrow">Admin</p>
          <h1>Objekt bearbeiten</h1>
          <p className="error-message">{error}</p>
          <Link className="secondary-link" to="/admin">
            Zurück zur Übersicht
          </Link>
        </section>
      </main>
    )
  }

  if (!object) {
    return (
      <main className="app-page admin-page">
        <section className="card">
          <p>Objekt wird geladen...</p>
        </section>
      </main>
    )
  }

  return (
    <main className="app-page admin-page">
      <section className="card">
        <p className="eyebrow">Admin</p>
        <h1>Objekt bearbeiten</h1>

        <p className="form-hint">
          Objekt-ID: <strong>{object.id}</strong> wird nicht verändert.
        </p>

        <p className="form-hint">
          Felder mit <span className="required-star">*</span> sind Pflichtfelder.
        </p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-section-title form-field--full">
            <h2>A) Grunddaten</h2>
          </div>

          <div className="form-field">
            <label htmlFor="titleDe">
              Titel Deutsch <span className="required-star">*</span>
            </label>
            <input id="titleDe" name="titleDe" required defaultValue={object.titleDe} />
          </div>

          <div className="form-field">
            <label htmlFor="titleFr">
              Titel Französisch <span className="required-star">*</span>
            </label>
            <input id="titleFr" name="titleFr" required defaultValue={object.titleFr} />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="shortDe">
              Kurzbeschreibung Deutsch <span className="required-star">*</span>
            </label>
            <textarea id="shortDe" name="shortDe" required defaultValue={object.shortDe} />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="shortFr">Kurzbeschreibung Französisch</label>
            <textarea id="shortFr" name="shortFr" defaultValue={object.shortFr} />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="technicalDe">Technische Beschreibung Deutsch</label>
            <textarea id="technicalDe" name="technicalDe" defaultValue={object.technicalDe} />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="technicalFr">Technische Beschreibung Französisch</label>
            <textarea id="technicalFr" name="technicalFr" defaultValue={object.technicalFr} />
          </div>

          <div className="form-section-title form-field--full">
            <h2>B) Medien</h2>
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="image">Neues Bild hochladen</label>
            <input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {imagePreview && (
            <div className="form-field form-field--full">
              <p className="form-hint">Bild-Vorschau: Klicken für neuen Hotspot.</p>

              <div className="hotspot-preview" onPointerDown={handleImagePointerDown}>
                <img
                  ref={imageRef}
                  src={imagePreview}
                  alt="Vorschau"
                  style={{ cursor: 'crosshair' }}
                  className="object-image-preview"
                  draggable={false}
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

              {object.imageUrl && (
                <label className="checkbox-row">
                  <input type="checkbox" name="removeImage" value="true" />
                  Bild entfernen
                </label>
              )}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="imageAltDe">Bild-Alt-Text Deutsch</label>
            <input id="imageAltDe" name="imageAltDe" defaultValue={object.imageAltDe ?? ''} />
          </div>

          <div className="form-field">
            <label htmlFor="imageAltFr">Bild-Alt-Text Französisch</label>
            <input id="imageAltFr" name="imageAltFr" defaultValue={object.imageAltFr ?? ''} />
          </div>

          <div className="form-field">
            <label htmlFor="audioUrlDe">Audio-URL Deutsch</label>
            <input id="audioUrlDe" name="audioUrlDe" type="url" defaultValue={object.audioUrlDe ?? ''} />
          </div>

          <div className="form-field">
            <label htmlFor="audioUrlFr">Audio-URL Französisch</label>
            <input id="audioUrlFr" name="audioUrlFr" type="url" defaultValue={object.audioUrlFr ?? ''} />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="audioTranscriptDe">Audiotranskript Deutsch</label>
            <textarea id="audioTranscriptDe" name="audioTranscriptDe" defaultValue={object.audioTranscriptDe ?? ''} />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="audioTranscriptFr">Audiotranskript Französisch</label>
            <textarea id="audioTranscriptFr" name="audioTranscriptFr" defaultValue={object.audioTranscriptFr ?? ''} />
          </div>

          <div className="form-section-title form-field--full">
            <h2>C) Orientierung</h2>
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="locationHintDe">Standort-Hinweis Deutsch</label>
            <textarea id="locationHintDe" name="locationHintDe" defaultValue={object.locationHintDe ?? ''} />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="locationHintFr">Standort-Hinweis Französisch</label>
            <textarea id="locationHintFr" name="locationHintFr" defaultValue={object.locationHintFr ?? ''} />
          </div>

          <div className="form-section-title form-field--full">
            <h2>D) Hotspots</h2>
            <p className="form-hint">Klicken Sie auf die Bildvorschau oben, um Hotspots zu setzen.</p>
          </div>

          {hotspots.length > 0 && (
            <div className="form-field--full">
              {hotspots.map((hs, i) => (
                <div key={hs.id} className="hotspot-form-item">
                  <p className="form-hint">
                    Hotspot {i + 1} x: {hs.x}%, y: {hs.y}%
                  </p>

                  <div className="admin-form">
                    <div className="form-field">
                      <label htmlFor={`hs-tde-${hs.id}`}>Titel DE</label>
                      <input
                        id={`hs-tde-${hs.id}`}
                        value={hs.titleDe}
                        onChange={(e) => updateHotspot(hs.id, 'titleDe', e.target.value)}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor={`hs-tfr-${hs.id}`}>Titel FR</label>
                      <input
                        id={`hs-tfr-${hs.id}`}
                        value={hs.titleFr}
                        onChange={(e) => updateHotspot(hs.id, 'titleFr', e.target.value)}
                      />
                    </div>

                    <div className="form-field form-field--full">
                      <label htmlFor={`hs-xde-${hs.id}`}>Text DE</label>
                      <textarea
                        id={`hs-xde-${hs.id}`}
                        value={hs.textDe}
                        onChange={(e) => updateHotspot(hs.id, 'textDe', e.target.value)}
                      />
                    </div>

                    <div className="form-field form-field--full">
                      <label htmlFor={`hs-xfr-${hs.id}`}>Text FR</label>
                      <textarea
                        id={`hs-xfr-${hs.id}`}
                        value={hs.textFr}
                        onChange={(e) => updateHotspot(hs.id, 'textFr', e.target.value)}
                      />
                    </div>
                  </div>

                  <button type="button" className="danger-button" onClick={() => removeHotspot(hs.id)}>
                    Hotspot {i + 1} löschen
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="form-section-title form-field--full">
            <h2>E) Quiz</h2>
          </div>

          <div className="form-field--full quiz-editor">
            {quiz.map((q, i) => (
              <div key={q.id} className="quiz-form-item">
                <p className="form-hint">Frage {i + 1}</p>

                <div className="admin-form">
                  <div className="form-field form-field--full">
                    <label htmlFor={`qde-${q.id}`}>Frage DE</label>
                    <input
                      id={`qde-${q.id}`}
                      value={q.questionDe}
                      onChange={(e) => updateQuiz(q.id, 'questionDe', e.target.value)}
                    />
                  </div>

                  <div className="form-field form-field--full">
                    <label htmlFor={`qfr-${q.id}`}>Frage FR</label>
                    <input
                      id={`qfr-${q.id}`}
                      value={q.questionFr}
                      onChange={(e) => updateQuiz(q.id, 'questionFr', e.target.value)}
                    />
                  </div>

                  {(['A', 'B', 'C'] as const).map((label, idx) => (
                    <div key={`de-${label}`} className="form-field">
                      <label htmlFor={`ade-${q.id}-${idx}`}>Antwort {label} DE</label>
                      <input
                        id={`ade-${q.id}-${idx}`}
                        value={q.answersDe[idx] ?? ''}
                        onChange={(e) => updateQuizAnswer(q.id, 'De', idx, e.target.value)}
                      />
                    </div>
                  ))}

                  {(['A', 'B', 'C'] as const).map((label, idx) => (
                    <div key={`fr-${label}`} className="form-field">
                      <label htmlFor={`afr-${q.id}-${idx}`}>Antwort {label} FR</label>
                      <input
                        id={`afr-${q.id}-${idx}`}
                        value={q.answersFr[idx] ?? ''}
                        onChange={(e) => updateQuizAnswer(q.id, 'Fr', idx, e.target.value)}
                      />
                    </div>
                  ))}

                  <div className="form-field">
                    <label htmlFor={`cor-${q.id}`}>Richtige Antwort</label>
                    <select
                      id={`cor-${q.id}`}
                      value={q.correctAnswerIndex}
                      onChange={(e) => updateQuiz(q.id, 'correctAnswerIndex', Number(e.target.value))}
                    >
                      <option value={0}>A</option>
                      <option value={1}>B</option>
                      <option value={2}>C</option>
                    </select>
                  </div>

                  <div className="form-field form-field--full">
                    <label htmlFor={`expde-${q.id}`}>Erklärung DE</label>
                    <textarea
                      id={`expde-${q.id}`}
                      value={q.explanationDe}
                      onChange={(e) => updateQuiz(q.id, 'explanationDe', e.target.value)}
                    />
                  </div>

                  <div className="form-field form-field--full">
                    <label htmlFor={`expfr-${q.id}`}>Erklärung FR</label>
                    <textarea
                      id={`expfr-${q.id}`}
                      value={q.explanationFr}
                      onChange={(e) => updateQuiz(q.id, 'explanationFr', e.target.value)}
                    />
                  </div>
                </div>

                <button type="button" className="danger-button" onClick={() => removeQuizQuestion(q.id)}>
                  Frage {i + 1} löschen
                </button>
              </div>
            ))}

            <button type="button" className="secondary-link" onClick={addQuizQuestion}>
              + Quizfrage hinzufügen
            </button>
          </div>

          <button className="primary-button form-field--full" type="submit">
            Änderungen speichern
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <Link className="secondary-link" to="/admin">
          Zurück zur Übersicht
        </Link>
      </section>
    </main>
  )
}

export default EditObjectPage