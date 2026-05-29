import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getObjectById } from '../api/ObjectApi'
import type { ObjectData } from '../types/ObjectData'

function ObjectPage() {
  const { objectId } = useParams()
  const [object, setObject] = useState<ObjectData | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadObject() {
      if (!objectId) {
        setError('Keine Objekt-ID vorhanden.')
        setIsLoading(false)
        return
      }

      try {
        const loadedObject = await getObjectById(objectId)
        setObject(loadedObject)
      } catch {
        setError('Objekt konnte nicht geladen werden.')
      } finally {
        setIsLoading(false)
      }
    }

    loadObject()
  }, [objectId])

  if (isLoading) {
    return (
      <main className="app-page">
        <section className="card">
          <p>Objekt wird geladen...</p>
        </section>
      </main>
    )
  }

  if (error || !object) {
    return (
      <main className="app-page">
        <section className="card">
          <p className="eyebrow">Fehler</p>
          <h1>Objekt nicht gefunden</h1>
          <p>{error}</p>

          <Link className="secondary-link" to="/admin/objects">
            Zurück zur Übersicht
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="app-page">
      <section className="card">
        <p className="eyebrow">Objekt-ID: {object.id}</p>
        <h1>{object.titleDe}</h1>

        {object.imageUrl && (
          <img
            className="object-image"
            src={object.imageUrl}
            alt={object.titleDe}
          />
        )}

        <div className="info-block">
          <h2>Kurzbeschreibung</h2>
          <p>{object.shortDe}</p>
        </div>

        {object.technicalDe && (
          <div className="info-block">
            <h2>Technische Beschreibung</h2>
            <p>{object.technicalDe}</p>
          </div>
        )}

        <Link className="secondary-link" to="/">
          Zurück zur Startseite
        </Link>
      </section>
    </main>
  )
}

export default ObjectPage