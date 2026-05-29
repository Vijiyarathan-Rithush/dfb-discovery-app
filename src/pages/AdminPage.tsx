import { useState } from 'react'
import type { FormEventHandler } from 'react'
import { Link } from 'react-router-dom'
import { saveObject } from '../api/ObjectApi'

function AdminPage() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const rawId = String(formData.get('id')).trim()
    const safeId = rawId.toLowerCase().replace(/\s+/g, '-')

    formData.set('id', safeId)

    try {
      await saveObject(formData)
      setMessage('Objekt wurde gespeichert.')
      form.reset()
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
        </p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="id">
              Objekt-ID <span className="required-star">*</span>
            </label>
            <input id="id" name="id" required placeholder="z.B. hg34" />
          </div>

          <div className="form-field">
            <label htmlFor="titleDe">
              Titel Deutsch <span className="required-star">*</span>
            </label>
            <input
              id="titleDe"
              name="titleDe"
              required
              placeholder="Dampflokomotive HG 3/4"
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
              placeholder="Locomotive à vapeur HG 3/4"
            />
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

          <div className="form-field form-field--full">
            <label htmlFor="image">Bild hochladen</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
            />
          </div>

          <button className="primary-button" type="submit">
            Objekt speichern
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="action-list">
          <Link className="secondary-link" to="/admin/objects">
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