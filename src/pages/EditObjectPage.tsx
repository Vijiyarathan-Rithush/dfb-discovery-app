import { useEffect, useState } from 'react'
import type { FormEventHandler } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getObjectById, saveObject } from '../api/ObjectApi'
import type { ObjectData } from '../types/ObjectData'

function EditObjectPage() {
  const { objectId } = useParams()
  const navigate = useNavigate()

  const [object, setObject] = useState<ObjectData | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadObject() {
      if (!objectId) {
        setError('Keine Objekt-ID vorhanden.')
        return
      }

      try {
        const loadedObject = await getObjectById(objectId)
        setObject(loadedObject)
      } catch {
        setError('Objekt konnte nicht geladen werden.')
      }
    }

    loadObject()
  }, [objectId])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    const form = event.currentTarget
    const formData = new FormData(form)

    const updatedObject: ObjectData = {
      id: String(formData.get('id')).trim(),
      titleDe: String(formData.get('titleDe')).trim(),
      titleFr: String(formData.get('titleFr')).trim(),
      shortDe: String(formData.get('shortDe')).trim(),
      shortFr: String(formData.get('shortFr')).trim(),
      technicalDe: String(formData.get('technicalDe')).trim(),
      technicalFr: String(formData.get('technicalFr')).trim(),
      imageUrl: String(formData.get('imageUrl')).trim(),
    }

    try {
      await saveObject(updatedObject)
      setMessage('Objekt wurde aktualisiert.')

      setTimeout(() => {
        navigate('/admin/objects')
      }, 500)
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

          <Link className="secondary-link" to="/admin/objects">
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

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="id">
              Objekt-ID <span className="required-star">*</span>
            </label>
            <input
              id="id"
              name="id"
              required
              readOnly
              defaultValue={object.id}
            />
          </div>

          <div className="form-field">
            <label htmlFor="titleDe">
              Titel Deutsch <span className="required-star">*</span>
            </label>
            <input
              id="titleDe"
              name="titleDe"
              required
              defaultValue={object.titleDe}
            />
          </div>

          <div className="form-field">
            <label htmlFor="titleFr">
              Titel Französisch <span className="required-star">*</span>
            </label>
            <input
              id="titleFr"
              name="titleFr"
              required
              defaultValue={object.titleFr}
            />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="shortDe">
              Kurzbeschreibung Deutsch <span className="required-star">*</span>
            </label>
            <textarea
              id="shortDe"
              name="shortDe"
              required
              defaultValue={object.shortDe}
            />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="shortFr">Kurzbeschreibung Französisch</label>
            <textarea
              id="shortFr"
              name="shortFr"
              defaultValue={object.shortFr}
            />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="technicalDe">Technische Beschreibung Deutsch</label>
            <textarea
              id="technicalDe"
              name="technicalDe"
              defaultValue={object.technicalDe}
            />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="technicalFr">Technische Beschreibung Französisch</label>
            <textarea
              id="technicalFr"
              name="technicalFr"
              defaultValue={object.technicalFr}
            />
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="imageUrl">Bild-URL</label>
            <input
              id="imageUrl"
              name="imageUrl"
              defaultValue={object.imageUrl}
            />
          </div>

          <button className="primary-button" type="submit">
            Änderungen speichern
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <Link className="secondary-link" to="/admin/objects">
          Zurück zur Übersicht
        </Link>
      </section>
    </main>
  )
}

export default EditObjectPage